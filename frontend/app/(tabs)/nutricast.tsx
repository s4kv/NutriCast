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
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import backend from "../../services/backend";
import { storage } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../services/auth-context";
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
      servingUnit: "Servings", // Default unit, can be adjusted
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} // si tienes un header fijo
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>NutriCast</Text>

        {/* Permission Buttons */}
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

        {/* Image Selection */}
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

        {/* Image Preview & Actions */}
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

        {/* Loader */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6c63ff" />
            <Text style={styles.infoText}>Processing...</Text>
          </View>
        )}

        {/* Error */}
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

            {/* Nutrition Chips */}
            <View style={styles.nutritionGrid}>
              {[
                { label: "Calories", value: `${aiResponse.calories} kcal` },
                { label: "Protein", value: `${aiResponse.protein} g` },
                { label: "Carbs", value: `${aiResponse.carbs} g` },
                { label: "Fat", value: `${aiResponse.fat} g` },
                { label: "Fiber", value: `${aiResponse.fiber} g` },
                { label: "Sugar", value: `${aiResponse.sugar} g` },
                { label: "Sodium", value: `${aiResponse.sodium} mg` },
                { label: "Cholesterol", value: `${aiResponse.cholesterol} mg` },
              ].map((item, idx) => (
                <View key={idx} style={styles.chip}>
                  <Text style={styles.chipText}>
                    <Text style={styles.bold}>{item.label}: </Text>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.responseText}>
              <Text style={styles.bold}>Recommendation: </Text>
              {aiResponse.additional_recommendation}
            </Text>

            <View style={styles.buttonSpacer} />
            <Button title="Log this food" onPress={logFood} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/*** 𝙎𝙩𝙮𝙡𝙚𝙨 ***/
const PRIMARY = "#34495e"; // Soft indigo
const BG = "#f5f7fa"; // Light gray‑blue background
const TEXT = "#34495e"; // Muted dark slate

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
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
    color: PRIMARY,
    marginBottom: 20,
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 20,
    marginBottom: 20,
  },
  actionsContainer: {
    width: "80%",
    marginTop: 10,
  },
  buttonSpacer: {
    marginVertical: 6,
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: TEXT,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
  },
  responseContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  responseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: TEXT,
    marginBottom: 12,
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: TEXT,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  // Chips Grid
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  chip: {
    backgroundColor: "#e0ecff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  chipText: {
    fontSize: 14,
    color: TEXT,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 8,
    marginTop: 10,
  },
});
