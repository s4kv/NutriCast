import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Circle } from "react-native-svg";
import { useLocalSearchParams } from "expo-router";
import backend from "../../services/backend";

interface FoodLog {
  id: string;
  userId: string;
  foodId: string;
  meal: string;
  noOfServings: number;
  timeStamp: string;
}

export default function ProDashboardByUsername() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [friendEmail, setFriendEmail] = useState<string | null>(null);
  const [calorieGoal, setCalorieGoal] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);

  const caloriesRemaining = calorieGoal - caloriesConsumed + caloriesBurned;
  const netCalories = caloriesConsumed - caloriesBurned;
  const percentOfCalorieGoal =
    calorieGoal > 0
      ? Math.min(Math.max((netCalories / calorieGoal) * 100, 0), 100)
      : 0;

  useEffect(() => {
    const resolveEmail = async () => {
      try {
        console.log("Resolving email for username:", username);
        const res = await backend.get(`/api/users/email-from-username/${username}`);
        console.log("Resolved email:", res.data.email);
        setFriendEmail(res.data.email);
      } catch (err) {
        console.error("Failed to resolve username to email", err);
      }
    };

    resolveEmail();
  }, [username]);

  useEffect(() => {
    if (!friendEmail) {
      console.log("No email yet, skipping data fetch.");
      return;
    }

    console.log("Fetching data for email:", friendEmail);

    backend
      .get(`/api/users/${friendEmail}/nutrition/calories/today`)
      .then((response) => {
        console.log("Calories consumed:", response.data);
        setCaloriesConsumed(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch calories consumed", err);
      });

    backend
      .get(`/api/users/${friendEmail}/nutrition/calories/goal`)
      .then((response) => {
        console.log("Calorie goal:", response.data);
        setCalorieGoal(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch calorie goal", err);
      });

    backend
      .get(`/api/users/${friendEmail}/foods/logs/today`)
      .then((response) => {
        console.log("Food logs:", response.data);
        setFoodLogs(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch food logs", err);
      });
  }, [friendEmail]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titleText}>{username}&apos;s NutriCast Dashboard</Text>
        <View style={{ padding: 10 }}>
          <Text style={styles.heading1Text}>Today</Text>
          <Card mode="elevated">
            <View style={styles.flexRowBaseline}>
              <Card.Title title="Daily Calorie Progress" />
            </View>
            <Card.Content style={styles.flexColumn}>
              <View style={styles.circularProgress}>
                <AnimatedCircularProgress
                  size={200}
                  width={10}
                  fill={percentOfCalorieGoal}
                  tintColor="LimeGreen"
                  backgroundColor="grey"
                  rotation={0}
                  renderCap={({ center }) => (
                    <Circle cx={center.x} cy={center.y} r="5" fill="LimeGreen" />
                  )}
                  padding={5}
                >
                  {() => (
                    <View style={styles.flexColumnCenter}>
                      <Text style={styles.heading1Text}>{caloriesRemaining}</Text>
                      <Text>Remaining</Text>
                    </View>
                  )}
                </AnimatedCircularProgress>
              </View>
              <View style={styles.flexSpaceEvenly}>
                <View style={styles.flexColumnCenter}>
                  <Text style={styles.heading3Text}>Goal:</Text>
                  <Text style={styles.heading1Text}>{calorieGoal} 🎯</Text>
                </View>
                <View style={styles.flexColumnCenter}>
                  <Text style={styles.heading3Text}>Consumed:</Text>
                  <Text style={styles.heading1Text}>{caloriesConsumed} 🍽️</Text>
                </View>
                <View style={styles.flexColumnCenter}>
                  <Text style={styles.heading3Text}>Burned:</Text>
                  <Text style={styles.heading1Text}>{caloriesBurned} 🔥</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={{ padding: 10 }}>
          <Card>
            <Card.Content>
              <Card.Title title="Food Logged Today" />
              <Card.Content style={styles.flexColumn}>
                {["BREAKFAST", "LUNCH", "DINNER", "SNACK"].map((mealType) => (
                  <View key={mealType} style={styles.foodLogContainer}>
                    <View style={styles.mealContainer}>
                      <Text style={styles.customHeading2Text}>{mealType}</Text>
                      {foodLogs
                        .filter((log) => log.meal === mealType)
                        .map((log, i) => (
                          <Text key={i}>{JSON.stringify(log)}</Text>
                        ))}
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  flexRowBaseline: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  flexSpaceEvenly: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  circularProgress: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 10,
    margin: "auto",
  },
  foodLogContainer: {
    paddingTop: 10,
  },
  mealContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "lightgrey",
    padding: 10,
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 0,
  },
  customHeading2Text: {
    fontSize: 16,
    fontWeight: "bold",
    width: "100%",
    borderBottomWidth: 1,
  },
});
