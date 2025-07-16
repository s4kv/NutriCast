import { useState } from "react";
import {
  View,
  Image,
  Button,
  Text,
  Platform,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import backend from "../../services/backend";
import { storage } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../services/auth-context";
import { useRouter } from "expo-router";

interface NutriMealResponse {
  mealName: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  proteinInGrams: number;
  carbsInGrams: number;
  fatInGrams: number;
  fiberInGrams: number;
  sugarInGrams: number;
  sodiumInMg: number;
  cholesterolInMg: number;
  mealAnalysis: string;
  servingSuggestions: string[];
}

// this is imported from add-food.tsx
// haha we should probably export the interfaces from a type file or something, but for now...
// okey, main idea: use java controller with this interface to send data to the backend? maybe...
// still need to figure out how rex handles this data xd
interface foodData {
  name: String;
  type: FoodType;
  servingSize: number;
  servingUnit: String;
  foodMacros: FoodMacros;
}
// end of imported interfaces...

// This are imported from log-food.tsx
// this are the food macros defined for the backend...
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

// since nutricast is only for meals, we can use this enum
enum FoodType {
  ITEM,
  MEAL,
}
// end of imported interfaces...

// def of macro levels
const macroLevels = ["Any", "Low", "Medium", "High"];

export default function NutriMeal() {
  const [image, setImage] = useState<string | null>(null);
  const [publicImageUri, setPublicImageUri] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<NutriMealResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [additionalIngredients, setAdditionalIngredients] =
    useState<string>("");
  const [mealPreferences, setMealPreferences] = useState<string>("");
  const [mealGoal, setMealGoal] = useState<string>("Weight Loss");
  const [macroDetails, setMacroDetails] = useState({
    protein: "High",
    carbs: "Low",
    fat: "Any",
    fiber: "Any",
    sugar: "Any",
    sodium: "Any",
  });
  const [numberOfServings, setNumberOfServings] = useState<number>(1);
  const [numberOfServingsInput, setNumberOfServingsInput] = useState(
    numberOfServings.toString(),
  );

  // permissions
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  // user
  const { user } = useAuth();

  // router
  const router = useRouter();

  // new log foods option added here!
  const logFood = async (serviceSize: number) => {
    // Check if user is authenticated
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    if (!aiResponse) {
      console.error("No AI response available to log food.");
      return;
    }

    // create foodData from AI Response
    const foodData: foodData = {
      name: aiResponse.mealName,
      type: FoodType.MEAL,
      servingSize: 1, // Use the service size provided by the user
      servingUnit: "Serving", // Default unit, can be adjusted
      foodMacros: {
        calories: aiResponse.calories,
        protein: aiResponse.proteinInGrams,
        carbs: aiResponse.carbsInGrams,
        fat: aiResponse.fatInGrams,
        fiber: aiResponse.fiberInGrams,
        sugar: aiResponse.sugarInGrams,
        sodium: aiResponse.sodiumInMg,
        cholesterol: aiResponse.cholesterolInMg,
      },
    };

    try {
      const response = await backend.post(
        `/api/users/${user?.email}/foods`,
        foodData,
      );
      console.log("Response from backend: " + response.status);
    } catch (exception: any) {
      console.error("Error sending user's new food to backend: " + exception);
    } finally {
      router.push("/(tabs)/log-food"); // NOTE: Current service for "food loggin" implementation has latency issues, so we will not redirect to the log food tab
    }
  };

  // get string representation the macro details
  const getMacroDetailsString = () => {
    return Object.entries(macroDetails)
      .filter(([, value]) => value !== "Any")
      .map(
        ([key, value]) =>
          `${value} ${key.charAt(0).toUpperCase() + key.slice(1)}`,
      )
      .join(", ");
  };

  // upload image to Firebase Storage
  const uploadImageToStorage = async (uri: string, fileName: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${fileName}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  // resetState
  const resetState = () => {
    setAiResponse(null);
    setError(null);
    setAdditionalIngredients("");
    setMealGoal("Weight Loss");
    setMacroDetails({
      protein: "High",
      carbs: "Low",
      fat: "Any",
      fiber: "Any",
      sugar: "Any",
      sodium: "Any",
    });
  };

  // send the image to the backend for analysis
  const sendImageToBackend = async (
    message: string,
    uri: string,
    mDetails: string,
    gDetails: string,
  ) => {
    // Accept arguments
    if (!uri || !message) {
      // Use arguments for the check
      console.error("Image URI or user request message is missing.");
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        userMessage: message, // Use the argument
        imageUri: uri, // Use the argument
        macroDetails: mDetails,
        goals: gDetails,
      };

      const response = await backend.post<NutriMealResponse>(
        "/api/nutri-meal",
        requestBody,
      );

      console.log("Response from backend:", response.data);
      setAiResponse(response.data);
    } catch (e: any) {
      console.error("Error sending image to backend:", e);
      setAiResponse(null);
      setError(e.message || "An error occurred while processing the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const processImage = async (res: ImagePicker.ImagePickerResult) => {
    if (!res.canceled && res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      setImage(asset.uri);
      resetState();

      // create the image file name, using the user ass reference and the current time.
      // this will be handled in the future when we have proper user autentification.
      const fileName = `user_${Date.now()}.jpg`; // create a unique file name

      try {
        const downloadUrl = await uploadImageToStorage(asset.uri, fileName);
        console.log(downloadUrl);
        setPublicImageUri(downloadUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    } else {
      console.log("Image selection was canceled or no image was selected.");
    }
  };

  // handle image picking from gallery / documents
  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [16, 9],
      quality: 1,
    });

    await processImage(res);
  };

  // handle image capture from camera
  const takePhoto = async () => {
    let res = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    await processImage(res);
  };

  // first option: analyze the image for calorie count and nutrition info
  const createRecipe = async () => {
    let message =
      "Create a recipe based on the edible ingredients in the image.";

    if (additionalIngredients) {
      message += ` Also, I have these ingredients available: ${additionalIngredients}.`;
    }

    if (mealPreferences) {
      message += ` I prefer meals that are ${mealPreferences}.`;
    }

    const macroString = getMacroDetailsString();

    if (publicImageUri) {
      await sendImageToBackend(message, publicImageUri, macroString, mealGoal);
    } else {
      console.error("Cannot analyze: public image URI is not available.");
      setError("Please select an image first.");
    }
  };

  const handleMacroChange = (macro: string, value: string) => {
    setMacroDetails((prevDetails) => ({
      ...prevDetails,
      [macro]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>NutriMeal</Text>

        {/* Permission buttons */}
        {status?.granted === false && (
          <Button
            title="Grant Gallery Permission"
            onPress={requestPermission}
          />
        )}
        {(Platform.OS === "android" || Platform.OS === "ios") &&
          cameraStatus?.granted === false && (
            <View style={styles.buttonSpacer}>
              <Button
                title="Grant Camera Permission"
                onPress={requestCameraPermission}
              />
            </View>
          )}

        {/* Image selection buttons */}
        <View style={styles.centered}>
          {status?.granted && (
            <Button title="Pick an image" onPress={pickImage} />
          )}
          <View style={styles.buttonSpacer} />
          {(Platform.OS === "android" || Platform.OS === "ios") &&
            cameraStatus?.granted && (
              <Button title="Take a Photo" onPress={takePhoto} />
            )}
        </View>

        {/* Display image and action buttons */}
        {image && (
          <View style={styles.centered}>
            <Image source={{ uri: image }} style={styles.image} />

            {/* --- User Input Section --- */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Any other ingredients you have?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., chicken breast, olive oil, salt"
                value={additionalIngredients}
                onChangeText={setAdditionalIngredients}
              />

              <Text style={styles.label}>Any preference for meal choices?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., pasta, vegetarian, gluten-free, mexican"
                value={mealPreferences}
                onChangeText={setMealPreferences}
              />

              <Text style={styles.label}>What is your meal goal?</Text>
              <View style={{ width: "90%", alignItems: "center" }}>
                <Picker
                  selectedValue={mealGoal}
                  onValueChange={(itemValue: string) => setMealGoal(itemValue)}
                  mode="dropdown"
                  style={{ width: 250 }}
                >
                  <Picker.Item label="Weight Loss" value="Weight Loss" />
                  <Picker.Item label="Muscle Gain" value="Muscle Gain" />
                  <Picker.Item
                    label="Maintain Weight"
                    value="Maintain Weight"
                  />
                  <Picker.Item label="High Energy" value="High Energy" />
                  <Picker.Item label="Quick & Easy" value="Quick & Easy" />
                </Picker>
              </View>
              <Text style={styles.label}>Macro Details</Text>
              <View style={styles.macroGrid}>
                {Object.keys(macroDetails).map((macro) => (
                  <View key={macro} style={styles.macroItem}>
                    <Text style={styles.macroLabel}>
                      {macro.charAt(0).toUpperCase() + macro.slice(1)}
                    </Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={
                          macroDetails[macro as keyof typeof macroDetails]
                        }
                        onValueChange={(itemValue: string) =>
                          handleMacroChange(macro, itemValue)
                        }
                      >
                        {macroLevels.map((level) => (
                          <Picker.Item
                            key={level}
                            label={level}
                            value={level}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <Button title="Create Recipe" onPress={createRecipe} />
            </View>
          </View>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a90e2" />
            <Text style={styles.infoText}>Processing...</Text>
          </View>
        )}

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* AI Response */}
        {aiResponse && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>{aiResponse.mealName}</Text>
            <Text style={styles.responseText}>
              <Text style={styles.bold}>Ingredients:</Text>{" "}
              {aiResponse.ingredients.join(", ")}
            </Text>
            <Text style={styles.responseText}>
              <Text style={styles.bold}>Instructions:</Text>{" "}
              {aiResponse.instructions.join(" ")}
            </Text>
            <Text style={styles.responseText}>
              <Text style={styles.bold}>Serving Suggestions:</Text>{" "}
              {aiResponse.servingSuggestions.join(", ")}
            </Text>
            <Text style={styles.responseText}>
              <Text style={styles.bold}>Meal Analysis:</Text>{" "}
              {aiResponse.mealAnalysis}
            </Text>
            <View style={styles.nutritionGrid}>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Calories:</Text> {aiResponse.calories}{" "}
                kcal
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Protein:</Text>{" "}
                {aiResponse.proteinInGrams} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Carbs:</Text>{" "}
                {aiResponse.carbsInGrams} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Fat:</Text> {aiResponse.fatInGrams} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Fiber:</Text>{" "}
                {aiResponse.fiberInGrams} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Sugar:</Text>{" "}
                {aiResponse.sugarInGrams} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Sodium:</Text> {aiResponse.sodiumInMg}{" "}
                mg
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>cholesterol:</Text>{" "}
                {aiResponse.cholesterolInMg} g
              </Text>
            </View>
            {/* let change the serving size to the user */}
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                // align to the right
                alignItems: "center",
              }}
            >
              <Text style={styles.label}>Number of Servings:</Text>
              <TextInput
                style={[styles.input, { width: "10%", marginLeft: 10 }]}
                keyboardType="numeric"
                value={numberOfServingsInput}
                onChangeText={(text) => {
                  // Allow empty string for editing
                  if (/^\d*$/.test(text)) {
                    setNumberOfServingsInput(text);
                    // Update numberOfServings only if valid number
                    const num = parseInt(text, 10);
                    if (!isNaN(num) && num >= 1 && num <= 20) {
                      setNumberOfServings(num);
                    } else if (num === 0) {
                      setNumberOfServings(1); // Default to 1 if 0 is entered
                    }
                  }
                }}
                maxLength={2}
                placeholder="1-20"
              />
              <View style={{ width: "40%" }}>
                <Button
                  title="Log Food"
                  onPress={() => logFood(numberOfServings)}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  centered: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 15,
    marginBottom: 20,
  },
  actionsContainer: {
    width: "80%",
    marginTop: 10,
  },
  buttonSpacer: {
    marginVertical: 5,
  },
  inputSection: {
    width: "90%",
    marginTop: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    width: "100%",
    color: "#000",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
  },
  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  macroItem: {
    width: "48%",
    marginBottom: 10,
  },
  macroLabel: {
    textAlign: "center",
    marginBottom: 5,
    fontSize: 14,
    color: "#000",
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  responseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  responseTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  nutritionGrid: {
    marginTop: 10,
    marginBottom: 10,
  },
});
