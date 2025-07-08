import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { getIdToken } from "firebase/auth";
import { auth } from "../firebase";
import api, { respondToRequest } from "../backend"; 

type FriendRequest = {
  id: string;
  fromUsername: string;
  toUsername: string;
  status: string;
  sentAt?: string;
};

export default function FriendsScreen() {
  const [friends, setFriends] = useState<string[]>([]);
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  /* ------------------------------------------------------------- */

  const fetchAll = async () => {
    const token = await getIdToken(auth.currentUser!, true);
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [friendsRes, incRes, outRes] = await Promise.all([
        api.get("/api/friends", config),
        api.get("/api/friends/requests", config),
        api.get("/api/friends/requests/sent", config),
      ]);
      setFriends(friendsRes.data.map((u: any) => u.username));
      setIncoming(incRes.data);
      setOutgoing(outRes.data);
    } catch (e: any) {
      console.error("Fetch error", e);
    }
  };

  /* ------------------------------------------------------------- */

  const sendRequest = async () => {
    setError("");
    if (!username.trim()) {
      setError("Enter a username");
      return;
    }
    try {
      const token = await getIdToken(auth.currentUser!, true);
      await api.post(
        "/api/friends/request",
        { username: username.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsername("");
      await fetchAll();
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Something went wrong";
      setError(msg);
    }
  };

  /* ------------------------------------------------------------- */

  // Accept / decline handler
    const handleRespond = async (requestId: string, accept: boolean) => {
    const token = await getIdToken(auth.currentUser!, true);
    try {
        await api.post(
        "/api/friends/respond",
        { requestId, accept },
        { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchAll();
    } catch (e: any) {
        console.error("Respond error:", e);
    }
    };

  /* ------------------------------------------------------------- */

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [])
  );

  /* ------------------------------------------------------------- */

    const renderIncomingItem = ({ item }: { item: FriendRequest }) => (
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

  const renderList = (
    title: string,
    data: any[],
    label: "incoming" | "outgoing" | "friends"
  ) => (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) =>
            typeof item === "string" ? item : item.id
          }
          renderItem={
            label === "incoming"
              ? renderIncomingItem
              : ({ item }) => (
                  <Text style={styles.listItem}>
                    {label === "friends"
                      ? item
                      : label === "outgoing"
                      ? `To: ${item.toUsername}`
                      : ""}
                  </Text>
                )
          }
        />
      ) : (
        <Text style={styles.emptyText}>None</Text>
      )}
    </>
  );

  /* ------------------------------------------------------------- */

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

/* ------------------------------- styles ------------------------ */

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 24, marginBottom: 8 },
  listItem: { fontSize: 16, paddingVertical: 4 },
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

  /* ── new styles for action buttons ── */
  requestRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  actions: { flexDirection: "row", marginLeft: "auto" },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginLeft: 6 },
  acceptBtn: { backgroundColor: "#28a745" },
  declineBtn: { backgroundColor: "#dc3545" },
  actionText: { color: "#fff", fontSize: 14 },
});
