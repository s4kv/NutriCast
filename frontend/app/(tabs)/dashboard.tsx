/**
 * This file is responsible for the dashboard screen of NutriCast.
 * It will include:
 * - a circular progress bar of the calories consumed today by default with the amount of calories consumed from food and burned from exercise.
 * - goals for the day like number of steps and calories burned from exercise where the user can set their own personalized goals.
 * - a line chart of the user's weight and number of steps over days.
 *
 * GOALS:
 * - Implement the circular progress bar to show calories consumed in the day. (In Progress)
 * - Implement the daily goals.
 * - Implement the line chart to show the user's weight.
 *
  * TODO:
 * - Implement the circular progress bar to show calories consumed in the day.
 * 
 * COMPLETED:
 * - When a user makes an account from firebase, it also adds the user's account information to mongoDB.
 * - User can change their calorie goal
 * - Made UI for log food tab.
 * - Make addFood.tsx frontend file.
 * - Update Food.java model to include the userId of the user adding the food.
 * - Update FoodRepository.java to include a method called findByNameAndUserId.
 * - Test it on BackendApplication.java to make sure all methods in FoodRepository.java work.
 * - Make FoodService.java to handle all business logic.
 * - Make FoodController.java to handle all api endpoints.
 *    - Make @PostMapping method in FoodController.java which saves the food into mongoDB.
 *    - Make @GetMapping method in FoodController.java which shows the list of foods from mongoDB.
 * - Update log-food.tsx file to use the backend to get the food data.
 * - Users can add food seamlessly in the application.
 * - Users can log food seamlessly in the application.
 * - Change dashboard UI.
 * - fix [friendEmail].tsx
 * - Make a page where the user can add food manually and log food manually.
 */

import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Animated, Button, Pressable } from "react-native";
import { Card } from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useAuth } from "../../services/auth-context";
import backend from "../../services/backend";
import { Circle } from "react-native-svg";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Emoji from "node-emoji";
import { useRouter } from "expo-router";

