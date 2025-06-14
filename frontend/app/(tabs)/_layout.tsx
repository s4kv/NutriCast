import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          height: 60,
          paddingBottom: Platform.OS === "ios" ? 10 : 0,
          backgroundColor: "#fff",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="welcome"
        options={{
          title: "Welcome",
        }}
      />
      <Tabs.Screen
        name="nutricast"
        options={{
          title: "NutriCast",
        }}
      />
    </Tabs>
  );
}
