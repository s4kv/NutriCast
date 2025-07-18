import {  Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

export default function TabLayout() {
  // Font styles
  const [fontsLoaded, fontError] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold
  });

  // If fonts are not loaded, then don't render anything.
  if (!fontsLoaded && !fontError) {
    return null;
  }
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
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="nutricast"
        options={{
          title: "NutriCast",
        }}
      />
      <Tabs.Screen
        name="nutrimeal"
        options={{
          title: "NutriMeal",
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
        }}
      />
      <Tabs.Screen
        name="log-food"
        options={{
          title: "Log Food",
        }}
      />
    </Tabs>
  );
}
