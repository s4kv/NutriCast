import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform, // Import Platform
  Linking,
  TextInput,
} from 'react-native';
import { Card } from 'react-native-paper';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system'; // Needed to read image file as Base64

// Import your backend API service
import * as backend from '../../services/backend';
import axios from 'axios';

// --- TypeScript Interfaces (Imported from shared types.ts) ---
import { FoodMacros, FoodType, Food } from '../../services/types';

// Define the structure for ScannedFoodItem, matching your Backend's actual JSON output.
interface ScannedFoodItem {
  name_of_the_food: string;
  barcode_scanned: string;
  nutritional_macros: FoodMacros; // Corrected: Using camelCase as observed in actual JSON response
}

// New interface for the request body that sends the Base64 image to the backend
interface ImageBarcodeRequest {
  imageUri: string;
}

// Define the structure for BarcodeRequest, matching your BarcodeRequest.java
interface BarcodeRequest {
  barcode: string; // Corrected: This should be 'barcode', not 'barcode_scanned' for the request body
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
  const [statusMessage, setStatusMessage] = useState<string>('Ready');
  const [manualBarcodeInput, setManualBarcodeInput] = useState<string>('');

  const processImagePickerResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      setStatusMessage('Image selection/capture cancelled');
    } else if (response.errorMessage) {
      setStatusMessage(`Error: ${response.errorMessage}`);
      Alert.alert('Error', response.errorMessage);
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
      setSelectedImageUri(asset.uri || null); // Display the image preview
      setScannedBarcodeValue(null); // Clear previous barcode
      setFoodItemResult(null); // Clear previous food item
      setManualBarcodeInput(''); // Clear manual input when a new image is selected/taken

      if (asset.uri) {
        // --- Added Platform Check Here ---
        if (Platform.OS === 'web') {
          setStatusMessage('Image selected. Image-to-barcode scanning is not supported on web. Please use the manual barcode input instead, or run the app on a mobile device.');
          Alert.alert('Feature Not Available', 'Image-to-barcode scanning is not supported when running on a web browser. Please use the manual barcode input instead, or run the app on a mobile device.');
          setLoading(false); // Stop loading if on web and feature is not supported
        } else {
          setStatusMessage('Image selected. Preparing for backend analysis...');
          await convertImageToBase64AndSend(asset.uri); // Call the function to convert and send image
        }
      } else {
        setStatusMessage('Error: No image URI found.');
        Alert.alert('Error', 'Could not get image URI.');
      }
    }
  };

  const handleTakePicture = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, processImagePickerResponse);
  };

  const handleSelectPicture = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, processImagePickerResponse);
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

  const convertImageToBase64AndSend = async (imageUri: string) => {
    setLoading(true);
    setStatusMessage("Converting image to Base64...");
    try {
      // Read the image file as Base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Construct the data URI format (important for some backend parsers)
      const dataUri = `data:image/jpeg;base64,${base64}`; // Assuming JPEG, adjust if needed

      setStatusMessage("Sending image to backend for barcode extraction...");
      await sendImageToBackendForBarcodeExtraction(dataUri); // Call the new backend service
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
      // The new backend endpoint will receive the Base64 image and return ScannedFoodItem
      const requestBody: ImageBarcodeRequest = { imageUri: base64Image };

      // Call the new helper function from your backend.ts service
      const responseData = await backend.sendImageForBarcodeExtraction(requestBody);

      // Set the detected barcode value from the backend's response
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

      <View style={{ width: "30%" }}>
        <Card mode="elevated">
          <Card.Content style={styles.flexColumn}>
            {/* Image Preview Area */}
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

            {/* Action Buttons */}
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

            {/* Manual Barcode Input */}
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
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#2c3e50',
  },
  heading1Text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  heading2Text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
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
  imageContainer: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: '#eef2f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d0d8e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
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
    width: '100%',
    paddingHorizontal: 10,
  },
  manualInputContainer: {
    width: '90%',
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
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 10,
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