interface FoodLog {
  id: String,
  userId: String,
  foodId: String,
  meal: String,
  noOfServings: number,
  timeStamp: String
}

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth(); // Get the authenticated user from the auth context
  const [calorieGoal, setCalorieGoal] = useState(0); // User's goal for daily calorie intake
  const [caloriesConsumed, setCaloriesConsumed] = useState(0); // User's calories consumed today
  const [caloriesBurned, setCaloriesBurned] = useState(0); // User's calories burned from exercise today
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]); // User's foodLogs today

  const caloriesRemaining = calorieGoal - caloriesConsumed + caloriesBurned; // User's remaining calories for the day
  const netCalories = caloriesConsumed - caloriesBurned; // User's net calorie intake
  const percentOfCalorieGoal =
    calorieGoal > 0
      ? Math.min(Math.max((netCalories / calorieGoal) * 100, 0), 100)
      : 0; // User's percentage of completion to the calorie goal

  const [isEditGoalButtonHovered, setIsEditGoalButtonHovered] = useState<Boolean>(false); // Whether the Edit Goal button is hovered on or not

  // Redirects the user to a new tab, edit-calories-card.
  const redirectToEditCaloriesCard = () => {
    router.push("/Nutrition/edit-calorie-goal-card");
  };

  // Redirects the user to the log-food.tsx tab.
  const redirectToLogFoodTab = () => {
    router.push("/(tabs)/log-food");
  }

  useEffect(() => {
    if (user) {
      // Get the user's calories logged today
      backend
        .get(`/api/users/${user?.email}/nutrition/calories/today`)
        .then((response) => setCaloriesConsumed(response.data))
        .catch((error) => {
          console.error(error);
        });
      }

      // Get the user's calorie goal
      backend
        .get(`/api/users/${user?.email}/nutrition/calories/goal`)
        .then((response) => setCalorieGoal(response.data))
        .catch((error) => {
          console.error(error);
        });
      
      // Gets the user's foodLogs today
      backend.get(`/api/users/${user?.email}/foods/logs/today`)
        .then((response) => {
          setFoodLogs(response.data);
        })
        .catch((error) => {
          console.error(error);
        })
  }, [user]);

  return (
    <ScrollView>
      <View style={{
        padding: 10,
        backgroundColor: '#FCFDF7'
      }}>
        <View style={{
          paddingBottom: 20
        }}>
          <Text style={{
            fontFamily: 'Nunito-Bold',
            fontSize: 26,
            textAlign: 'center'
          }}>Dashboard</Text>
          <Text style={{
            fontFamily: 'Nunito-Regular',
            fontSize: 14,
            textAlign: 'center',
            color: '#6B7280'
          }}>Your daily nutritional progress at a glance.</Text>
        </View>
        <View style={{ width: '100%'}}>
          <Text style={{
            fontFamily: 'Nunito-Bold',
            fontSize: 20,
            paddingBottom: 15,
            color: '#333333'
            }}>Today</Text>
          <View style={{
            width: '100%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'grey',
            backgroundColor: '#FFFFFF'
          }}>
            <View style={{
              padding: 10
            }}>
              <Text style={{
                fontFamily: 'Nunito-Regular',
                fontSize: 16
              }}>Daily Calorie Progress</Text>
              <Pressable onPress={redirectToEditCaloriesCard}
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
                          position: 'absolute',
                          top: 10,
                          right: 10
              }}>
                <Text style={
                        isEditGoalButtonHovered ?
                      {
                        fontFamily: 'Nunito-Regular',
                        fontSize: 16,
                        color: '#6a8970'
                      }
                      :
                      {
                        fontFamily: 'Nunito-Regular',
                        fontSize: 16,
                        color: '#84a98c'
                      }
                }>Edit Goal</Text>
              </Pressable>
            </View>
            <View style={{
              paddingTop: 5,
              paddingBottom: 5
            }}>
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
                  margin: 'auto',
                }}
              >
                {() => (
                  <View style={styles.flexColumnCenter}>
                    <Text style={{
                      fontFamily: 'Nunito-Bold',
                      fontSize: 26
                    }}>{caloriesRemaining}</Text>
                    <Text style={{
                      fontFamily: 'Nunito-Regular',
                      fontSize: 14,
                      color: '#6B7280'
                    }}>Remaining</Text>
                  </View>
                )}
              </AnimatedCircularProgress>
            </View>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              paddingTop: 10,
              paddingBottom: 10
            }}>
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 20
                }}>{Emoji.emojify(':dart:')}</Text>
                <Text style={{
                  fontFamily: 'Nunito-Bold',
                  fontSize: 20
                }}>{calorieGoal}</Text>
                <Text style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 14,
                  color: '#6B7280'
                }}>Goal</Text>
              </View>
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 20
                }}>{Emoji.emojify(':fork_and_knife:')}</Text>
                <Text style={{
                  fontFamily: 'Nunito-Bold',
                  fontSize: 20
                }}>{caloriesConsumed}</Text>
                <Text style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 14,
                  color: '#6B7280'
                }}>Consumed</Text>
              </View>
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 20
                }}>{Emoji.emojify(':fire:')}</Text>
                <Text style={{
                  fontFamily: 'Nunito-Bold',
                  fontSize: 20
                }}>{caloriesBurned}</Text>
                <Text style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 14,
                  color: '#6B7280'
                }}>Burned</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{width: '100%', paddingTop: 20}}>
          <Text style={[styles.heading1Text, {paddingBottom: 10}]}>Food Logged</Text>
          <Card>
            <Card.Content>
              <Card.Title title='Daily Food Logs'/>
              <Card.Content style={styles.flexColumn}>
                  {foodLogs.length == 0 ?
                    <View>
                      <View style={styles.flexColumn}>
                        <View style={styles.foodLogContainer}>
                          <View style={styles.mealContainer}>
                            <Text style={styles.customHeading2Text}>Breakfast</Text>
                            <Text onPress={redirectToLogFoodTab} style={styles.logFood}>Log Food</Text>
                          </View>
                        </View>
                        <View style={styles.foodLogContainer}>
                          <View style={styles.mealContainer}>
                            <Text style={styles.customHeading2Text}>Lunch</Text>
                            <Text onPress={redirectToLogFoodTab} style={styles.logFood}>Log Food</Text>
                          </View>
                        </View>
                        <View style={styles.foodLogContainer}>
                          <View style={styles.mealContainer}>
                            <Text style={styles.customHeading2Text}>Dinner</Text>
                            <Text onPress={redirectToLogFoodTab} style={styles.logFood}>Log Food</Text>
                          </View>
                        </View>
                        <View style={styles.foodLogContainer}>
                          <View style={styles.mealContainer}>
                            <Text style={styles.customHeading2Text}>Snack</Text>
                            <Text onPress={redirectToLogFoodTab} style={styles.logFood}>Log Food</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    :
                    <View>
                        <View>
                          <View style={styles.flexColumn}>
                            <View style={styles.foodLogContainer}>
                              <View style={styles.mealContainer}>
                                <Text style={styles.customHeading2Text}>Breakfast</Text>
                                {foodLogs
                                  .filter((foodLog) => foodLog.meal === "BREAKFAST")
                                  .map((foodLog, idx) => (
                                    <View key={idx} style={styles.flexRowCenter}>
                                      <View>
                                        <Text>{JSON.stringify(foodLog)}</Text>
                                      </View>
                                      <View>
                                      </View>
                                    </View>
                                  ))
                                }
                                <Text onPress={redirectToLogFoodTab} style={styles.logFood}>Log Food</Text>
                              </View>
                            </View>
                            <View style={styles.foodLogContainer}>
                              <View style={styles.mealContainer}>
                                <Text style={styles.customHeading2Text}>Lunch</Text>
                                {foodLogs
                                  .filter((foodLog) => foodLog.meal === "LUNCH")
                                  .map((foodLog, idx) => (
                                    <View key={idx} style={styles.flexRowCenter}>
                                      <View>
                                        <Text>{JSON.stringify(foodLog)}</Text>
                                      </View>
                                      <View>
                                      </View>
                                    </View>
                                  ))
                                }
                                <Text onPress={redirectToLogFoodTab} style={styles.logFood}>Log Food</Text>
                              </View>
                            </View>
                            <View style={styles.foodLogContainer}>
                              <View style={styles.mealContainer}>
                                <Text style={styles.customHeading2Text}>Dinner</Text>
                                {foodLogs
                                  .filter((foodLog) => foodLog.meal === "DINNER")
                                  .map((foodLog, idx) => (
                                    <View key={idx} style={styles.flexRowCenter}>
                                      <View>
                                        <Text>{JSON.stringify(foodLog)}</Text>
                                      </View>
                                      <View>
                                      </View>
                                    </View>
                                  ))
                                }
                                <Text onPress={redirectToLogFoodTab} style={styles.logFood}>Log Food</Text>
                              </View>
                            </View>
                            <View style={styles.foodLogContainer}>
                              <View style={styles.mealContainer}>
                                <Text style={styles.customHeading2Text}>Snack</Text>
                                {foodLogs
                                  .filter((foodLog) => foodLog.meal === "SNACK")
                                  .map((foodLog, idx) => (
                                    <View key={idx} style={styles.flexRowCenter}>
                                      <View>
                                        <Text>{JSON.stringify(foodLog)}</Text>
                                      </View>
                                      <View>
                                      </View>
                                    </View>
                                  ))
                                }
                                <Text onPress={redirectToLogFoodTab} style={styles.logFood}>Log Food</Text>
                              </View>
                            </View>
                          </View>
                      </View>
                    </View>
                  }
              </Card.Content>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

// Style sheet for the dashboard screen.
const styles = StyleSheet.create({
  // General styling for all tabs.
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    backgroundColor: '#FCFDF7'
  },
  titleText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 26
  },
  heading1Text: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20
  },
  heading2Text: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16
  },
  heading3Text: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14
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
  flexRowBaseline: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline"
  },
  flexRowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  flexRowSpaceEvenly: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  // Specific styling for the tab.
  circularProgress: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 10,
    margin: "auto",
  },
  foodLogContainer: {
    paddingTop: 10
  },
  mealContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'lightgrey',
    padding: 10,
    borderStyle: 'solid',
    borderRadius: 10,
    borderWidth: 0
  },
  customHeading2Text: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
    borderStyle: 'solid',
    borderBottomWidth: 1
  },
  logFood: {
    color: 'dodgerblue',
    textAlign: 'center'
  },
  editButton: {
    position: 'absolute',
    right: 0,
    top: 0
  }
});