/**
 * This files is responsible for the signup screen of NutriCast.
 */

import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";  
import { useRouter } from "expo-router";
import backend from "../backend";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Create user in firebase
      console.log("User signed up:", userCredential.user);

      // Send the user data to mongoDB.
      try {
        // Arguments of UserSignUpRequest.java in the backend.
        const requestBody = {
          email: email,
          password: password
        };

        // Send data to backend to save the user's account information to MongoDB.
        const response = await backend.post(
          "/api/users",
          requestBody
        );
        console.log("Response from backend: " + response.status);
      } catch (exception: any) {
        console.error("Error sending image to backend: " + exception);
      }

      Alert.alert("Success", "Account created successfully!");
      router.push("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Create Account" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
});
