import { useState } from "react";
import { View, Image, Button, Text, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import backend from "../backend";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  analysis_of_contents_of_the_picture: string;
}

export default function NutriCast() {
  const [image, setImage] = useState<string | null>(null);
  const [publicImageUri, setPublicImageUri] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<NutriCastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // permissions
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

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
    const message = "Analyze this image for calorie count and nutrition info.";

    if (publicImageUri) {
      await sendImageToBackend(message, publicImageUri); // Pass the data directly
    } else {
      console.error("Cannot analyze: public image URI is not available.");
      setError("Please select an image first.");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>NutriCast</Text>
      {status?.granted === false ? (
        <Button title="Grant Permission" onPress={requestPermission} />
      ) : (
        <div>
          <Button title="Pick an image" onPress={pickImage} />
        </div>
      )}

      {(Platform.OS === "android" || Platform.OS === "ios") &&
        (cameraStatus?.granted === false ? (
          <Button
            title="Grant Camera Permission"
            onPress={requestCameraPermission}
          />
        ) : (
          <Button title="Take a Photo" onPress={takePhoto} />
        ))}

      {image && (
        <div>
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, marginTop: 20 }}
          />
          {/*
            Make a button to send the image to the backend:
            Set 3 different buttons:
              1. Analyze the image for calorie count and nutrition info
              2. Ask a question about the image, like "What is this food?"
              3. Get a recipe based on the image contents.
          */}
          <Button title="Analyze Image" onPress={analyzeImage} />
          {/* Other buttons will be implemented later */}
        </div>
      )}

      {isLoading && (
        <div className="mt-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Processing...</p>
        </div>
      )}

      {aiResponse && (
        <Text style={{ marginTop: 20, fontSize: 16 }}>
          Food Name: {aiResponse.name_of_the_food}
          {"\n"}
          Additional Recommendations: {aiResponse.additional_recommendation}
          {"\n"}
          Analysis: {aiResponse.analysis_of_contents_of_the_picture}
          {"\n"}
          Calories: {aiResponse.calories}
          {"\n"}
          Protein: {aiResponse.protein}
          {"\n"}
          Carbs: {aiResponse.carbs}
          {"\n"}
          Fat: {aiResponse.fat}
          {"\n"}
          Fiber: {aiResponse.fiber}
          {"\n"}
          Sugar: {aiResponse.sugar}
          {"\n"}
          Sodium: {aiResponse.sodium}
          {"\n"}
          Cholesterol: {aiResponse.cholesterol}
        </Text>
      )}
      {!image && !aiResponse && (
        <Text style={{ marginTop: 20, fontSize: 16 }}>
          No image selected or AI response available.
        </Text>
      )}
    </View>
  );
}
