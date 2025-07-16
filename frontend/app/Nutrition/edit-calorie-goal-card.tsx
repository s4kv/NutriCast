import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Card } from "react-native-paper";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth-context";
import backend from "../../services/backend";
import { useRouter } from "expo-router";

/**
 * This tab is responsible for the edit calories goal
 */
export default function editCalorieGoalCard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [currentCalorieGoal, setCurrentCalorieGoal] = useState(""); // The user's current calorie goal
  const [newCalorieGoal, setNewCalorieGoal] = useState(""); // The new calorie goal
  const [newCalorieGoalInputError, setNewCalorieGoalInputError] = useState<Boolean>(); // Makes the newCalorieGoal field required

  // Sends the newCalorieGoal to the backend and updates it to the database
  const editCalorieGoal = async () => {
    if (newCalorieGoal.trim() === "") {
      setNewCalorieGoalInputError(true);
    } else {
      try {
        // Send the data to the backend to update the new calorie goal in the database
        const response = await backend.post(
          `/api/users/${user?.email}/nutrition/calories/goal`,
          newCalorieGoal,
        );
        console.log("Response from backend: " + response.status);
      } catch (exception: any) {
        console.error(
          "Error sending user's new calorie goal to backend: " + exception,
        );
      } finally {
        router.push("/(tabs)/dashboard");
      }
    }
  };

  useEffect(() => {
    // Get the user's current calorie goal
    backend
      .get(`/api/users/${user?.email}/nutrition/calories/goal`)
      .then((response) => setCurrentCalorieGoal(String(response.data)))
      .catch((error) => {
        console.error(error);
      });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Edit Calorie Goal</Text>
      <View style={{ paddingTop: 10 }}>
        <Card mode="elevated">
          <Card.Title title="Calorie Goal" />
          <Card.Content>
            <View style={styles.flexRowCenter}>
              <Text style={styles.heading3Text}>Calorie Goal: </Text>
              <TextInput
                placeholder={currentCalorieGoal}
                value={newCalorieGoal}
                onChangeText={(text) => {
                  setNewCalorieGoal(text);
                  setNewCalorieGoalInputError(false);
                }}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>
            {newCalorieGoalInputError && (
              <Text style={styles.errorText}>This field is required.</Text>
            )}
            <View style={styles.saveButton}>
              <Button title="Save" onPress={editCalorieGoal} />
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // General styling for all tabs.
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
  },
  heading1Text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  heading2Text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  heading3Text: {
    fontSize: 14,
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  flexColumnCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  flexRowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flexRowBaseline: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  flexSpaceEvenly: {
    display: "flex",
    justifyContent: "space-evenly",
  },

  // Specific styling for the tab.
  textInput: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  saveButton: {
    margin: "auto",
    paddingTop: 10,
  },
  errorText: {
    color: "red",
  },
});

