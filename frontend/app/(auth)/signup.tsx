import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase"; // path: app/firebase.ts
import api from "../backend"; // Axios instance (app/backend.ts)

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter e‑mail and password");
      return;
    }

    try {
      setLoading(true);

      // ① Firebase – creates account & e‑mail verification is optional
      await createUserWithEmailAndPassword(auth, email.trim(), password);

      // ② Backend – register provisional Mongo user
      await api.post("/api/users/register-email", {
        email: email.trim(),
        password,
      });

      // ③ Move to “choose username” screen
      router.replace("../choose-username");
    } catch (e: any) {
      // Firebase-specific codes first
      if (e.code === "auth/email-already-in-use") {
        setError("E‑mail already in use");
      } else if (e.response?.status === 409) {
        setError("E‑mail already exists");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <TextInput
        placeholder="E‑mail"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing up…" : "Sign up"}
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
    backgroundColor: "#007bff",
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
