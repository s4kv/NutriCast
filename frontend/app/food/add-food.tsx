import { useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Card } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { useAuth } from "../../services/auth-context";
import backend from "../../services/backend";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import DropDownPicker from 'react-native-dropdown-picker';

// For the field 'type' in Food.java
enum FoodType {
  ITEM,
  MEAL
}

// Data for the Dropdown
const data = [
  { label: "Item", value: FoodType.ITEM },
  { label: "Meal", value: FoodType.MEAL },
];

export default function AddFood() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [foodName, setFoodName] = useState(""); // Name of the food
  const [foodType, setFoodType] = useState<FoodType | null>(null); // Type of the food (e.g, ITEM, MEAL)
  const [foodServingSize, setFoodServingSize] = useState(""); // Serving size of the food
  const [foodServingSizeUnit, setFoodServingSizeUnit] = useState(""); // Unit of the serving size of the food
  const [foodCalorie, setFoodCalorie] = useState(""); // Total calories of the food (cal)
  const [foodFat, setFoodFat] = useState(""); // Total fat of the food (g)
  const [foodCarb, setFoodCarb] = useState(""); // Total carbohydrates of the food (g)
  const [foodProtein, setFoodProtein] = useState(""); // Total protein of the food (g)
  const [isFoodNameFocus, setIsFoodNameFocus] = useState<Boolean>(false); // Whether the text input of name is focus or not
  const [isFoodTypeFocus, setIsFoodTypeFocus] = useState<Boolean>(false);
  const [isFoodServingSizeFocus, setIsFoodServingSizeFocus] =
    useState<Boolean>(false); // Whether the text input of serving size is focus or not
  const [isFoodServingSizeUnitFocus, setIsFoodServingSizeUnitFocus] =
    useState<Boolean>(false); // Whether the text input of serving size unit is focus or not
  const [isFoodCalorieFocus, setIsFoodCalorieFocus] = useState<Boolean>(false); // Whether the text input of calories is focus or not
  const [isFoodFatFocus, setIsFoodFatFocus] = useState<Boolean>(false); // Whether the text input of fat is focus or not
  const [isFoodCarbFocus, setIsFoodCarbFocus] = useState<Boolean>(false); // Whether the text input of carbohyrdates is focus or not
  const [isFoodProteinFocus, setIsFoodProteinFocus] = useState<Boolean>(false); // Whether the text input of protein is focus or not
  const [isAddFoodButtonHovered, setIsAddFoodButtonHovered] = useState<Boolean>(false);

  var [isFoodNameEmpty, setIsFoodNameEmpty] = useState<Boolean>(); // Makes the food name field required
  var [isFoodTypeEmpty, setIsFoodTypeEmpty] = useState<Boolean>(); // Makes the food type field required
  var [isFoodServingSizeEmpty, setIsFoodServingSizeEmpty] = useState<Boolean>(); // Makes the food serving size required
  var [isFoodServingSizeUnitEmpty, setIsFoodServingSizeUnitEmpty] =
    useState<Boolean>(); // Makes the food serving size unit field required
  var [isFoodCalorieEmpty, setIsFoodCalorieEmpty] = useState<Boolean>(); // Makes the food calories field required
  var [isFoodFatEmpty, setIsFoodFatEmpty] = useState<Boolean>(); // Makes the food fat field required
  var [isFoodCarbEmpty, setIsFoodCarbEmpty] = useState<Boolean>(); // Makes the food carb field required
  var [isFoodProteinEmpty, setIsFoodProteinEmpty] = useState<Boolean>(); // Makes the food protein field required

  const [data, setData] = useState([
    { label: "Item", value: FoodType.ITEM },
    { label: "Meal", value: FoodType.MEAL },
  ]);
  const [open, setOpen] = useState<boolean>(false);

  // Sends all the data to the backend to save the food on mongoDb.
  const addFood = async () => {
    if (checkForm()) {
      // Create a foodData that matches FoodRequest.java
      const foodData = {
        name: foodName,
        type: foodType,
        servingSize: parseFloat(foodServingSize),
        servingUnit: foodServingSizeUnit,
        foodMacros: {
          calories: parseInt(foodCalorie),
          protein: parseInt(foodProtein),
          carbs: parseInt(foodCarb),
          fat: parseInt(foodFat),
          fiber: 0,
          sugar: 0,
          sodium: 0,
          cholesterol: 0,
        },
      };

      // Call the backend api endpoint
      try {
        const response = await backend.post(
          `/api/users/${user?.email}/foods`,
          foodData,
        );
        console.log("Response from backend: " + response.status);
      } catch (exception: any) {
        console.error("Error sending user's new food to backend: " + exception);
      } finally {
        router.push("/(tabs)/log-food");
      }
    }
  };

  // Checks if the form is valid for POST action.
  // If any of the fields are empty, then tell the user that the field that is empty is required.
  // If all the fields are not empty, then continue with the POST action.
  const checkForm = () => {
    isFoodNameEmpty = foodName.trim() == "";
    isFoodTypeEmpty = foodType == null;
    isFoodServingSizeEmpty = foodServingSize.trim() == "";
    isFoodServingSizeUnitEmpty = foodServingSizeUnit.trim() == "";
    isFoodCalorieEmpty = foodCalorie.trim() == "";
    isFoodFatEmpty = foodFat.trim() == "";
    isFoodCarbEmpty = foodCarb.trim() == "";
    isFoodProteinEmpty = foodProtein.trim() == "";
    setIsFoodNameEmpty(isFoodNameEmpty);
    setIsFoodTypeEmpty(isFoodTypeEmpty);
    setIsFoodServingSizeEmpty(isFoodServingSizeEmpty);
    setIsFoodServingSizeUnitEmpty(isFoodServingSizeUnitEmpty);
    setIsFoodCalorieEmpty(isFoodCalorieEmpty);
    setIsFoodFatEmpty(isFoodFatEmpty);
    setIsFoodCarbEmpty(isFoodCarbEmpty);
    setIsFoodProteinEmpty(isFoodProteinEmpty);
    return (
      !isFoodNameEmpty &&
      !isFoodTypeEmpty &&
      !isFoodServingSizeEmpty &&
      !isFoodServingSizeUnitEmpty &&
      !isFoodCalorieEmpty &&
      !isFoodFatEmpty &&
      !isFoodCarbEmpty &&
      !isFoodProteinEmpty
    );
  };

  return (
    <ScrollView style={{
      height: '100%',
      backgroundColor: '#FCFDF7'
    }}>
      <View style={{
        padding: 10
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 20
        }}>
          <Text style={{
            textAlign: 'center'
          }}><FontAwesome5 name='leaf' style={{ fontSize: 26 }}/></Text>
          <Text style={{
            fontFamily: 'Nunito-Bold',
            fontSize: 26,
            textAlign: 'center'
          }}>Add a New Food</Text>
          <Text style={{
            fontFamily: 'Nunito-Regular',
            fontSize: 14,
            textAlign: 'center',
            color: '#6B7280'
          }}>Enter the details of your food item to add it to your personal library.</Text>
        </View>
        <View style={{
          width: '100%',
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          backgroundColor: 'white'
        }}>
          <View style={{
            padding: 10
          }}>
            <Text style={{
              fontFamily: 'Nunito-Bold',
              fontSize: 20,
              borderStyle: 'solid',
              borderBottomWidth: 1,
              borderColor: 'grey',
              paddingBottom: 10
            }}>Basic Information</Text>
          </View>
          <View style={{
            padding: 10
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Text style={{
                fontFamily: 'Nunito-Bold',
                fontSize: 16,
                textAlign: 'left',
                paddingBottom: 5
              }}>Food Name</Text>
              <TextInput
                placeholder={"e.g., Chicken Breast"}
                placeholderTextColor={'#A0AEC0'}
                value={foodName}
                onChangeText={(text) => {
                  setFoodName(text);
                }}
                onBlur={() => {
                  setIsFoodNameFocus(false);
                }}
                onFocus={() => {
                  setIsFoodNameFocus(true);
                }}
                style={ isFoodNameFocus ?
                  {
                    width: '100%',
                    fontFamily: 'Nunito-Regular',
                    fontSize: 14,
                    textAlign: 'left',
                    borderStyle: 'solid',
                    borderWidth: 2,
                    borderRadius: 5,
                    borderColor: '#84a98c',
                    padding: 10,
                    backgroundColor: '#FCFDF7'
                  }
                  :
                  {
                    width: '100%',
                    fontFamily: 'Nunito-Regular',
                    fontSize: 14,
                    textAlign: 'left',
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: 'grey',
                    padding: 10,
                    backgroundColor: '#FCFDF7'
                  }
                }
              />
              {isFoodNameEmpty && (
                <Text style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 14,
                  color: 'red',
                  textAlign: 'left',
                  paddingTop: 5
                }}>This field is required.</Text>
              )}
            </View>
          </View>
          <View style={{
            padding: 10
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <View style={{
                width: '45%'
              }}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Text style={{
                    fontFamily: 'Nunito-Bold',
                    fontSize: 16,
                    textAlign: 'left',
                    paddingBottom: 5
                  }}>Serving Size</Text>
                  <TextInput
                    placeholder={"e.g., 100"}
                    placeholderTextColor={'#A0AEC0'}
                    value={foodServingSize}
                    onChangeText={(text) => {
                      setFoodServingSize(text);
                    }}
                    onBlur={() => {
                      setIsFoodServingSizeFocus(false);
                    }}
                    onFocus={() => {
                      setIsFoodServingSizeFocus(true);
                    }}
                    keyboardType="numeric"
                    style={
                      isFoodServingSizeFocus ? 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 5,
                        borderColor: '#84a98c',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                      : 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: 'grey',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                    }
                  />
                  {isFoodServingSizeEmpty && (
                    <Text style={{
                      fontFamily: 'Nunito-Regular',
                      fontSize: 14,
                      textAlign: 'left',
                      color: 'red',
                      paddingTop: 5
                    }}>This field is required.</Text>
                  )}
                </View>
              </View>
              <View style={{
                width: '45%'
              }}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <Text style={{
                    fontFamily: 'Nunito-Bold',
                    fontSize: 16,
                    textAlign: 'left',
                    paddingBottom: 5
                  }}>Serving Unit</Text>
                  <TextInput
                    placeholder={"e.g., Grams"}
                    placeholderTextColor={'#A0AEC0'}
                    value={foodServingSizeUnit}
                    onChangeText={(text) => {
                      setFoodServingSizeUnit(text);
                    }}
                    onBlur={() => {
                      setIsFoodServingSizeUnitFocus(false);
                    }}
                    onFocus={() => {
                      setIsFoodServingSizeUnitFocus(true);
                    }}
                    style={
                      isFoodServingSizeUnitFocus ? 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 5,
                        borderColor: '#84a98c',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                      : 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: 'grey',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                    }
                  />
                  {isFoodServingSizeUnitEmpty && (
                    <Text style={{
                      fontFamily: 'Nunito-Regular',
                      fontSize: 14,
                      color: 'red',
                      textAlign: 'left',
                      paddingTop: 5
                    }}>This field is required.</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View style={{
            padding: 10,
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Text style={{
                fontFamily: 'Nunito-Bold',
                fontSize: 16,
                textAlign: 'left',
                paddingBottom: 5
              }}>Type</Text>
              <DropDownPicker
                open={open}
                items={data}
                value={foodType}
                setValue={setFoodType}
                setOpen={setOpen}
                setItems={setData}
                onPress={() => {
                  setIsFoodTypeFocus(true);
                }}
                onClose={() => {
                  setIsFoodTypeFocus(false);
                }}
                placeholder='e.g., Item'
                placeholderStyle={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 14,
                  color: '#A0AEC0'
                }}
                listMode='SCROLLVIEW'
                style={ isFoodTypeFocus ?
                  {
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    minHeight: 0,
                    height: 41,
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: '#84a98c',
                    backgroundColor: '#FCFDF7'
                  }
                  :
                  {
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    minHeight: 0,
                    height: 41,
                    borderRadius: 5,
                    borderColor: 'grey',
                    backgroundColor: '#FCFDF7'
                  }
                }
                listItemLabelStyle={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 14
                }}
              />
              {isFoodTypeEmpty && (
                <Text style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 14,
                  color: 'red',
                  textAlign: 'left',
                  paddingTop: 5
                }}>This field is required.</Text>
              )}
            </View>
          </View>
          <View style={{
            padding: 10
          }}>
            <View style={{
              borderBottomWidth: 1,
              paddingBottom: 10
            }}>
              <Text style={{
                fontFamily: 'Nunito-Bold',
                fontSize: 20,
                textAlign: 'left'
              }}>Nutritional Information</Text>
            </View>
          </View>
          <View style={{
            padding: 10
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <View style={{
                width: '45%'
              }}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Text style={{
                    fontFamily: 'Nunito-Bold',
                    fontSize: 16,
                    textAlign: 'left',
                    paddingBottom: 5
                  }}>Calories (kcal)</Text>
                  <TextInput
                    placeholder={"e.g., 165"}
                    placeholderTextColor={'#A0AEC0'}
                    value={foodCalorie}
                    onChangeText={(text) => {
                      setFoodCalorie(text);
                    }}
                    onBlur={() => {
                      setIsFoodCalorieFocus(false);
                    }}
                    onFocus={() => {
                      setIsFoodCalorieFocus(true);
                    }}
                    keyboardType="numeric"
                    style={ isFoodCalorieFocus ? 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 5,
                        borderColor: '#84a98c',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                      :
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: 'grey',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                    }
                  />
                  {isFoodCalorieEmpty && (
                    <Text style={{
                      fontFamily: 'Nunito-Regular',
                      fontSize: 14,
                      textAlign: 'left',
                      color: 'red',
                      paddingTop: 5
                    }}>This field is required.</Text>
                  )}
                </View>
              </View>
              <View style={{
                width: '45%'
              }}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Text style={{
                    fontFamily: 'Nunito-Bold',
                    fontSize: 16,
                    textAlign: 'left',
                    paddingBottom: 5
                  }}>Protein (g)</Text>
                  <TextInput
                    placeholder={"e.g., 31"}
                    placeholderTextColor={'#A0AEC0'}
                    value={foodProtein}
                    onChangeText={(text) => {
                      setFoodProtein(text);
                    }}
                    onBlur={() => {
                      setIsFoodProteinFocus(false);
                    }}
                    onFocus={() => {
                      setIsFoodProteinFocus(true);
                    }}
                    keyboardType="numeric"
                    style={ isFoodProteinFocus ? 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 5,
                        borderColor: '#84a98c',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                      : 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: 'grey',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                    }
                  />
                  {isFoodProteinEmpty && (
                    <Text style={{
                      fontFamily: 'Nunito-Regular',
                      fontSize: 14,
                      textAlign: 'left',
                      color: 'red',
                      paddingTop: 5
                    }}>This field is required.</Text>
                  )}
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
              justifyContent: 'space-between'
            }}>
              <View style={{
                width: '45%'
              }}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Text style={{
                    fontFamily: 'Nunito-Bold',
                    fontSize: 16,
                    textAlign: 'left',
                    paddingBottom: 5
                  }}>Carbohydrates (g)</Text>
                  <TextInput
                    placeholder={"e.g., 0"}
                    placeholderTextColor={'#A0AEC0'}
                    value={foodCarb}
                    onChangeText={(text) => {
                      setFoodCarb(text);
                    }}
                    onBlur={(event) => {
                      setIsFoodCarbFocus(false);
                    }}
                    onFocus={() => {
                      setIsFoodCarbFocus(true);
                    }}
                    keyboardType="numeric"
                    style={ isFoodCarbFocus ? 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 5,
                        borderColor: '#84a98c',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                      : 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: 'grey',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                    }
                  />
                  {isFoodCarbEmpty && (
                    <Text style={{
                      fontFamily: 'Nunito-Regular',
                      fontSize: 14,
                      color: 'red',
                      textAlign: 'left',
                      paddingTop: 5
                    }}>This field is required.</Text>
                  )}
                </View>
              </View>
              <View style={{
                width: '45%'
              }}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Text style={{
                    fontFamily: 'Nunito-Bold',
                    fontSize: 16,
                    textAlign: 'left',
                    paddingBottom: 5
                  }}>Fat (g)</Text>
                  <TextInput
                    placeholder={"e.g., 3"}
                    placeholderTextColor={'#A0AEC0'}
                    value={foodFat}
                    onChangeText={(text) => {
                      setFoodFat(text);
                    }}
                    onBlur={() => {
                      setIsFoodFatFocus(false);
                    }}
                    onFocus={() => {
                      setIsFoodFatFocus(true);
                    }}
                    keyboardType="numeric"
                    style={ isFoodFatFocus ? 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 5,
                        borderColor: '#84a98c',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      } 
                      : 
                      {
                        width: '100%',
                        fontFamily: 'Nunito-Regular',
                        fontSize: 14,
                        textAlign: 'left',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: 'grey',
                        padding: 10,
                        backgroundColor: '#FCFDF7'
                      }
                    }
                  />
                  {isFoodFatEmpty && (
                    <Text style={{
                      fontFamily: 'Nunito-Regular',
                      fontSize: 14,
                      color: 'red',
                      textAlign: 'left',
                      paddingTop: 5
                    }}>This field is required.</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View style={{
            padding: 10
          }}>
            <Pressable
              onPress={addFood}
              onPressIn={() => {
                setIsAddFoodButtonHovered(true);
              }}
              onPressOut={() => {
                setIsAddFoodButtonHovered(false);
              }}
              onHoverIn={() => {
                setIsAddFoodButtonHovered(true);
              }}
              onHoverOut={() => {
                setIsAddFoodButtonHovered(false);
              }}
              style={ isAddFoodButtonHovered ?
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
                fontSize: 20,
                textAlign: 'center',
                color: 'white'
              }}>Add Food</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// TODO: Organize the styles above into the stylesheet.
const styles = StyleSheet.create({
});