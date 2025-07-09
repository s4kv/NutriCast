import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getIdToken } from "firebase/auth";
import { auth } from "../firebase";
import api from "../backend";
import { useRouter } from "expo-router";

/* ---------------- types ---------------- */
type FriendRequest = {
  id: string;
  fromUsername: string;
  toUsername: string;
  status: string;
  sentAt?: string;
};

export default function FriendsScreen() {
  const router = useRouter();

  const [friends, setFriends] = useState<string[]>([]);
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  /* --------------- fetch helpers ---------------- */
  const fetchAll = async () => {
    const token = await getIdToken(auth.currentUser!, true);
    const cfg = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [friendsRes, incRes, outRes] = await Promise.all([
        api.get("/api/friends", cfg),
        api.get("/api/friends/requests", cfg),
        api.get("/api/friends/requests/sent", cfg),
      ]);
      setFriends(friendsRes.data.map((u: any) => u.username));
      setIncoming(incRes.data);
      setOutgoing(outRes.data);
    } catch (e) {
      console.error("Fetch friends error:", e);
    }
  };

  /* -------- send request ---------- */
  const sendRequest = async () => {
    setError("");
    if (!username.trim()) return setError("Enter a username");

    try {
      const token = await getIdToken(auth.currentUser!, true);
      await api.post(
        "/api/friends/request",
        { username: username.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUsername("");
      await fetchAll();
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Something went wrong";
      setError(msg);
    }
  };

  /* -------- respond to incoming ---------- */
  const handleRespond = async (requestId: string, accept: boolean) => {
    const token = await getIdToken(auth.currentUser!, true);
    try {
      await api.post(
        "/api/friends/respond",
        { requestId, accept },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchAll();
    } catch (e) {
      console.error("Respond error:", e);
    }
  };

  /* -------- on focus ---------- */
  useFocusEffect(useCallback(() => { fetchAll(); }, []));

  /* -------- render helpers ---------- */
  const FriendRow = ({ name }: { name: string }) => (
    <View style={styles.friendRow}>
      <Text style={styles.listItem}>{name}</Text>

<Pressable
  style={styles.chatBtn}
  onPress={() =>
    router.push({
      pathname: "/chat/[friendUsername]",
      params: {
        friendUsername: name,
        myUsername:
          auth.currentUser?.displayName ||
          auth.currentUser?.email?.split("@")[0] ||
          "unknown",
      },
    })
  }
>
  <FontAwesome name="comment" size={18} color="#fff" />
</Pressable>
    </View>
  );

  const IncomingRow = ({ item }: { item: FriendRequest }) => (
    <View style={styles.requestRow}>
      <Text style={styles.requestText}>From: {item.fromUsername}</Text>
      <Pressable
        style={[styles.actionBtn, styles.acceptBtn]}
        onPress={() => handleRespond(item.id, true)}
      >
        <Text style={styles.actionText}>✔</Text>
      </Pressable>
      <Pressable
        style={[styles.actionBtn, styles.declineBtn]}
        onPress={() => handleRespond(item.id, false)}
      >
        <Text style={styles.actionText}>✖</Text>
      </Pressable>
    </View>
  );

  const renderList = (title: string, data: any[], label: "friends" | "incoming" | "outgoing") => (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length ? (
        <FlatList
          data={data}
          keyExtractor={(item) => (typeof item === "string" ? item : item.id)}
          renderItem={
            label === "friends"
              ? ({ item }) => <FriendRow name={item} />
              : label === "incoming"
                ? IncomingRow
                : ({ item }) => (
                    <Text style={styles.listItem}>To: {item.toUsername}</Text>
                  )
          }
        />
      ) : (
        <Text style={styles.emptyText}>None</Text>
      )}
    </>
  );

  /* ----------- ui ----------- */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>

      {renderList("Current Friends", friends, "friends")}
      {renderList("Incoming Requests", incoming, "incoming")}
      {renderList("Sent Requests", outgoing, "outgoing")}

      <TextInput
        placeholder="Add friend by username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable onPress={sendRequest} style={styles.button}>
        <Text style={styles.buttonText}>Send Request</Text>
      </Pressable>
    </View>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 16 },

  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 24, marginBottom: 8 },
  listItem: { fontSize: 16 },
  emptyText: { fontSize: 14, fontStyle: "italic", color: "#999" },

  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8,
    marginTop: 32, marginBottom: 12, fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff", padding: 14, borderRadius: 8, alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  error: { color: "red", marginBottom: 8, textAlign: "center" },

  /* friend row */
  friendRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  chatBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 6, // same as actionBtn
    backgroundColor: "#007aff", // optional: adds a blue background for visibility
  },

  /* incoming request row */
  requestRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  requestText: { fontSize: 16 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginLeft: 6 },
  acceptBtn: { backgroundColor: "#28a745" },
  declineBtn: { backgroundColor: "#dc3545" },
  actionText: { color: "#fff", fontSize: 14 },
});
