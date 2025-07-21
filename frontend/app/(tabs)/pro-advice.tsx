import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { getIdToken } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import api from "../../services/backend";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ProAdviceScreen() {
  const [posts, setPosts] = useState([]);
  const [isPro, setIsPro] = useState(false);
  const params = useLocalSearchParams();
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/pro-posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const checkProStatus = async () => {
    const token = await getIdToken(firebaseAuth.currentUser, true);
    const decoded = JSON.parse(atob(token.split(".")[1]));
    setIsPro(decoded.isPro === true);
  };

  useEffect(() => {
    fetchPosts();
    checkProStatus();
  }, []);

  useEffect(() => {
    if (params.refresh === "true") {
      fetchPosts();
    }
  }, [params.refresh]);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Pro Advice</Text>

      {isPro && (
        <Pressable onPress={() => router.push("/pro-advice/create")}>
          <Text style={{ color: "blue", marginBottom: 16 }}>+ Create New Post</Text>
        </Pressable>
      )}

      {posts.map((post, index) => (
        <View key={index} style={{ marginBottom: 20, padding: 12, backgroundColor: "#f2f2f2", borderRadius: 8 }}>
          <Text style={{ fontWeight: "bold" }}>{post.authorUsername}</Text>
          {post.text && <Text style={{ marginTop: 6 }}>{post.text}</Text>}
          {post.imageUrl && (
            <Image
              source={{ uri: post.imageUrl }}
              style={{ marginTop: 10, height: 200, borderRadius: 6 }}
              resizeMode="cover"
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
}
