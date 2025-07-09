import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function FriendProfile() {
  const { friendEmail } = useLocalSearchParams<{ friendEmail: string }>();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Stack.Screen options={{ title: friendEmail }} />
      <Text style={{ fontSize: 18 }}>Friend profile for {friendEmail}</Text>
      {/* TODO: fetch nutrition etc. */}
    </View>
  );
}
