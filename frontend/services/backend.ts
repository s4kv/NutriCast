import axios from "axios";

 const BASE_URL = "https://nutricast-462020.ue.r.appspot.com/"; // Adjust this URL as needed
// const BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

/* ------------------------------------------------------------------
   Helper: send a friend request by username
   ------------------------------------------------------------------ */
export async function sendFriendRequest(username: string, token: string) {
  return api.post(
    "/api/friends/request",
    { username },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getFriends(token: string) {
  return api.get("/api/friends", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getIncomingRequests(token: string) {
  return api.get("/api/friends/requests", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getSentRequests(token: string) {
  return api.get("/api/friends/requests/sent", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function respondToRequest(
  requestId: string,
  accept: boolean,
  token: string,
) {
  return api.post(
    "/api/friends/respond",
    { requestId, accept },
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

interface ScannedFoodItem {
  name_of_the_food: string;
  barcode_scanned: string; 
  nutritional_macros: FoodMacros;
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

interface BarcodeRequest {
  barcode: string;
}

/* ------------------------------------------------------------------
   Helper: Send barcode string to backend for analysis (for manual input)
   ------------------------------------------------------------------ */
interface BarcodeRequest {
  barcode: string; // This matches the 'barcode' property expected by the backend
}

// CRITICAL FIX: Changed parameter type from 'string' to 'BarcodeRequest' object
export async function sendBarcodeToBackend(requestBody: BarcodeRequest): Promise<ScannedFoodItem> {
  const response = await api.post<ScannedFoodItem>("/api/barcode/scan", requestBody);
  return response.data;
}

/* ------------------------------------------------------------------
   NEW HELPER: Send Base64 image to backend for barcode extraction and analysis
   ------------------------------------------------------------------ */
interface ImageBarcodeRequest {
  imageUri: string; // Base64 string
}

export async function sendImageForBarcodeExtraction(requestBody: ImageBarcodeRequest): Promise<ScannedFoodItem> {
  // This is the new endpoint on your backend that will handle image processing
  const response = await api.post<ScannedFoodItem>("/api/barcode/extract-and-scan", requestBody);
  return response.data;
}