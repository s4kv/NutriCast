import axios from "axios";

//const BASE_URL = "https://nutricast-462020.ue.r.appspot.com/"; // Adjust this URL as needed
const BASE_URL = "http://localhost:8080";

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

export async function sendBarcodeToBackend(barcode: string): Promise<ScannedFoodItem> {
  const requestBody: BarcodeRequest = { barcode: barcode };
  const response = await api.post<ScannedFoodItem>("/api/barcode/scan", requestBody);
  return response.data;
}