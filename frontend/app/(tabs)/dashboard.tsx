import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Button,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useAuth } from "../../services/auth-context";
import backend from "../../services/backend";
import { Circle } from "react-native-svg";
import * as Emoji from "node-emoji";
import { useRouter } from "expo-router";

interface FoodLogDetailsDto {
  foodLogId: string,
  userId: string,
  foodId: string,
  meal: string,
  noOfServings: number,
  timeStamp: string,
  name: string,
  type: string,
  servingSize: number,
  servingUnit: string,
  macros: FoodMacros
}

interface FoodMacros {
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  fiber: number,
  sugar: number,
  sodium: number,
  chloresterol: number
}

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth(); // Get the authenticated user from the auth context
  const [calorieGoal, setCalorieGoal] = useState(0); // User's goal for daily calorie intake
  const [caloriesConsumed, setCaloriesConsumed] = useState(0); // User's calories consumed today
  const [caloriesBurned, setCaloriesBurned] = useState(0); // User's calories burned from exercise today
  const [foodLogs, setFoodLogs] = useState<FoodLogDetailsDto[]>([]); // User's foodLogs today
  const [foodLogMealTypes, setFoodLogMealTypes] = useState<string[]>(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]); // Types of food log meal types

  // gemini
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<String | null>(null);

  const caloriesRemaining = calorieGoal - caloriesConsumed + caloriesBurned; // User's remaining calories for the day
  const netCalories = caloriesConsumed - caloriesBurned; // User's net calorie intake
  const percentOfCalorieGoal =
    calorieGoal > 0
      ? Math.min(Math.max((netCalories / calorieGoal) * 100, 0), 100)
      : 0; // User's percentage of completion to the calorie goal

  const [isEditGoalButtonHovered, setIsEditGoalButtonHovered] =
    useState<boolean>(false); // Whether the Edit Goal button is hovered on or not
  const [hoveredMealButton, setHoveredMealButton] = useState<string | null>(
    null,
  ); // Checks which + Log Food button is being hovered on

  // Redirects the user to a new tab, edit-calories-card.
  const redirectToEditCaloriesCard = () => {
    router.push("/Nutrition/edit-calorie-goal-card");
  };

  // Redirects the user to the log-food.tsx tab.
  const redirectToLogFoodTab = () => {
    router.push("/(tabs)/log-food");
  };

  useEffect(() => {
    if (user) {
      // Get the user's calories logged today
      backend
        .get(`/api/users/${user?.email}/nutrition/calories/today`)
        .then((response) => {
          setCaloriesConsumed(response.data)
        })
        .catch((error) => {
          console.error(error);
        });
      
      // Get the user's calorie goal
      backend
        .get(`/api/users/${user?.email}/nutrition/calories/goal`)
        .then((response) => setCalorieGoal(response.data))
        .catch((error) => {
          console.error(error);
        });
      
      // Gets the user's foodLogs today
      backend.get(`/api/users/${user?.email}/foods/logs/today/details`)
        .then((response) => {
          setFoodLogs(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  // TODO: you should change this rex
  const gemini_analytics = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    setIsLoading(true);
    const message = `User ${user?.email} has logged ${caloriesConsumed} calories today, with a goal of ${calorieGoal} calories. The user has consumed ${netCalories} net calories. Based on this data, suggest a healthy meal plan for the user to meet their daily nutritional needs.`;
    const requestBody = {
      userMessage: message, // Use the argument
    };
    const responseAI = await backend.post("/api/gemini/chat", requestBody);
    if (responseAI.status !== 200) {
      console.error("Error fetching data from the backend");
      setIsLoading(false);
      return;
    }

    setResponse(responseAI.data);
    setIsLoading(false);
  };

  return (
    <ScrollView
      style={{
        height: "100%",
        backgroundColor: "#FCFDF7",
      }}
    >
      <View
        style={{
          padding: 10,
        }}
      >
        <View
          style={{
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 26,
              textAlign: "center",
            }}
          >
            Dashboard
          </Text>
          <Text
            style={{
              fontFamily: "Nunito-Regular",
              fontSize: 14,
              textAlign: "center",
              color: "#6B7280",
            }}
          >
            Your daily nutritional progress at a glance.
          </Text>
        </View>
        <View style={{ width: "100%" }}>
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 20,
              paddingBottom: 15,
              color: "#333333",
            }}
          >
            Today
          </Text>
          <View
            style={{
              width: "100%",
              borderStyle: "solid",
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "grey",
              backgroundColor: "#FFFFFF",
            }}
          >
            <View
              style={{
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Regular",
                  fontSize: 16,
                }}
              >
                Daily Calorie Progress
              </Text>
              <Pressable
                onPress={redirectToEditCaloriesCard}
                onPressIn={() => {
                  setIsEditGoalButtonHovered(true);
                }}
                onPressOut={() => {
                  setIsEditGoalButtonHovered(false);
                }}
                onHoverIn={() => {
                  setIsEditGoalButtonHovered(true);
                }}
                onHoverOut={() => {
                  setIsEditGoalButtonHovered(false);
                }}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <Text
                  style={
                    isEditGoalButtonHovered
                      ? {
                          fontFamily: "Nunito-Regular",
                          fontSize: 16,
                          color: "#6a8970",
                        }
                      : {
                          fontFamily: "Nunito-Regular",
                          fontSize: 16,
                          color: "#84a98c",
                        }
                  }
                >
                  Edit Goal
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                paddingTop: 5,
                paddingBottom: 5,
              }}
            >
              <AnimatedCircularProgress
                size={200}
                width={10}
                fill={percentOfCalorieGoal}
                tintColor="#84a98c"
                backgroundColor="#E0E0E0"
                rotation={0}
                renderCap={({ center }) => (
                  <Circle cx={center.x} cy={center.y} r="5" fill="#84a98c" />
                )}
                style={{
                  margin: "auto",
                }}
              >
                {() => (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 26,
                      }}
                    >
                      {caloriesRemaining}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito-Regular",
                        fontSize: 14,
                        color: "#6B7280",
                      }}
                    >
                      Remaining
                    </Text>
                  </View>
                )}
              </AnimatedCircularProgress>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                  }}
                >
                  {Emoji.emojify(":dart:")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",
                    fontSize: 20,
                  }}
                >
                  {calorieGoal}
                </Text>
                <Text
                  style={{
                    fontFamily: "Nunito-Regular",
                    fontSize: 14,
                    color: "#6B7280",
                  }}
                >
                  Goal
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                  }}
                >
                  {Emoji.emojify(":fork_and_knife:")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",
                    fontSize: 20,
                  }}
                >
                  {caloriesConsumed}
                </Text>
                <Text
                  style={{
                    fontFamily: "Nunito-Regular",
                    fontSize: 14,
                    color: "#6B7280",
                  }}
                >
                  Consumed
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                  }}
                >
                  {Emoji.emojify(":fire:")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",
                    fontSize: 20,
                  }}
                >
                  {caloriesBurned}
                </Text>
                <Text
                  style={{
                    fontFamily: "Nunito-Regular",
                    fontSize: 14,
                    color: "#6B7280",
                  }}
                >
                  Burned
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ paddingTop: 10 }}>
          <View
            style={{
              width: "100%",
              borderStyle: "solid",
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "grey",
              backgroundColor: "#FFFFFF",
            }}
          >
            <View style={{ padding: 10 }}>
              <Text
                style={{
                  fontFamily: "Nunito-Regular",
                  fontSize: 16,
                }}
              >
                Food Logs Today
              </Text>
            </View>
            <View
              style={{
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              {foodLogMealTypes.map((mealType, index) => (
                <View
                  key={index}
                  style={{
                    paddingTop: 10,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                      borderRadius: 5,
                      backgroundColor: "#FCFDF7",
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",
                          fontSize: 14,
                        }}
                      >
                        {mealType}
                      </Text>
                      <Pressable
                        onPress={redirectToLogFoodTab}
                        onPressIn={() => {
                          setHoveredMealButton(mealType);
                        }}
                        onPressOut={() => {
                          setHoveredMealButton(null);
                        }}
                        onHoverIn={() => {
                          setHoveredMealButton(mealType);
                        }}
                        onHoverOut={() => {
                          setHoveredMealButton(null);
                        }}
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                        }}
                      >
                        <Text
                          style={
                            hoveredMealButton === mealType
                              ? {
                                  fontFamily: "Nunito-Regular",
                                  fontSize: 14,
                                  color: "#6a8970",
                                }
                              : {
                                  fontFamily: "Nunito-Regular",
                                  fontSize: 14,
                                  color: "#84a98c",
                                }
                          }
                        >
                          + Log Food
                        </Text>
                      </Pressable>
                    </View>
                    <View
                      style={{
                        paddingBottom: 10,
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                    >
                      {(() => {
                        const filteredFoodLogs = foodLogs.filter(
                          (foodLog) => foodLog.meal === `${mealType}`,
                        );
                        if (filteredFoodLogs.length === 0) {
                          return (
                            <View
                              style={{
                                paddingTop: 5,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "Nunito-Regular",
                                  fontSize: 14,
                                  textAlign: "center",
                                  color: "#6B7280",
                                }}
                              >
                                No food logs for this meal.
                              </Text>
                            </View>
                          );
                        } else {
                          return filteredFoodLogs.map((foodLog, index) => (
                            <View key={index} style={{
                              paddingTop: 5
                            }}>
                              <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                              }}>
                                <Text style={{
                                  fontFamily: 'Nunito-Regular',
                                  fontSize: 14,
                                  width: '80%',
                                  wordWrap: 'break-word',
                                  textAlign: 'left'
                                }}>{foodLog.name}</Text>
                                <Text style={{
                                  fontFamily: 'Nunito-Regular',
                                  fontSize: 14,
                                  width: '20%',
                                  wordWrap: 'break-word',
                                  textAlign: 'right',
                                  verticalAlign: 'middle'
                                }}>{foodLog.macros.calories} kcal</Text>
                              </View> 
                            </View> 
                          ))
                        }
                      })()}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          {/* Button to trigger gemini analytics */}
          <Pressable
            onPress={gemini_analytics}
            style={{
              backgroundColor: "#6c63ff",
              padding: 10,
              borderRadius: 5,
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              Get Analytics with AI
            </Text>
          </Pressable>

          {/* Loader */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6c63ff" />
              <Text style={styles.infoText}>Processing...</Text>
            </View>
          )}

          {response && (
            <Text
              style={{
                fontFamily: "Nunito-Regular",
                fontSize: 16,
                color: TEXT,
                marginTop: 20,
              }}
            >
              {response}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// Style sheet for the dashboard screen.
// TODO: Input all the styles used above into a stylesheet for readability purposes.
const TEXT = "#34495e"; // Muted dark slate

const styles = StyleSheet.create({
  loadingContainer: {
    marginTop: 30,
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 20,
  },

  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: TEXT,
  },
});
