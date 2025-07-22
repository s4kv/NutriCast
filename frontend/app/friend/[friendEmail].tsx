import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useAuth } from "../../services/auth-context";
import backend from "../../services/backend";
import { Circle } from "react-native-svg";
import * as Emoji from "node-emoji";
import { useLocalSearchParams } from "expo-router";
import * as Localization from 'expo-localization';

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

export default function FriendProfile() {
  const { friendEmail } = useLocalSearchParams<{ friendEmail: string }>();
  const { user, logout } = useAuth(); // Get the authenticated user from the auth context
  const [calorieGoal, setCalorieGoal] = useState(0); // User's goal for daily calorie intake
  const [proteinGoal, setProteinGoal] = useState(0); // User's goal for daily protein intake
  const [carbGoal, setCarbGoal] = useState(0); // User's goal for daily carb intake
  const [fatGoal, setFatGoal] = useState(0); // User's goal for daily fat carb intake
  const [caloriesConsumed, setCaloriesConsumed] = useState(0); // User's calories consumed today
  const [caloriesBurned, setCaloriesBurned] = useState(0); // User's calories burned from exercise today
  const [proteinConsumed, setProteinConsumed] = useState(0);
  const [carbConsumed, setCarbConsumed] = useState(0);
  const [fatConsumed, setFatConsumed] = useState(0);
  const [foodLogs, setFoodLogs] = useState<FoodLogDetailsDto[]>([]); // User's foodLogs today
  const [foodLogMealTypes] = useState<string[]>(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]); // Types of food log meal types
  const [isDashboardLoading, setIsDashboardLoading] = useState<Boolean>(false);
  const caloriesRemaining = calorieGoal - caloriesConsumed + caloriesBurned; // User's remaining calories for the day
  const netCalories = caloriesConsumed - caloriesBurned; // User's net calorie intake
  const percentOfCalorieGoal =
    calorieGoal > 0
      ? Math.min(Math.max((netCalories / calorieGoal) * 100, 0), 100)
      : 0; // User's percentage of completion to the calorie goal
  const proteinRemaining = proteinGoal - proteinConsumed;
  const percentOfProteinGoal =
    proteinGoal > 0
    ?
    Math.min(Math.max((proteinConsumed / proteinGoal) * 100, 0), 100)
    :
    0;
  const carbRemaining = carbGoal - carbConsumed;
  const percentOfCarbGoal =
    carbGoal > 0
    ?
    Math.min(Math.max((carbConsumed / carbGoal) * 100, 0), 100)
    :
    0;
  const fatRemaining = fatGoal - fatConsumed;
  const percentOfFatGoal =
    fatGoal > 0
    ?
    Math.min(Math.max((fatConsumed / fatGoal) * 100, 0), 100)
    :
    0;
  const [hoveredEditGoalButton, setHoveredEditGoalButton] = useState<string | null>(null);
  const [hoveredMealButton, setHoveredMealButton] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (user) {
      setIsDashboardLoading(true);
      const userTimeZone = Localization.getCalendars()[0].timeZone;

      // Get the user's nutritions logged today
      backend
        .get(
          `/api/users/${friendEmail}/nutrition/today`, 
          {
            headers: {
              'X-User-Time-Zone': userTimeZone
            }
          }
        )
        .then((response) => {
          const nutritionData = response.data;
          setCaloriesConsumed(nutritionData.calorie || 0);
          setProteinConsumed(nutritionData.protein || 0);
          setCarbConsumed(nutritionData.carbs || 0);
          setFatConsumed(nutritionData.fat || 0);
        })
        .catch((error) => {
          console.error(error);
        })
      
      // Get the user's nutrition goal
      backend
        .get(`/api/users/${friendEmail}/nutrition/goal`)
        .then((response) => {
          const nutritionGoalData = response.data;
          setCalorieGoal(nutritionGoalData.calorie || 0);
          setProteinGoal(nutritionGoalData.protein || 0);
          setCarbGoal(nutritionGoalData.carbs || 0);
          setFatGoal(nutritionGoalData.fat || 0);
        })
        .catch((error) => {
          console.error(error);
        });
      
      // Gets the user's foodLogs today
      backend
        .get(
          `/api/users/${friendEmail}/foods/logs/today/details`, 
          {
            headers: {
              'X-User-Time-Zone': userTimeZone
            }
          }
        )
        .then((response) => {
          setFoodLogs(response.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsDashboardLoading(false);
        })
    }
  }, [user]);

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: "#FCFDF7"
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
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  paddingBottom: 10
                }}
              >
                <View
                  style={{
                    width: "45%",
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
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Regular",
                          fontSize: 16,
                          width: '100%'
                        }}
                      >
                        Daily Calorie Progress (kcal)
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      paddingTop: 5,
                      paddingBottom: 5,
                    }}
                  >
                    <AnimatedCircularProgress
                      size={150}
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
                {/* Protein */}
                <View
                  style={{
                    width: "45%",
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
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Regular",
                          fontSize: 16,
                          width: '100%'
                        }}
                      >
                        Daily Protein Progress (g)
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      paddingTop: 5,
                      paddingBottom: 5,
                    }}
                  >
                    <AnimatedCircularProgress
                      size={150}
                      width={10}
                      fill={percentOfProteinGoal}
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
                            {proteinRemaining}
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
                        {proteinGoal}
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
                        {proteinConsumed}
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
                  </View>
                </View>
              </View>
              {/* Carbs */}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  paddingBottom: 10
                }}
              >
                <View
                  style={{
                    width: "45%",
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
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Regular",
                          fontSize: 16,
                          width: '100%'
                        }}
                      >
                        Daily Carbs Progress (g)
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      paddingTop: 5,
                      paddingBottom: 5,
                    }}
                  >
                    <AnimatedCircularProgress
                      size={150}
                      width={10}
                      fill={percentOfCarbGoal}
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
                            {carbRemaining}
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
                        {carbGoal}
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
                        {carbConsumed}
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
                  </View>
                </View>
                {/* Fat */}
                <View
                  style={{
                    width: "45%",
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
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Regular",
                          fontSize: 16,
                          width: '100%'
                        }}
                      >
                        Daily Fat Progress (g)
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      paddingTop: 5,
                      paddingBottom: 5,
                    }}
                  >
                    <AnimatedCircularProgress
                      size={150}
                      width={10}
                      fill={percentOfFatGoal}
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
                            {fatRemaining}
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
                        {fatGoal}
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
                        {fatConsumed}
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
                  </View>
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
        </View>
      </ScrollView>
      {isDashboardLoading && (
        <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <ActivityIndicator 
          size='large' 
          color='#FFFFFF'
        />
        <Text
          style={{
            color: "#FFFFFF",
            marginTop: 10,
            fontFamily: "Nunito-Regular",
            fontSize: 16,
          }}
        >
          Loading...
        </Text>
      </View>
      )}
    </View>
  );
}

// Style sheet for the dashboard screen.
const styles = StyleSheet.create({
});
