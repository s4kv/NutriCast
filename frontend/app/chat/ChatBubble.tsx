import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  mine: boolean;
  content: string;
  timestamp: string; // ISO string
}

export default function ChatBubble({ mine, content, timestamp }: Props) {
  return (
    <View style={[styles.row, mine && styles.rowReverse]}>
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[styles.text, { color: mine ? "#fff" : "#000" }]}>
          {content}
        </Text>
        <Text style={[styles.time, { color: mine ? "#fff" : "#888" }]}>
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginVertical: 4, paddingHorizontal: 8 },
  rowReverse: { flexDirection: "row-reverse" },

  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bubbleMine: { backgroundColor: "#007aff" },   // blue
  bubbleTheirs: { backgroundColor: "#e5e5ea" }, // light gray

  text: { fontSize: 16 },
  time: { fontSize: 10, textAlign: "right", marginTop: 2 },
});
