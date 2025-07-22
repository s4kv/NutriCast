import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Octicons from "react-native-vector-icons/Octicons";
import backend from "../../services/backend";
import { useAuth } from "../../services/auth-context";

interface Food {
  id: String;
  userId: String;
  name: String;
  type: FoodType;
  servingSize: number;
  servingUnit: String;
  macros: FoodMacros;
}

interface FoodMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
}

enum FoodType {
  ITEM,
  MEAL,
}

export default function LogFood() {
  const { user, logout } = useAuth();
  const router = useRouter(); // To redirect to other tabs
  const [search, setSearch] = useState(""); // What the user searches for
  const [foods, setFoods] = useState<Food[]>([]); // List of foods that the user adds
  const [isSearchFocus, setIsSearchFocus] = useState<Boolean>(false);
  const [isAddFoodButtonHovered, setIsAddFoodButtonHovered] = useState<Boolean>(false);
  const [hoveredFoodId, setHoveredFoodId] = useState<String | null>(null);

  const redirectToAddFoodTab = () => {
    router.push("/food/add-food");
  };

  const redirectToAddFoodLogTab = (foodId: String, foodName: String) => {
    router.push({
      pathname: "/food/add-food-log",
      params: { 
        foodId: String(foodId),
        foodName: String(foodName)
      },
    });
  };

  // Get the user's added foods by the name on the search bar.
  // TODO: Right now, the search bar is case-sensitive to search for the added foods by the user.
  // TODO: So, we need to implement the backend where it can get the user's added foods without
  // TODO: searching for the food with the exact name. It should be able to get "Chicken Breast"
  // TODO: if the user searches "Chicken" in the search bar.
  const searchFoods = async (text: String) => {
    try {
      console.log(`/api/users/${user?.email}/foods/${text}`);
      const response = await backend.get(
        `/api/users/${user?.email}/foods/${text}`,
      );
      console.log("Got Foods Successfully: " + response.data);
      setFoods(response.data);
    } catch (exception: any) {
      console.log("Error getting Foods from backend: " + exception);
    }
  };

  useEffect(() => {
    // Gets the all of the user's added foods by default.
    backend
      .get(`/api/users/${user?.email}/foods/all`)
      .then((response) => setFoods(response.data))
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  return (
    <View style={{
      height: '100%',
      backgroundColor: '#FCFDF7',
      padding: 10
    }}>
      <View style={{
        paddingBottom: 20
      }}>
        <Text style={{
          fontFamily: 'Nunito-Bold',
          fontSize: 26,
          textAlign: 'center'
        }}>Log Food</Text>
      </View>
      <View style={{
        padding: 10
      }}>
        <View style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderRadius: 10,
          backgroundColor: 'white'
        }}>
          <View style={ isSearchFocus ?
            {
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#84a98c'
            }
            :
            {
              borderWidth: 0
            }
          }>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              padding: 10
            }}>
              <View style={{
                width: '10%',
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 5,
                paddingRight: 10
              }}>
                <FontAwesome5 name="search" style={{
                  fontSize: 16,
                  color: '#A0AEC0'
                }}/>
              </View>
              <TextInput
                placeholder={'Search for a food'}
                placeholderTextColor={'#A0AEC0'}
                value={search}
                onChangeText={(text) => {
                  setSearch(text);
                  text == "" ? searchFoods('all') : searchFoods(text);
                }}
                onFocus={() => {
                  setIsSearchFocus(true);
                }}
                onBlur={() => {
                  setIsSearchFocus(false);
                }}
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 16,
                  width: '90%',
                  color: 'black',
                }}
              />
            </View>
          </View>     
        </View>
      </View>
      <View style={{
        padding: 10
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Text style={{
            width: '75%',
            fontFamily: 'Nunito-Bold',
            fontSize: 20,
            textAlign: 'left'
          }}>Foods</Text>
          <Pressable
            onPress={redirectToAddFoodTab}
            onHoverIn={() => {
              setIsAddFoodButtonHovered(true);
            }}
            onHoverOut={() => {
              setIsAddFoodButtonHovered(false);
            }}
            onPressIn={() => {
              setIsAddFoodButtonHovered(true);
            }}
            onPressOut={() => {
              setIsAddFoodButtonHovered(false);
            }}
            style={ isAddFoodButtonHovered ?
              {
                width: '25%',
                borderRadius: 20,
                backgroundColor: '#6a8970'
              }
              :
              {
                width: '25%',
                borderRadius: 20,
                backgroundColor: '#84a98c'
              }
            }>
            <Text style={{
              fontFamily: 'Nunito-Bold',
              fontSize: 14,
              textAlign: 'center',
              color: 'white',
              padding: 5
            }}>+ Add Food</Text>
          </Pressable>
        </View>
      </View>
      <View style={{
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
      }}>
        <ScrollView style={{
          height: '100%'
        }}>
          {foods.length == 0 ?
            (
              <View style={{
                paddingTop: 10
              }}>
                <Text style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 14,
                  textAlign: 'center'
                }}>See no foods? Add one!</Text>
              </View>
            )
            :
            (
              <View style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                {foods.map((foods, index) => (
                  <View key={index} style={{
                    paddingTop: 5,
                    paddingBottom: 5
                  }}>
                    <View style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                      borderRadius: 10,
                      backgroundColor: 'white'
                    }}>
                      <View 
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 10
                      }}> 
                        <View style={{
                          width: '80%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <Text style={{
                            fontFamily: 'Nunito-Bold',
                            fontSize: 16,
                            wordWrap: 'break-word',
                            textAlign: 'left',
                            paddingBottom: 5
                          }}>{foods.name}</Text>
                          <Text style={{
                            fontFamily: 'Nunito-Regular',
                            fontSize: 14,
                            wordWrap: 'break-word',
                            textAlign: 'left',
                            color: '#6B7280'
                          }}>{foods.type} <Octicons name='dot-fill'/> {foods.macros.calories} CALORIES <Octicons name='dot-fill'/> {foods.servingSize} {foods.servingUnit.toUpperCase()}</Text>
                        </View>
                        <View style={{
                          width: '20%'
                        }}>
                          <Pressable
                            onPress={() => {
                              redirectToAddFoodLogTab(foods.id, foods.name)
                            }}
                            onPressIn={() => {
                              setHoveredFoodId(foods.id);
                            }}
                            onPressOut={() => {
                              setHoveredFoodId(null);
                            }}
                            onHoverIn={() => {
                              setHoveredFoodId(foods.id);
                            }}
                            onHoverOut={() => {
                              setHoveredFoodId(null);
                            }}
                            style={ hoveredFoodId == foods.id ?
                              {
                                borderRadius: 10,
                                backgroundColor: '#D1EAE2'
                              }
                              :
                              {
                                borderRadius: 10,
                                backgroundColor: '#EBF8F2'
                              }
                            }
                          >
                            <Text style={{
                              fontFamily: 'Nunito-Bold',
                              fontSize: 14,
                              color: '#6a8970',
                              textAlign: 'center',
                              padding: 5
                            }}>Log Food</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>  
                  </View>
                ))}
              </View>
            )
          }
        </ScrollView>
      </View>
    </View>
  );
}

// TODO: organize all the styles above into a style sheet.
const styles = StyleSheet.create({
});