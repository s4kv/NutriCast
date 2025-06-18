import React from "react";
import { AuthProvider } from "./auth-context"; // adjust path as needed
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
