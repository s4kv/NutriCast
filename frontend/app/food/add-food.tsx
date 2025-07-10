import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Card } from "react-native-paper";
import { Dropdown } from 'react-native-element-dropdown';
import { useAuth } from "../auth-context";
import backend from "../backend";
import { useRouter } from "expo-router";

// For the field 'type' in Food.java
enum FoodType {
    ITEM,
    MEAL
}

// Data for the Dropdown
const data = [
    { label: 'Item', value: FoodType.ITEM },
    { label: 'Meal', value: FoodType.MEAL }
]

export default function AddFood() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [foodName, setFoodName] = useState(''); // Name of the food
    const [foodType, setFoodType] = useState<FoodType | null>(null); // Type of the food (e.g, ITEM, MEAL)
    const [foodServingSize, setFoodServingSize] = useState(''); // Serving size of the food
    const [foodServingSizeUnit, setFoodServingSizeUnit] = useState(''); // Unit of the serving size of the food
    const [foodCalorie, setFoodCalorie] = useState(''); // Total calories of the food (cal)
    const [foodFat, setFoodFat] = useState(''); // Total fat of the food (g)
    const [foodCarb, setFoodCarb] = useState(''); // Total carbohydrates of the food (g)
    const [foodProtein, setFoodProtein] = useState(''); // Total protein of the food (g)
    const [isFoodNameFocus, setIsFoodNameFocus] = useState<Boolean>(false); // Whether the text input of name is focus or not
    const [isFoodServingSizeFocus, setIsFoodServingSizeFocus] = useState<Boolean>(false) // Whether the text input of serving size is focus or not
    const [isFoodServingSizeUnitFocus, setIsFoodServingSizeUnitFocus] = useState<Boolean>(false) // Whether the text input of serving size unit is focus or not
    const [isFoodCalorieFocus, setIsFoodCalorieFocus] = useState<Boolean>(false); // Whether the text input of calories is focus or not
    const [isFoodFatFocus, setIsFoodFatFocus] = useState<Boolean>(false); // Whether the text input of fat is focus or not
    const [isFoodCarbFocus, setIsFoodCarbFocus] = useState<Boolean>(false); // Whether the text input of carbohyrdates is focus or not
    const [isFoodProteinFocus, setIsFoodProteinFocus] = useState<Boolean>(false); // Whether the text input of protein is focus or not
    var [isFoodNameEmpty, setIsFoodNameEmpty] = useState<Boolean>(); // Makes the food name field required
    var [isFoodTypeEmpty, setIsFoodTypeEmpty] = useState<Boolean>(); // Makes the food type field required
    var [isFoodServingSizeEmpty, setIsFoodServingSizeEmpty] = useState<Boolean>(); // Makes the food serving size required
    var [isFoodServingSizeUnitEmpty, setIsFoodServingSizeUnitEmpty] = useState<Boolean>(); // Makes the food serving size unit field required
    var [isFoodCalorieEmpty, setIsFoodCalorieEmpty] = useState<Boolean>(); // Makes the food calories field required
    var [isFoodFatEmpty, setIsFoodFatEmpty] = useState<Boolean>(); // Makes the food fat field required
    var [isFoodCarbEmpty, setIsFoodCarbEmpty] = useState<Boolean>(); // Makes the food carb field required
    var [isFoodProteinEmpty, setIsFoodProteinEmpty] = useState<Boolean>(); // Makes the food protein field required

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
                    cholesterol: 0
                }
            };

            // Call the backend api endpoint
            try {
                const response = await backend.post(`/api/users/${user?.email}/foods`, foodData);
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
        isFoodNameEmpty = foodName.trim() == '';
        isFoodTypeEmpty = foodType == null;
        isFoodServingSizeEmpty = foodServingSize.trim() == '';
        isFoodServingSizeUnitEmpty = foodServingSizeUnit.trim() == '';
        isFoodCalorieEmpty = foodCalorie.trim() == '';
        isFoodFatEmpty = foodFat.trim() == '';
        isFoodCarbEmpty = foodCarb.trim() == '';
        isFoodProteinEmpty = foodProtein.trim() == '';
        setIsFoodNameEmpty(isFoodNameEmpty);
        setIsFoodTypeEmpty(isFoodTypeEmpty);
        setIsFoodServingSizeEmpty(isFoodServingSizeEmpty);
        setIsFoodServingSizeUnitEmpty(isFoodServingSizeUnitEmpty);
        setIsFoodCalorieEmpty(isFoodCalorieEmpty);
        setIsFoodFatEmpty(isFoodFatEmpty);
        setIsFoodCarbEmpty(isFoodCarbEmpty);
        setIsFoodProteinEmpty(isFoodProteinEmpty);
        return !isFoodNameEmpty
               && !isFoodTypeEmpty
               && !isFoodServingSizeEmpty
               && !isFoodServingSizeUnitEmpty
               && !isFoodCalorieEmpty
               && !isFoodFatEmpty
               && !isFoodCarbEmpty
               && !isFoodProteinEmpty
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Add Food</Text>
            <div style={{padding: 10}}>
                <Card>
                    <Card.Content>
                        <div style={styles.flexRowBaseline}>
                            <Text style={styles.heading3Text}>Name: </Text>
                            <TextInput
                                placeholder={'e.g, Chicken Breast'}
                                value={foodName}
                                onChangeText={(text) => {
                                    setFoodName(text);
                                    setIsFoodNameFocus(text != '');
                                }}
                                onBlur={(event) => {
                                    setIsFoodNameFocus(event.nativeEvent.text != '');
                                }}
                                style={isFoodNameFocus ? styles.textInputFocus : styles.textInputBlur}
                            />
                        </div>
                        {isFoodNameEmpty && (
                            <Text style={styles.errorText}>This field is required.</Text>
                        )}
                        <div style={styles.flexRowBaseline}>
                            <Text style={styles.heading3Text}>Type: </Text>
                            <Dropdown
                                placeholder={'e.g, Item'}
                                data={data}
                                labelField='label'
                                valueField='value'
                                onChange={item => {
                                    setFoodType(item.value);
                                }}
                                placeholderStyle={styles.dropdownPlaceholder}
                                selectedTextStyle={styles.dropdownSelectedText}
                                itemTextStyle={styles.dropdownItemText}
                                style={styles.dropdown}
                            />
                        </div>
                        {isFoodTypeEmpty && (
                            <Text style={styles.errorText}>This field is required.</Text>
                        )}
                        <div style={styles.flexRowBaseline}>
                            <Text style={styles.heading3Text}>Serving Size: </Text>
                            <TextInput
                                placeholder={'e.g, 100'}
                                value={foodServingSize}
                                onChangeText={(text) => {
                                    setFoodServingSize(text);
                                    setIsFoodServingSizeFocus(text != '');
                                }}
                                onBlur={(event) => {
                                    setIsFoodServingSizeFocus(event.nativeEvent.text != '');
                                }}
                                keyboardType='numeric'
                                style={isFoodServingSizeFocus ? styles.textInputFocus : styles.textInputBlur}
                            />
                        </div>
                        {isFoodServingSizeEmpty && (
                            <Text style={styles.errorText}>This field is required.</Text>
                        )}
                        <div style={styles.input}>
                            <Text style={styles.heading3Text}>Serving Size Unit: </Text>
                            <TextInput
                                placeholder={'e.g, grams'}
                                value={foodServingSizeUnit}
                                onChangeText={(text) => {
                                    setFoodServingSizeUnit(text);
                                    setIsFoodServingSizeUnitFocus(text != '');
                                }}
                                onBlur={(event) => {
                                    setIsFoodServingSizeUnitFocus(event.nativeEvent.text != '');
                                }}
                                style={isFoodServingSizeUnitFocus ? styles.textInputFocus : styles.textInputBlur}
                            />
                        </div>
                        {isFoodServingSizeUnitEmpty && (
                            <Text style={styles.errorText}>This field is required.</Text>
                        )}
                        <Text style={styles.customHeading2Text}>Nutritional Information</Text>
                        <div style={styles.flexRowBaseline}>
                            <Text style={styles.heading3Text}>Calories : </Text>
                            <TextInput
                                placeholder={'e.g, 165'}
                                value={foodCalorie}
                                onChangeText={(text) => {
                                    setFoodCalorie(text);
                                    setIsFoodCalorieFocus(text != ''); 
                                }}
                                onBlur={(event) => {
                                    setIsFoodCalorieFocus(event.nativeEvent.text != '');
                                }}
                                style={isFoodCalorieFocus ? styles.textInputFocus : styles.textInputBlur}
                            />
                        </div>
                        {isFoodCalorieEmpty && (
                            <Text style={styles.errorText}>This field is required.</Text>
                        )}
                        <div style={styles.flexRowBaseline}>
                            <Text style={styles.heading3Text}>Fat (g): </Text>
                            <TextInput
                                placeholder={'e.g, 3'}
                                value={foodFat}
                                onChangeText={(text) => {
                                    setFoodFat(text);
                                    setIsFoodFatFocus(text != '');
                                }}
                                onBlur={(event) => {
                                    setIsFoodFatFocus(event.nativeEvent.text != '');
                                }}
                                style={isFoodFatFocus ? styles.textInputFocus : styles.textInputBlur}
                            />
                        </div>
                        {isFoodFatEmpty && (
                            <Text style={styles.errorText}>This field is required.</Text>
                        )}
                        <div style={styles.flexRowBaseline}>
                            <Text style={styles.heading3Text}>Carbohydrates (g): </Text>
                            <TextInput
                                placeholder={'e.g, 0'}
                                value={foodCarb}
                                onChangeText={(text) => {
                                    setFoodCarb(text);
                                    setIsFoodCarbFocus(text != '');
                                }}
                                onBlur={(event) => {
                                    setIsFoodCarbFocus(event.nativeEvent.text != '');
                                }}
                                style={isFoodCarbFocus ? styles.textInputFocus : styles.textInputBlur}
                            />
                        </div>
                        {isFoodCarbEmpty && (
                            <Text style={styles.errorText}>This field is required.</Text>
                        )}
                        <div style={styles.flexRowBaseline}>
                            <Text style={styles.heading3Text}>Protein (g): </Text>
                            <TextInput
                                placeholder={'e.g, 31'}
                                value={foodProtein}
                                onChangeText={(text) => {
                                    setFoodProtein(text);
                                    setIsFoodProteinFocus(text != '');
                                }}
                                onBlur={(event) => {
                                    setIsFoodProteinFocus(event.nativeEvent.text != '');
                                }}
                                style={isFoodProteinFocus ? styles.textInputFocus : styles.textInputBlur}
                            />
                        </div>
                        {isFoodProteinEmpty && (
                            <Text style={styles.errorText}>This field is required.</Text>
                        )}
                        <div style={styles.saveButton}>
                            <Button title="Add Food" onPress={addFood} />
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

    // Specific styling for the tab
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
    input: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingBottom: 5
    },
    customHeading2Text: {
        fontSize: 16,
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center',
        borderStyle: 'solid',
        borderTopWidth: 1
    },
    saveButton: {
        margin: "auto",
        paddingTop: 10,
    },
    errorText: {
        color: "red",
    },
})