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
import backend from "../backend";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../auth-context";
import { useRouter } from "expo-router";

// this is the AI response, will be latter used to log the food
interface NutriCastResponse {
  name_of_the_food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  additional_recommendation: string;
  prompt_response: string;
  analysis_of_contents_of_the_picture: string;
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

export default function NutriCast() {
  const [image, setImage] = useState<string | null>(null);
  const [publicImageUri, setPublicImageUri] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<NutriCastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mealDescription, setMealDescription] = useState<string>("");

  // permissions
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  // user
  const { user } = useAuth();

  // router
  const router = useRouter();

  // new log foods option added here!
  const logFood = async () => {
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
      name: aiResponse.name_of_the_food,
      type: FoodType.MEAL,
      servingSize: 1, // Default serving size, can be adjusted maybe in the future
      servingUnit: "grams", // Default unit, can be adjusted
      foodMacros: {
        calories: aiResponse.calories,
        protein: aiResponse.protein,
        carbs: aiResponse.carbs,
        fat: aiResponse.fat,
        fiber: aiResponse.fiber,
        sugar: aiResponse.sugar,
        sodium: aiResponse.sodium,
        cholesterol: aiResponse.cholesterol,
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
  };

  // send the image to the backend for analysis
  const sendImageToBackend = async (message: string, uri: string) => {
    // Accept arguments
    if (!uri || !message) {
      // Use arguments for the check
      console.error("Image URI or user request message is missing.");
      return;
    }

    resetState();
    setIsLoading(true);

    try {
      const requestBody = {
        userMessage: message, // Use the argument
        imageUri: uri, // Use the argument
      };

      const response = await backend.post<NutriCastResponse>(
        "/api/chat",
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

    console.log("ImagePicker result:", res);

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
  const analyzeImage = async () => {
    let message = "Analyze this image for calorie count and nutrition info.";

    if (mealDescription) {
      message += ` Meal description: ${mealDescription}`;
    }

    if (publicImageUri) {
      await sendImageToBackend(message, publicImageUri); // Pass the data directly
    } else {
      console.error("Cannot analyze: public image URI is not available.");
      setError("Please select an image first.");
    }
  };

  const askQuestion = async () => {
    const message = "What is this food?";
    if (publicImageUri) {
      await sendImageToBackend(message, publicImageUri);
    } else {
      console.error("Cannot ask question: public image URI is not available.");
      setError("Please select an image first.");
    }
  };

  const getRecipe = async () => {
    const message = "Get a recipe based on the image contents.";
    if (publicImageUri) {
      await sendImageToBackend(message, publicImageUri);
    } else {
      console.error("Cannot get recipe: public image URI is not available.");
      setError("Please select an image first.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>NutriCast</Text>

        {/* Display permission buttons if needed */}
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

        {/* Initial state: Show image selection buttons */}
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
            <Text style={styles.label}>Describe the meal</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Chicken Salad with Avocado"
              value={mealDescription}
              onChangeText={setMealDescription}
            />
            <View style={styles.actionsContainer}>
              <Button title="Analyze Nutrition" onPress={analyzeImage} />
              <View style={styles.buttonSpacer} />
              <Button title="What is this food?" onPress={askQuestion} />
              <View style={styles.buttonSpacer} />
              <Button title="Get a Recipe" onPress={getRecipe} />
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
            <Text style={styles.responseTitle}>
              {aiResponse.name_of_the_food}
            </Text>
            <Text style={styles.responseText}>
              <Text style={styles.bold}>Response: </Text>
              {aiResponse.prompt_response}
            </Text>
            <Text style={styles.responseText}>
              <Text style={styles.bold}>Analysis: </Text>
              {aiResponse.analysis_of_contents_of_the_picture}
            </Text>
            <View style={styles.nutritionGrid}>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Calories:</Text> {aiResponse.calories}{" "}
                kcal
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Protein:</Text> {aiResponse.protein} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Carbs:</Text> {aiResponse.carbs} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Fat:</Text> {aiResponse.fat} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Fiber:</Text> {aiResponse.fiber} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Sugar:</Text> {aiResponse.sugar} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>Sodium:</Text> {aiResponse.sodium} g
              </Text>
              <Text style={styles.responseText}>
                <Text style={styles.bold}>cholesterol:</Text>{" "}
                {aiResponse.cholesterol} g
              </Text>
            </View>
            <Text style={styles.responseText}>
              <Text style={styles.bold}>Recommendation: </Text>
              {aiResponse.additional_recommendation}
            </Text>

            {/* this is for the log food buttom */}
            <View style={styles.buttonSpacer} />
            <Button title="Log this food" onPress={logFood} />
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
    color: "#2c3e50",
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
  loadingContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: "#d9534f",
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
    color: "#34495e",
    marginBottom: 10,
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#34495e",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  nutritionGrid: {
    marginTop: 10,
    marginBottom: 10,
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
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#34495e",
    marginBottom: 8,
    marginTop: 10,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    width: "100%",
    justifyContent: "center", // Center picker text on Android
  },
});
