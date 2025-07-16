import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../services/auth-context";
import { ProtectedRoute } from "../../services/protected-route";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome, {user?.email}</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    </ProtectedRoute>
  );
}
