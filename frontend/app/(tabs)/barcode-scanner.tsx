import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  Linking,
  TextInput,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import * as backend from "../../services/backend";

interface ScannedFoodItem {
  name_of_the_food: string;
  barcode_scanned: string;
  nutritional_macros: FoodMacros;
}

interface NutriCastPictureRequest {
  imageUri: string;
  userMessage: string;
}

interface BarcodeRequest {
  barcode: string;
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

const defaultFoodMacros: FoodMacros = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
  cholesterol: 0,
};
// --- End of Interfaces ---

function BarcodeScannerScreen() {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [scannedBarcodeValue, setScannedBarcodeValue] = useState<string | null>(
    null,
  );
  const [foodItemResult, setFoodItemResult] = useState<ScannedFoodItem | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("Ready");
  const [manualBarcodeInput, setManualBarcodeInput] = useState<string>(""); // State for manual input

  // Function to handle taking a picture
  const handleTakePicture = () => {
    launchCamera(
      { mediaType: "photo", includeBase64: true, quality: 0.7 },
      (response) => {
        if (response.didCancel) {
          setStatusMessage("Picture taking cancelled");
        } else if (response.errorMessage) {
          setStatusMessage(`Error taking picture: ${response.errorMessage}`);
          Alert.alert("Camera Error", response.errorMessage);
          if (response.errorMessage.includes("permission")) {
            Alert.alert(
              "Permission Required",
              "Camera access is required to take pictures. Please enable it in your device settings.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Open Settings",
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          }
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setSelectedImageUri(asset.uri || null);
          setStatusMessage("Image captured. Sending to backend...");
          if (asset.base64) {
            sendImageToBackend(asset.base64); // Send Base64 data
          } else {
            setStatusMessage("Error: No Base64 data from image.");
            Alert.alert(
              "Error",
              "Could not get Base64 data from the captured image.",
            );
          }
        }
      },
    );
  };

  // Function to handle selecting a picture from the gallery
  const handleSelectPicture = () => {
    launchImageLibrary(
      { mediaType: "photo", includeBase64: true, quality: 0.7 },
      (response) => {
        if (response.didCancel) {
          setStatusMessage("Image selection cancelled");
        } else if (response.errorMessage) {
          setStatusMessage(`Error selecting image: ${response.errorMessage}`);
          Alert.alert("Gallery Error", response.errorMessage);
          if (response.errorMessage.includes("permission")) {
            Alert.alert(
              "Permission Required",
              "Photo Library access is required to select pictures. Please enable it in your device settings.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Open Settings",
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          }
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setSelectedImageUri(asset.uri || null);
          setStatusMessage("Image selected. Sending to backend...");
          if (asset.base64) {
            sendImageToBackend(asset.base64);
          } else {
            setStatusMessage("Error: No Base64 data from image.");
            Alert.alert(
              "Error",
              "Could not get Base64 data from the selected image.",
            );
          }
        }
      },
    );
  };

  // Function to send the Base64 image data to the Spring Boot backend
  const sendImageToBackend = async (base64Image: string) => {
    setLoading(true);
    setFoodItemResult(null);
    setScannedBarcodeValue(null);
    setStatusMessage("Analyzing image with AI...");

    const dataUri = `data:image/jpeg;base64,${base64Image}`;

    const requestBody: NutriCastPictureRequest = {
      imageUri: dataUri,
      userMessage:
        "Analyze this image for food items and a barcode. If a barcode is present, extract its numerical value. Provide the food's name, the extracted barcode value, and estimated nutritional macros (calories, protein, carbs, fat, fiber, sugar, sodium, cholesterol) in integers. If a field cannot be determined, set numerical values to 0 and string values to 'N/A' or 'Unknown'. Make sure 'barcode_scanned' is a string. Also provide a brief general description of the food.",
    };

    try {
      const responseData =
        await backend.sendImageForBarcodeExtraction(requestBody);

      setFoodItemResult(responseData); // Set the received structured data
      setScannedBarcodeValue(responseData.barcode_scanned); // Update scanned barcode value
      setStatusMessage("Analysis complete!");
      Alert.alert("Success", "Food analysis successful!");
    } catch (error: any) {
      console.error("Network or parsing error:", error);
      if (axios.isAxiosError(error) && error.response) {
        setStatusMessage(
          `Backend error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        );
        Alert.alert(
          "Error",
          `Backend Error: ${error.response.status}\n${JSON.stringify(error.response.data)}`,
        );
      } else {
        setStatusMessage(`Network error: ${error.message}`);
        Alert.alert("Error", `Network or parsing error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle manual barcode submission
  const handleManualBarcodeSubmit = async () => {
    if (manualBarcodeInput.trim() === "") {
      Alert.alert("Input Required", "Please enter a barcode value.");
      return;
    }
    setLoading(true);
    setFoodItemResult(null);
    setScannedBarcodeValue(manualBarcodeInput.trim()); // Set the manually entered barcode
    setStatusMessage("Barcode entered. Sending to backend...");

    const requestBody: BarcodeRequest = { barcode: manualBarcodeInput.trim() };

    try {
      const responseData = await backend.sendBarcodeToBackend(requestBody);

      setFoodItemResult(responseData);
      setStatusMessage("Analysis complete!");
      Alert.alert("Success", "Food analysis successful!");
    } catch (error: any) {
      console.error("API call error:", error);
      if (axios.isAxiosError(error) && error.response) {
        setStatusMessage(
          `Backend error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        );
        Alert.alert(
          "Backend Error",
          `Status: ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`,
        );
      } else {
        setStatusMessage(`Network error: ${error.message}`);
        Alert.alert("Network Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const currentMacros = foodItemResult?.nutritional_macros || defaultFoodMacros;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titleText}>NutriCast Barcode/Food Analyzer</Text>

      <View style={{ width: "100%", alignItems: "center" }}>
        {/* Image Preview Area */}
        <View style={styles.imageContainer}>
          {selectedImageUri ? (
            <Image source={{ uri: selectedImageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={80} color="#bbb" />
              <Text style={styles.placeholderText}>No image selected</Text>
              <Text style={styles.placeholderTextSmall}>
                (Take or select a picture of a food item or barcode)
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Take Picture of Barcode/Food"
            onPress={handleTakePicture}
            disabled={loading}
            color="#4CAF50" // Primary button color
          />
          <View style={{ marginVertical: 10 }} /> {/* Spacer */}
          <Button
            title="Select Picture from Gallery"
            onPress={handleSelectPicture}
            disabled={loading}
            color="#6c757d" // Secondary button color
          />
        </View>

        {/* Manual Barcode Input */}
        <View style={styles.manualInputCard}>
          <Text style={styles.inputLabel}>Or Enter Barcode Manually:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter barcode value"
            value={manualBarcodeInput}
            onChangeText={setManualBarcodeInput}
            keyboardType="numeric"
            editable={!loading}
          />
          <Button
            title="Submit Barcode"
            onPress={handleManualBarcodeSubmit}
            disabled={loading}
            color="#007bff"
          />
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Analyzing...</Text>
          </View>
        )}

        <Text style={styles.statusText}>Status: {statusMessage}</Text>

        {/* Analysis Result Display */}
        {foodItemResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.heading2Text}>Analysis Result</Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Name:</Text>{" "}
              {foodItemResult.name_of_the_food || "Unknown"}
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Barcode:</Text>{" "}
              {foodItemResult.barcode_scanned || "Not Found"}
            </Text>
            <View style={styles.separator} />
            <Text style={styles.resultText}>
              <Text style={styles.label}>Nutritional Macros:</Text>
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Calories:</Text>{" "}
              {currentMacros.calories || 0} kcal
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Protein:</Text>{" "}
              {currentMacros.protein || 0} g
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Carbs:</Text>{" "}
              {currentMacros.carbs || 0} g
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Fat:</Text> {currentMacros.fat || 0} g
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Fiber:</Text>{" "}
              {currentMacros.fiber || 0} g
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Sugar:</Text>{" "}
              {currentMacros.sugar || 0} g
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Sodium:</Text>{" "}
              {currentMacros.sodium || 0} mg
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Cholesterol:</Text>{" "}
              {currentMacros.cholesterol || 0} mg
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// --- 𝙎𝙩𝙮𝙡𝙚𝙨 ---
const PRIMARY = "#34495e";
const BG = "#f5f7fa";
const TEXT = "#34495e";
const ACCENT = "#4a90e2";
const CHIP_BG = "#e0ecff";

const styles = StyleSheet.create({
  // Main container for the ScrollView content
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: BG,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: PRIMARY,
    marginBottom: 20,
  },
  heading1Text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  heading2Text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  heading3Text: {
    fontSize: 14,
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  flexColumnCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  flexRowBaseline: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  flexRowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flexSpaceEvenly: {
    display: "flex",
    justifyContent: "space-evenly",
  },

  imageContainer: {
    width: "95%",
    maxWidth: 320,
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: "#eef2f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#d0d8e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: "#a0a0a0",
    textAlign: "center",
    marginTop: 10,
  },
  placeholderTextSmall: {
    fontSize: 14,
    color: "#a0a0a0",
    textAlign: "center",
    marginTop: 5,
  },
  buttonContainer: {
    width: "95%",
    paddingHorizontal: 0,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingText: {
    marginLeft: 15,
    fontSize: 17,
    color: TEXT,
    fontWeight: "500",
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: TEXT,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  resultContainer: {
    marginTop: 25,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "95%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: PRIMARY,
    textAlign: "center",
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
    color: TEXT,
    lineHeight: 24,
  },
  label: {
    fontWeight: "bold",
    color: PRIMARY,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  manualInputCard: {
    width: "95%",
    marginTop: 20,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: PRIMARY,
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    width: "100%",
    color: PRIMARY,
    marginBottom: 15,
    textAlign: "center",
  },
});

export default BarcodeScannerScreen;
