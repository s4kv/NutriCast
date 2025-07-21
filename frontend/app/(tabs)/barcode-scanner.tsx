import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { Card } from 'react-native-paper';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system'; // Needed to read image file as Base64 on native

// Import your backend API service
import * as backend from '../../services/backend';
import axios from 'axios';

// --- TypeScript Interfaces (Imported from shared types.ts) ---
import { FoodMacros, FoodType, Food } from '../src/types';

// Define the structure for ScannedFoodItem, matching your Backend's actual JSON output.
interface ScannedFoodItem {
  name_of_the_food: string;
  barcode_scanned: string;
  nutritional_macros: FoodMacros; // Using camelCase as observed in actual JSON response
}

// New interface for the request body that sends the Base64 image to the backend
interface ImageBarcodeRequest {
  imageUri: string;
}

// Define the structure for BarcodeRequest, matching your BarcodeRequest.java
interface BarcodeRequest {
  barcode: string; // This should be 'barcode', not 'barcode_scanned' for the request body
}

// Define a default/empty FoodMacros object for fallback
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

function BarcodeScannerScreen() {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [scannedBarcodeValue, setScannedBarcodeValue] = useState<string | null>(null);
  const [foodItemResult, setFoodItemResult] = useState<ScannedFoodItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // Initial status message adjusted for web vs. native
  const [statusMessage, setStatusMessage] = useState<string>(
    Platform.OS === 'web' ? 'Enter barcode manually to get started.' : 'Ready'
  );
  const [manualBarcodeInput, setManualBarcodeInput] = useState<string>('');

  // Ref for the hidden file input on web (still needed in case we add a specific "upload image" button for web later)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Unified image processing response handler (only called on native now)
  const processImage = async (uri: string, base64?: string) => {
    setSelectedImageUri(uri); // Display the image preview
    setScannedBarcodeValue(null); // Clear previous barcode
    setFoodItemResult(null); // Clear previous food item
    setManualBarcodeInput(''); // Clear manual input when a new image is selected/taken

    setStatusMessage('Image selected. Preparing for backend analysis...');
    await convertImageToBase64AndSend(uri, base64);
  };

  // Handles response from react-native-image-picker (native only)
  const processImagePickerResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      setStatusMessage('Picture taking cancelled');
    } else if (response.errorMessage) {
      setStatusMessage(`Error taking picture: ${response.errorMessage}`);
      Alert.alert('Camera Error', response.errorMessage);
      if (response.errorMessage.includes('permission')) {
        Alert.alert(
          'Permission Required',
          'Camera/Photo Library access is required. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } else if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      if (asset.uri) {
        await processImage(asset.uri, asset.base64);
      } else {
        setStatusMessage('Error: No image URI found.');
        Alert.alert('Error', 'Could not get image URI.');
      }
    }
  };

  const handleTakePicture = () => {
    // This button is now only rendered on native platforms
    launchCamera({ mediaType: 'photo', quality: 0.8, includeBase64: true }, processImagePickerResponse);
  };

  const handleSelectPicture = () => {
    // This button is now only rendered on native platforms
    launchImageLibrary({ mediaType: 'photo', quality: 0.8, includeBase64: true }, processImagePickerResponse);
  };

  // handleWebFileChange is still needed if we later add a specific web-only image upload button
  // For now, it's not directly triggered by a visible button.
  const handleWebFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Uri = reader.result as string;
        // This part is for web-specific image handling if re-enabled
        // For now, the image upload buttons are hidden on web.
        // If you re-enable image upload for web, uncomment the call to processImage here.
        // await processImage(base64Uri, base64Uri.split(',')[1]);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        setStatusMessage("Error reading file.");
        Alert.alert("File Error", "Could not read the selected file.");
      };
      reader.readAsDataURL(file);
    } else {
      setStatusMessage('No file selected.');
    }
  };

  const handleManualBarcodeSubmit = async () => {
    if (manualBarcodeInput.trim() === '') {
      Alert.alert('Input Required', 'Please enter a barcode value.');
      return;
    }
    setScannedBarcodeValue(manualBarcodeInput.trim());
    setStatusMessage('Barcode entered. Sending to backend...');
    await sendBarcodeStringOnlyToBackend(manualBarcodeInput.trim());
  };

  // This function is now only called on native platforms
  const convertImageToBase64AndSend = async (imageUri: string, providedBase64?: string) => {
    setLoading(true);
    setStatusMessage("Converting image to Base64...");
    let dataUri = imageUri;

    try {
      if (!providedBase64) {
        // This block will only run on native if base64 wasn't provided by image-picker
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        dataUri = `data:image/jpeg;base64,${base64}`;
      } else {
        dataUri = `data:image/jpeg;base64,${providedBase64}`;
      }

      setStatusMessage("Sending image to backend for barcode extraction...");
      await sendImageToBackendForBarcodeExtraction(dataUri);
    } catch (error: any) {
      console.error("Error converting image to Base64 or sending:", error);
      setStatusMessage(`Image processing error: ${error.message}`);
      Alert.alert("Image Error", `Failed to process image: ${error.message}`);
      setLoading(false);
    }
  };

  const sendImageToBackendForBarcodeExtraction = async (base64Image: string) => {
    setLoading(true);
    setFoodItemResult(null);
    setStatusMessage('Sending image to backend for barcode extraction and analysis...');

    try {
      const requestBody: ImageBarcodeRequest = { imageUri: base64Image };
      const responseData = await backend.sendImageForBarcodeExtraction(requestBody);

      setScannedBarcodeValue(responseData.barcode_scanned);

      const finalFoodItemResult: ScannedFoodItem = {
        name_of_the_food: responseData.name_of_the_food,
        barcode_scanned: responseData.barcode_scanned,
        nutritional_macros: responseData.nutritional_macros || defaultFoodMacros,
      };

      setFoodItemResult(finalFoodItemResult);
      setStatusMessage('Analysis complete!');
      Alert.alert('Success', 'Food analysis successful!');
    } catch (error: any) {
      console.error('Backend image processing error:', error);
      if (axios.isAxiosError(error) && error.response) {
        setStatusMessage(`Backend error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        Alert.alert('Backend Error', `Status: ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`);
      } else {
        setStatusMessage(`Network error: ${error.message}`);
        Alert.alert('Network Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendBarcodeStringOnlyToBackend = async (barcode: string) => {
    setLoading(true);
    setFoodItemResult(null);
    setStatusMessage('Sending barcode to backend for analysis...');

    try {
      const requestBody: BarcodeRequest = { barcode: barcode };
      const responseData = await backend.sendBarcodeToBackend(requestBody);

      setScannedBarcodeValue(responseData.barcode_scanned);

      const finalFoodItemResult: ScannedFoodItem = {
        name_of_the_food: responseData.name_of_the_food,
        barcode_scanned: responseData.barcode_scanned,
        nutritional_macros: responseData.nutritional_macros || defaultFoodMacros,
      };

      setFoodItemResult(finalFoodItemResult);
      setStatusMessage('Analysis complete!');
      Alert.alert('Success', 'Food analysis successful!');
    } catch (error: any) {
      console.error('API call error:', error);
      if (axios.isAxiosError(error) && error.response) {
        setStatusMessage(`Backend error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        Alert.alert('Backend Error', `Status: ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`);
      } else {
        setStatusMessage(`Network error: ${error.message}`);
        Alert.alert('Network Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const currentMacros = foodItemResult?.nutritional_macros || defaultFoodMacros;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titleText}>NutriCast Barcode/Food Analyzer</Text>

      {/* Main content view, now with responsive width */}
      <View style={styles.mainContentWidth}>
        <Card mode="elevated">
          <Card.Content style={styles.flexColumn}>
            {/* Image Preview Area - Only shown on native platforms */}
            {Platform.OS !== 'web' && (
              <View style={styles.imageContainer}>
                {selectedImageUri ? (
                  <Image source={{ uri: selectedImageUri }} style={styles.image} />
                ) : (
                  <View style={styles.placeholder}>
                    <Ionicons name="image-outline" size={80} color="#bbb" />
                    <Text style={styles.placeholderText}>No image selected</Text>
                    <Text style={styles.placeholderTextSmall}>(Take or select a picture of a food item or barcode)</Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons - Only shown on native platforms */}
            {Platform.OS !== 'web' && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Take Picture of Barcode"
                  onPress={handleTakePicture}
                  disabled={loading}
                  color="#4CAF50"
                />
                <View style={{ marginVertical: 10 }} />
                <Button
                  title="Select Picture from Gallery"
                  onPress={handleSelectPicture}
                  disabled={loading}
                  color="#6c757d"
                />
              </View>
            )}

            {/* Manual Barcode Input - Always shown */}
            <View style={styles.manualInputContainer}>
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

            {/* Status Message */}
            <Text style={styles.statusText}>Status: {statusMessage}</Text>

            {/* Barcode Value Display (after backend extraction/manual input) */}
            {scannedBarcodeValue && !loading && (
              <View style={styles.scannedBarcodeContainer}>
                <Text style={styles.scannedBarcodeText}>
                  Detected Barcode: <Text style={styles.scannedBarcodeValue}>{scannedBarcodeValue}</Text>
                </Text>
              </View>
            )}

            {/* Analysis Result Display (from backend) */}
            {foodItemResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.heading2Text}>Analysis Result</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Name:</Text> {foodItemResult.name_of_the_food || 'Unknown'}</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Barcode:</Text> {foodItemResult.barcode_scanned || 'Not Found'}</Text>
                <View style={styles.separator} />
                <Text style={styles.resultText}><Text style={styles.label}>Nutritional Macros:</Text></Text>
                <Text style={styles.resultText}><Text style={styles.label}>Calories:</Text> {currentMacros.calories || 0} kcal</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Protein:</Text> {currentMacros.protein || 0} g</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Carbs:</Text> {currentMacros.carbs || 0} g</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Fat:</Text> {currentMacros.fat || 0} g</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Fiber:</Text> {currentMacros.fiber || 0} g</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Sugar:</Text> {currentMacros.sugar || 0} g</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Sodium:</Text> {currentMacros.sodium || 0} mg</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Cholesterol:</Text> {currentMacros.cholesterol || 0} mg</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // General styling for all tabs (copied from LogFood example)
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f8f8f8', // Added background for consistency
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20, // Added margin for spacing
    color: '#2c3e50', // Added color for consistency
  },
  heading1Text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  heading2Text: {
    fontSize: 20, // Increased for better visibility in result card
    fontWeight: "bold",
    marginBottom: 10, // Added for spacing
    color: '#333',
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

  // NEW: Responsive width for the main content card to prevent squishing
  mainContentWidth: {
    width: '100%', // Take full width on small screens
    maxWidth: 500, // Max width on larger screens (e.g., tablets/desktops)
    alignItems: 'center', // Center content horizontally within this view
  },

  // Specific styling for the barcode scanner tab
  imageContainer: {
    width: '95%', // Increased width to give more space
    aspectRatio: 1, // Makes it a square
    borderRadius: 15,
    backgroundColor: '#eef2f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Adjusted margin
    overflow: 'hidden',
    borderWidth: 1, // Adjusted border width
    borderColor: '#d0d8e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, // Adjusted shadow
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // Android shadow
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 10,
  },
  placeholderTextSmall: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    width: '100%', // Ensure buttons take full width within card content
    // Removed paddingHorizontal: 10, to allow buttons to stretch more
  },
  manualInputContainer: {
    width: '95%', // Increased width for better spacing
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  textInput: {
    width: '95%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingText: {
    marginLeft: 15,
    fontSize: 17,
    color: '#333',
    fontWeight: '500',
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  scannedBarcodeContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e6ffe6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    width: '90%',
    alignItems: 'center',
  },
  scannedBarcodeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  scannedBarcodeValue: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'normal',
  },
  resultContainer: {
    marginTop: 25,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '100%', // Take full width of card content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 10, // Adjust for ScrollView
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
    lineHeight: 24,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
});

export default BarcodeScannerScreen;
