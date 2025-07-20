import React from "react";
import { AuthProvider } from "../services/auth-context"; // adjust path as needed
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
