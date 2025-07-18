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
  Platform,
  Linking,
} from 'react-native';
import { Card } from 'react-native-paper'; // For consistent UI styling
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons'; // For icons

// Import your backend API service
// Based on the provided file structure:
// - project-root/frontend/app/barcode-scanner.tsx
// - project-root/frontend/services/backend.ts
import * as backend from '../../services/backend'; // CORRECTED PATH

import axios from 'axios'; // Explicitly import axios for error handling

// --- TypeScript Interfaces (Imported from shared types.ts) ---
// Assuming project structure:
// - project-root/frontend/src/types.ts
interface Food {
  id: String;
  userId: String;
  name: String;
  type: FoodType;
  servingSize: number;
  servingUnit: String;
  macros: FoodMacros;
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

// Define the structure for ScannedFoodItem, matching your ScannedFoodItem.java
// This interface remains local if ScannedFoodItem is not used in other frontend files.
interface ScannedFoodItem {
  name: string;
  barcode: string; // Corresponds to @JsonProperty("barcode_scanned")
  nutritionalMacros: FoodMacros; // Uses the imported FoodMacros
}

// Define the structure for BarcodeRequest, matching your BarcodeRequest.java
// This interface remains local if BarcodeRequest is not used in other frontend files.
interface BarcodeRequest {
  barcode: string;
}

enum FoodType {
  ITEM,
  MEAL,
}

// Main component for the barcode scanner screen
function BarcodeScannerScreen() {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [scannedBarcodeValue, setScannedBarcodeValue] = useState<string | null>(null);
  const [foodItemResult, setFoodItemResult] = useState<ScannedFoodItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready');

  // Helper to process image picker response and initiate barcode scan
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
      setSelectedImageUri(asset.uri || null);
      setScannedBarcodeValue(null); // Clear previous barcode
      setFoodItemResult(null); // Clear previous food item

      if (asset.uri) {
        setStatusMessage('Image selected. Detecting barcode...');
        // Call the simulated barcode detection
        await detectBarcodeFromImage(asset.uri);
      } else {
        setStatusMessage('Error: No image URI found.');
        Alert.alert('Error', 'Could not get image URI.');
      }
    }
  };

  // Function to handle taking a picture using the device camera
  const handleTakePicture = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, processImagePickerResponse);
  };

  // Function to handle selecting a picture from the device's gallery/photo library
  const handleSelectPicture = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, processImagePickerResponse);
  };

  // Function to detect barcode from a given image URI (currently simulated)
  const detectBarcodeFromImage = async (imageUri: string) => {
    setLoading(true);
    try {
      // --- TEMPORARY WORKAROUND: Simulate barcode detection ---
      Alert.prompt(
        "Simulate Barcode Detection",
        "Please enter the barcode value from the image:",
        [
          {
            text: "Cancel",
            onPress: () => {
              setStatusMessage("Barcode detection cancelled.");
              setLoading(false);
            },
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async (inputBarcode) => {
              if (inputBarcode && inputBarcode.trim() !== '') {
                setScannedBarcodeValue(inputBarcode.trim());
                setStatusMessage('Barcode detected. Sending to backend...');
                await sendBarcodeToBackend(inputBarcode.trim());
              } else {
                setStatusMessage('No barcode entered. Please try again.');
                setLoading(false);
              }
            },
          },
        ],
        'plain-text',
        '' // Default value
      );
      // --- END TEMPORARY WORKAROUND ---

    } catch (error) {
      console.error("Error detecting barcode from image:", error);
      setStatusMessage("Error detecting barcode from image.");
      Alert.alert("Barcode Detection Error", "Could not detect barcode from the image. Please try again or ensure the barcode is clear.");
    } finally {
      // setLoading(false); // Will be set by the Alert.prompt callback
    }
  };


  // Function to send the extracted barcode string to the Spring Boot backend
  const sendBarcodeToBackend = async (barcode: string) => {
    setLoading(true);
    setFoodItemResult(null); // Clear previous food item results
    setStatusMessage('Sending barcode to backend for analysis...');

    try {
      // Call the helper function from your backend.ts service
      const responseData = await backend.sendBarcodeToBackend(barcode);

      setFoodItemResult(responseData); // Set the received structured data
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
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titleText}>Barcode Scanner</Text>

      <View style={{ width: "100%" }}>
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

            {/* Loading Indicator */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Analyzing...</Text>
              </View>
            )}

            {/* Status Message */}
            <Text style={styles.statusText}>Status: {statusMessage}</Text>

            {/* Barcode Value Display (after client-side detection) */}
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
                <Text style={styles.resultText}><Text style={styles.label}>Name:</Text> {foodItemResult.name || 'Unknown'}</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Barcode:</Text> {foodItemResult.barcode || 'Not Found'}</Text>
                <View style={styles.separator} />
                <Text style={styles.resultText}><Text style={styles.label}>Nutritional Macros:</Text></Text>
                <Text style={styles.resultText}><Text style={styles.label}>Calories:</Text> {foodItemResult.nutritionalMacros.calories || 0} kcal</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Protein:</Text> {foodItemResult.nutritionalMacros.protein || 0} g</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Carbs:</Text> {foodItemResult.nutritionalMacros.carbs || 0} g</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Fat:</Text> {foodItemResult.nutritionalMacros.fat || 0} g</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Fiber:</Text> {foodItemResult.nutritionalMacros.fiber || 0} g</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Sugar:</Text> {foodItemResult.nutritionalMacros.sugar || 0} g</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Sodium:</Text> {foodItemResult.nutritionalMacros.sodium || 0} mg</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Cholesterol:</Text> {foodItemResult.nutritionalMacros.cholesterol || 0} mg</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // General styling for all tabs (copied and adapted from LogFood example)
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

  // Specific styling for the barcode scanner tab
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
    backgroundColor: '#e6ffe6', // Light green background
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
    color: '#007bff', // Blue color for the value
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
