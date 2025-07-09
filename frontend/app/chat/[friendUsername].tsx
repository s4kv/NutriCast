/* app/chat/[friendUsername].tsx */
import React, { useCallback, useRef, useState } from "react";
import {
  View, FlatList, TextInput, Pressable,
  KeyboardAvoidingView, Platform, StyleSheet
} from "react-native";
import { Stack, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";        /* ← icon import */
import { auth } from "../firebase";
import { getIdToken } from "firebase/auth";
import api from "../backend";
import ChatBubble from "./ChatBubble";

/* ---- types ---- */
type Message = {
  id: string;
  senderUsername: string;
  recipientUsername: string;
  timestamp: string;
  content: string;
};

export default function ChatScreen() {
  const { friendUsername } = useLocalSearchParams<{ friendUsername: string }>();

  const flatRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  /* -------- load on every focus -------- */
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const token = await getIdToken(auth.currentUser!, true);
          const { data } = await api.get<Message[]>(
            `/api/friends/chats/with/${friendUsername}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages(data);
          setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 0);
        } catch (e) {
          console.error("Chat load error", e);
        }
      };
      load();
    }, [friendUsername])
  );

  /* -------- send -------- */
  const send = async () => {
    if (!draft.trim()) return;
    try {
      const token = await getIdToken(auth.currentUser!, true);
      const body = { recipientUsername: friendUsername, content: draft.trim() };
      const { data } = await api.post("/api/friends/chats", body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data.messages);
      setDraft("");
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
    } catch (e) {
      console.error("Send error", e);
    }
  };

  /* -------- UI -------- */
  return (
    <>
      <Stack.Screen options={{ title: friendUsername }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => (
            <ChatBubble
              mine={item.senderUsername !== friendUsername}
              content={item.content}
              timestamp={item.timestamp}
            />
          )}
        />

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            multiline
            value={draft}
            onChangeText={setDraft}
          />
          <Pressable style={styles.sendBtn} onPress={send}>
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

/* ---- styles ---- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  composer: {
    flexDirection: "row", alignItems: "flex-end",
    padding: 8, borderTopWidth: 1, borderColor: "#ddd",
  },
  input: { flex: 1, fontSize: 16, padding: 8, maxHeight: 100 },
  sendBtn: {
    width: 48, height: 48, marginLeft: 8,
    borderRadius: 24, backgroundColor: "#007aff",
    justifyContent: "center", alignItems: "center",   /* centered icon */
  },
});
