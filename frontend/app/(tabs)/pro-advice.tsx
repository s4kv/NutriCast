import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { getIdToken } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import api from "../../services/backend";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function ProAdviceScreen() {
  const [posts, setPosts] = useState([]);
  const [isPro, setIsPro] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/pro-posts");
        const posts = res.data;

        const rawIds = posts.map((p: any) => p.authorId).filter(Boolean);
        const uniqueIds: string[] = Array.from(new Set(rawIds));
        const idToUsername: Record<string, string> = {};

        await Promise.all(
          uniqueIds.map(async (uid: string) => {
            try {
              const { data } = await api.get(
                `/api/users/username-from-uid/${uid}`
              );
              idToUsername[uid] = data;
            } catch (err) {
              console.error("Failed for UID:", uid, err);
              idToUsername[uid] = "unknown";
            }
          })
        );

        const enrichedPosts = posts.map((post) => ({
          ...post,
          resolvedUsername: idToUsername[post.authorId] || "unknown",
        }));

        setPosts(enrichedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    const checkPro = async () => {
      const token = await getIdToken(firebaseAuth.currentUser, true);
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setIsPro(decoded.isPro === true);
    };

    fetchData();
    checkPro();
  }, []);

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleString();

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={styles.title}>Pro Advice</Text>

      {isPro && (
        <Pressable onPress={() => router.push("/pro-advice/create")}>
          <Text style={styles.createButton}>+ Create New Post</Text>
        </Pressable>
      )}

      {posts.map((post, index) => (
        <View key={index} style={styles.postCard}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() =>
                router.push(`/pro-advice/${post.resolvedUsername}`)
              }
            >
              <Text style={styles.username}>{post.resolvedUsername}</Text>
            </Pressable>
            <FontAwesome
              name="check-circle"
              size={14}
              color="#007bff"
              style={{ marginLeft: 6 }}
            />
          </View>
          <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          {post.text && <Text style={styles.postText}>{post.text}</Text>}
          {post.imageUrl && (
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  createButton: { color: "blue", marginBottom: 16, fontSize: 16 },
  postCard: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  username: { fontWeight: "bold", fontSize: 16 },
  timestamp: { color: "gray", fontSize: 12, marginBottom: 6 },
  postText: { fontSize: 15 },
  image: { marginTop: 10, height: 200, borderRadius: 6 },
});
