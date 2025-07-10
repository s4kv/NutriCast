import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../auth-context";
import { useState } from "react";
import { Card } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import backend from "../backend";

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
    const [meal, setMeal] = useState<Meal | null>(null); // Type of Meal (e.g, BREAKFAST, LUNCH, DINNER, SNACK)
    const [noOfServings, setNoOfServings] = useState(''); // No of servings
    const [isNoOfServingsFocus, setIsNoOfServingsFocus] = useState<Boolean>(false); // Whether the text input of noOfServings is on focus or not

    // Sends all the data to the backend to save the food log on mongoDB.
    const addFoodLog = async () => {
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
            router.push('/(tabs)/dashboard');
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.titleText}>Log Food</Text>
            <div style={{padding: 10}}>
                <Card>
                    <Card.Content>
                        <div style={styles.flexRowBaseline}>
                            <Text style={styles.heading3Text}>Meal: </Text>
                            <Dropdown
                                placeholder={'e.g, Lunch'}
                                data={data}
                                labelField='label'
                                valueField='value'
                                onChange={item => {
                                    setMeal(item.value);
                                }}
                                placeholderStyle={styles.dropdownPlaceholder}
                                selectedTextStyle={styles.dropdownSelectedText}
                                itemTextStyle={styles.dropdownItemText}
                                style={styles.dropdown}
                            />
                        </div>
                        <div style={styles.flexRowBaseline}>
                            <Text style={styles.heading3Text}>No Of Servings: </Text>
                            <TextInput
                                placeholder={'e.g, 1'}
                                value={noOfServings}
                                onChangeText={(text) => {
                                    setNoOfServings(text);
                                    setIsNoOfServingsFocus(text != '');
                                }}
                                onBlur={(event) => {
                                    setIsNoOfServingsFocus(event.nativeEvent.text != '');
                                }}
                                style={isNoOfServingsFocus ? styles.textInputFocus : styles.textInputBlur}
                            />
                        </div>
                        <div style={styles.saveButton}>
                            <Button title="Add Food" onPress={addFoodLog} />
                        </div>
                    </Card.Content>
                </Card>
            </div>
        </View>
    )
}

const styles = StyleSheet.create({
    // General styling for all tabs
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20
    },
    titleText: {
        fontSize: 26,
        fontWeight: 'bold'
    },
    heading1Text: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    heading2Text: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    heading3Text: {
        fontSize: 14
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    flexColumnCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    flexRowBaseline: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    flexRowCenter: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    flexSpaceEvenly: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },

    // Specific styling for this tab
    dropdownPlaceholder: {
        fontSize: 16,
        color: 'grey'
    },
    dropdown: {
        marginLeft: 'auto'
    },
    dropdownSelectedText: {
        fontSize: 16
    },
    dropdownItemText: {
        textAlign: 'right'
    },
    textInputFocus: {
        fontSize: 16,
        textAlign: "right",
        marginLeft: 'auto'
    },
    textInputBlur: {
        fontSize: 16,
        textAlign: "right",
        color: 'grey',
        marginLeft: 'auto'
    },
    saveButton: {
        margin: "auto",
        paddingTop: 10,
    },
})