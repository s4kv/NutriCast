import React, { useState } from "react";
import { View, TextInput, Text, Pressable, Alert } from "react-native";
import { getIdToken } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import api from "../../services/backend";
import { useRouter } from "expo-router";

export default function CreateProPostScreen() {
  const [text, setText] = useState("");
  const router = useRouter();

  const submitPost = async () => {
    try {
      const token = await getIdToken(firebaseAuth.currentUser, true);
      await api.post(
        "/api/pro-posts",
        { text, imageUrl: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Post created!");
      router.replace({ pathname: "/(tabs)/pro-advice", params: { refresh: "true" } });
    } catch (err) {
      console.error("Error posting:", err);
      Alert.alert("Failed to create post.");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Write your advice</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type something..."
        multiline
        style={{ height: 120, borderColor: "#ccc", borderWidth: 1, borderRadius: 6, padding: 10 }}
      />

      <Pressable onPress={submitPost} style={{ marginTop: 20 }}>
        <Text style={{ color: "green", fontSize: 16 }}>Submit</Text>
      </Pressable>
    </View>
  );
}
