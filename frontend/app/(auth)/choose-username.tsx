import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { getIdToken } from "firebase/auth";

import { auth } from "../firebase"; // path: app/firebase.ts
import api from "../backend"; // Axios instance (app/backend.ts)

export default function ChooseUsername() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");

    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const token = await getIdToken(auth.currentUser!, true);

      await api.post(
        "/api/users/username",
        { username: username.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // On success, go to dashboard (tabs root)
      router.replace("/(tabs)/dashboard");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("Username is taken – try another");
      } else {
        setError("Could not set username. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a username</Text>

      <TextInput
        placeholder="@your_handle"
        autoCapitalize="none"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Saving…" : "Continue"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});
