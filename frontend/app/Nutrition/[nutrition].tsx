import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth-context";
import backend from "../../services/backend";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Emoji from "node-emoji";

/**
 * This tab is responsible for the edit calories goal
 */
export default function editCalorieGoalCard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { nutrition } = useLocalSearchParams<{ nutrition: string }>();
  const [currentNutritionGoal, setCurrentNutritionGoal] = useState(""); 
  const [newNutritionGoal, setNewNutritionGoal] = useState(""); 
  const [newNutritionGoalInputError, setNewCalorieGoalInputError] = useState<boolean>(); 
  const [isEditNutritionGoalButtonHovered, setIsEditCalorieGoalButtonHovered] = useState<boolean>(false); 
  const [isNewNutritionGoalInputFocus, setIsNewCalorieGoalInputFocus] = useState<boolean>(false);
  const [isGetLoading, setIsLoading] = useState<Boolean>(false);
  const [isPostLoading, setIsPostLoading] = useState<Boolean>(false);

  // Sends the newCalorieGoal to the backend and updates it to the database
  const editNutritionGoal = async () => {
    setIsPostLoading(true);
    if (newNutritionGoal.trim() === "") {
      setNewCalorieGoalInputError(true);
      setIsPostLoading(false);
    } else {
      try {
        // Send the data to the backend to update the new nutrition goal in the database
        const response = await backend.post(
          `/api/users/${user?.email}/nutrition/${nutrition}/goal`,
          newNutritionGoal,
        );
        console.log("Response from backend: " + response.status);
      } catch (exception: any) {
        console.error(
          "Error sending user's new nutrition goal to backend: " + exception,
        );
      } finally {
        setIsPostLoading(false);
        router.push("/(tabs)/dashboard");
      }
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);

      // Get the user's current nutrition goal
      backend
        .get(`/api/users/${user?.email}/nutrition/goal`)
        .then((response) => {
          const nutritionGoalData = response.data;
          switch (nutrition) {
            case "calorie":
              setCurrentNutritionGoal(String(nutritionGoalData.calorie || 0));
              break;
            case "protein":
              setCurrentNutritionGoal(String(nutritionGoalData.protein || 0));
              break;
            case "carbs":
              setCurrentNutritionGoal(String(nutritionGoalData.carbs || 0));
              break;
            case "fat":
              setCurrentNutritionGoal(String(nutritionGoalData.fat || 0));
              break;
            default:
              console.log("Invalid nutrition provided: " + nutrition);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  return (
    <View
      style={{
        flex: 1
      }}>
      <ScrollView style={{
        height: '100%',
        backgroundColor: '#FCFDF7'
      }}>
        <View style={{
          padding: 10,
        }}>
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: 20
          }}>
            <Text style={{
              fontSize: 26,
              textAlign: 'center'
            }}>{Emoji.emojify(':dart:')}</Text>
            <Text style={{
              fontFamily: 'Nunito-Bold',
              fontSize: 26,
              textAlign: 'center'
            }}>Edit Your {nutrition.charAt(0).toUpperCase() + nutrition.substring(1)} Goal</Text>
            <Text style={{
              fontFamily: 'Nunito-Regular',
              fontSize: 14,
              textAlign: 'center',
              color: '#6B7280'
            }}>Update your daily {nutrition} target to stay on track.</Text>
          </View>
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
                fontFamily: 'Nunito-Bold',
                fontSize: 16
              }}>Daily {nutrition.charAt(0).toUpperCase() + nutrition.substring(1)} Goal</Text>
              <Text style={{
                fontFamily: 'Nunito-Regular',
                fontSize: 14,
                textAlign: 'left',
                color: '#6B7280'
              }}>Set a new target for your daily {nutrition} intake.</Text>
            </View>
            <View style={{
              paddingTop: 5,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10
            }}>
              <TextInput
                placeholder={currentNutritionGoal}
                placeholderTextColor={'#A0AEC0'}
                value={newNutritionGoal}
                onFocus={() => {
                  setIsNewCalorieGoalInputFocus(true);
                }}
                onBlur={() => {
                  setIsNewCalorieGoalInputFocus(false);
                }}
                onChangeText={(text) => {
                  setNewNutritionGoal(text);
                  setNewCalorieGoalInputError(false);
                }}
                keyboardType='numeric'
                style={ isNewNutritionGoalInputFocus ?
                  {
                    fontFamily: 'Nunito-Bold',
                    fontSize: 20,
                    textAlign: 'center',
                    borderRadius: 5,
                    backgroundColor: '#F7F7F7',
                    paddingTop: 20,
                    paddingBottom: 20,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: '#84a98c'
                  }
                  :
                  {
                    fontFamily: 'Nunito-Bold',
                    fontSize: 20,
                    textAlign: 'center',
                    borderRadius: 5,
                    backgroundColor: '#F7F7F7',
                    paddingTop: 20,
                    paddingBottom: 20,
                    outlineWidth: 0
                  }
                }
              />
              {newNutritionGoalInputError && (
                  <Text style={{
                    fontFamily: 'Nunito-Regular',
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'red'
                  }}>This field is required.</Text>
              )}
            </View>
            <View style={{
              padding: 10
            }}>
              <Pressable
                onPress={editNutritionGoal}
                onPressIn={() => {
                  setIsEditCalorieGoalButtonHovered(true);
                }}
                onPressOut={() => {
                  setIsEditCalorieGoalButtonHovered(false);
                }}
                onHoverIn={() => {
                  setIsEditCalorieGoalButtonHovered(true);
                }}
                onHoverOut={() => {
                  setIsEditCalorieGoalButtonHovered(false);
                }}
                style={ isEditNutritionGoalButtonHovered ?
                  {
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    padding: 5,
                    backgroundColor: '#6a8970'
                  }
                  :
                  {
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    padding: 5,
                    backgroundColor: '#84a98c'
                  }
                }
              >
                <Text style={{
                  fontFamily: 'Nunito-Bold',
                  fontSize: 16,
                  color: 'white',
                  textAlign: 'center'
                }}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      {(isGetLoading || isPostLoading) && (
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

// TODO: clean up the css above into the styles sheet.
const styles = StyleSheet.create({
});

