import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Button, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../services/auth-context";
import { useState } from "react";
import { Card } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import DropDownPicker from 'react-native-dropdown-picker';
import backend from "../../services/backend";

// Attribute of FoodLog.java
enum Meal {
    BREAKFAST, LUNCH, DINNER, SNACK
}

const data = [
    { label: 'Breakfast', value: Meal.BREAKFAST },
    { label: 'Lunch', value: Meal.LUNCH },
    { label: 'Dinner', value: Meal.DINNER },
    { label: 'Snack', value: Meal.SNACK }
]

export default function AddFoodLog() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { foodId } = useLocalSearchParams<{ foodId: string }>();
    const { foodName } = useLocalSearchParams<{ foodName: string }>();
    const [meal, setMeal] = useState<Meal | null>(null); // Type of Meal (e.g, BREAKFAST, LUNCH, DINNER, SNACK)
    const [noOfServings, setNoOfServings] = useState(''); // No of servings
    const [isMealFocus, setIsMealFocus] = useState<Boolean>(false);
    const [isNoOfServingsFocus, setIsNoOfServingsFocus] = useState<Boolean>(false); // Whether the text input of noOfServings is on focus or not
    const [isMealEmpty, setIsMealEmpty] = useState<Boolean>(false);
    const [isNoOfServingsEmpty, setIsNoOfServingsEmpty] = useState<Boolean>(false);
    const [isLogFoodButtonHovered, setIsLogFoodButtonHovered] = useState<Boolean>(false);
    const [data, setData] = useState([
        { label: 'Breakfast', value: Meal.BREAKFAST },
        { label: 'Lunch', value: Meal.LUNCH },
        { label: 'Dinner', value: Meal.DINNER },
        { label: 'Snack', value: Meal.SNACK }
    ]);
    const [open, setOpen] = useState<boolean>(false);
    const [isPostLoading, setIsPostLoading] = useState<boolean>(false);

    // Sends all the data to the backend to save the food log on mongoDB.
    const addFoodLog = async () => {
        setIsPostLoading(true);
        if (
            meal === null
            && noOfServings === ''
        ) {
            setIsMealEmpty(true);
            setIsNoOfServingsEmpty(true);
            setIsPostLoading(false);
        } else {
            // Create foodLogData that matches FoodLogRequest.java
            const foodLogData = {
                foodId: foodId,
                meal: meal,
                noOfServings: parseFloat(noOfServings)
            }

            // Call the backend api endpoint.
            try {
                const response = await backend.post(`/api/users/${user?.email}/foods/logs/${foodId}`, foodLogData);
                console.log("Response from backend: " + response.status);
            } catch (exception: any) {
                console.log("Error sending user's new food log to backend: " + exception);
            } finally {
                setIsPostLoading(false);
                router.push('/(tabs)/dashboard');
            }
        }
    };

    return(
        <View
            style={{
                flex: 1
            }}
        >
            <ScrollView
                style={{
                    height: '100%',
                    backgroundColor: '#FCFDF7',
                    padding: 10
                }}
            >
                <View
                    style={{
                        paddingBottom: 20
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Nunito-Bold',
                            fontSize: 26,
                            textAlign: 'center'
                        }}
                    >
                        Log Food
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Nunito-Regular',
                            fontSize: 14,
                            textAlign: 'center',
                            color: '#6B7280'
                        }}
                    >
                        Add a food item to your daily log.
                    </Text>
                </View>
                <View
                    style={{
                        padding: 10
                    }}
                >
                    <View
                        style={{
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
                        }}
                    >
                        <View
                            style={{
                                padding: 10
                            }}
                        >
                            <View
                                style={{
                                    borderBottomWidth: 1,
                                    paddingBottom: 10,
                                    borderColor: 'grey'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Nunito-Regular',
                                        fontSize: 16,
                                        textAlign: 'center',
                                        color: '#6B7280',
                                        paddingBottom: 10
                                    }}
                                >
                                    You are logging:
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'Nunito-Bold',
                                        fontSize: 20,
                                        textAlign: 'center'
                                    }}
                                >
                                    {foodName}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                padding: 10
                            }}
                        >
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Nunito-Bold',
                                        fontSize: 16,
                                        textAlign: 'left',
                                        paddingBottom: 5
                                    }}
                                >
                                    Meal
                                </Text>
                                <DropDownPicker
                                    open={open}
                                    items={data}
                                    value={meal}
                                    setValue={setMeal}
                                    setOpen={setOpen}
                                    setItems={setData}
                                    zIndex={3000}
                                    onPress={() => {
                                        setIsMealFocus(true);
                                    }}
                                    onClose={() => {
                                        setIsMealFocus(false);
                                    }}
                                    placeholder='e.g., Lunch'
                                    placeholderStyle={{
                                        fontFamily: 'Nunito-Regular',
                                        fontSize: 14,
                                        color: '#A0AEC0'
                                    }}
                                    listMode={
                                        Platform.OS === 'web' 
                                        ? 
                                        'MODAL'
                                        :
                                        'SCROLLVIEW'
                                    }
                                    listItemLabelStyle={{
                                        fontFamily: 'Nunito-Regular',
                                        fontSize: 14
                                    }}
                                    dropDownContainerStyle={{
                                        backgroundColor: '#FCFDF7'
                                    }}
                                    style={ isMealFocus ?
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
                                />
                                {isMealEmpty && (
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
                        <View
                            style={{
                                padding: 10
                            }}
                        >
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Nunito-Bold',
                                        fontSize: 16,
                                        textAlign: 'left',
                                        paddingBottom: 5
                                    }}
                                >
                                    Number of Servings
                                </Text>
                                <TextInput
                                    placeholder={'e.g, 1'}
                                    placeholderTextColor={'#A0AEC0'}
                                    value={noOfServings}
                                    keyboardType='numeric'
                                    onChangeText={(text) => {
                                        setNoOfServings(text);
                                    }}
                                    onBlur={() => {
                                        setIsNoOfServingsFocus(false);
                                    }}
                                    onFocus={() => {
                                        setIsNoOfServingsFocus(true);
                                    }}
                                    style={
                                        isNoOfServingsFocus 
                                        ? 
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
                                            backgroundColor: '#FCFDF7',
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
                                            backgroundColor: '#FCFDF7',
                                        }
                                    }
                                />
                                {isNoOfServingsEmpty && (
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
                        <View
                            style={{
                                padding: 10
                            }}
                        >
                            <Pressable
                                onPress={addFoodLog}
                                onPressIn={() => {
                                    setIsLogFoodButtonHovered(true);
                                }}
                                onPressOut={() => {
                                    setIsLogFoodButtonHovered(false);
                                }}
                                onHoverIn={() => {
                                    setIsLogFoodButtonHovered(true);
                                }}
                                onHoverOut={() => {
                                    setIsLogFoodButtonHovered(false);
                                }}
                                style={ 
                                    isLogFoodButtonHovered
                                    ?
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
                                <Text
                                    style={{
                                        fontFamily: 'Nunito-Bold',
                                        fontSize: 20,
                                        textAlign: 'center',
                                        color: 'white'
                                    }}
                                >
                                    Log Food
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
            {(isPostLoading) && (
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
    )
}

// TODO: Organize all the css above into the style sheet.
const styles = StyleSheet.create({
})