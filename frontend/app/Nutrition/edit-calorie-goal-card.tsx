import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth-context";
import backend from "../../services/backend";
import { useRouter } from "expo-router";
import * as Emoji from "node-emoji";

/**
 * This tab is responsible for the edit calories goal
 */
export default function editCalorieGoalCard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [currentCalorieGoal, setCurrentCalorieGoal] = useState(""); // The user's current calorie goal
  const [newCalorieGoal, setNewCalorieGoal] = useState(""); // The new calorie goal
  const [newCalorieGoalInputError, setNewCalorieGoalInputError] = useState<boolean>(); // Makes the newCalorieGoal field required
  const [isEditCalorieGoalButtonHovered, setIsEditCalorieGoalButtonHovered] = useState<boolean>(false); // Whether the Edit Calorie Goal button hovered or not
  const [isNewCalorieGoalInputFocus, setIsNewCalorieGoalInputFocus] = useState<boolean>(false);

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
          }}>Edit Your Calorie Goal</Text>
          <Text style={{
            fontFamily: 'Nunito-Regular',
            fontSize: 14,
            textAlign: 'center',
            color: '#6B7280'
          }}>Update your daily calorie target to stay on track.</Text>
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
            }}>Daily Calorie Goal</Text>
            <Text style={{
              fontFamily: 'Nunito-Regular',
              fontSize: 14,
              textAlign: 'left',
              color: '#6B7280'
            }}>Set a new target for your daily calorie intake.</Text>
          </View>
          <View style={{
            paddingTop: 5,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10
          }}>
            <TextInput
              placeholder={currentCalorieGoal}
              placeholderTextColor={'black'}
              value={newCalorieGoal}
              onFocus={() => {
                setIsNewCalorieGoalInputFocus(true);
              }}
              onBlur={() => {
                setIsNewCalorieGoalInputFocus(false);
              }}
              onChangeText={(text) => {
                setNewCalorieGoal(text);
                setNewCalorieGoalInputError(false);
              }}
              keyboardType='numeric'
              style={ isNewCalorieGoalInputFocus ?
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
            {newCalorieGoalInputError && (
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
              onPress={editCalorieGoal}
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
              style={ isEditCalorieGoalButtonHovered ?
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
  );
}

// TODO: clean up the css above into the styles sheet.
const styles = StyleSheet.create({
});

