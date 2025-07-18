// frontend/src/types.ts

export interface FoodMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
}

// ... other types like FoodType, Food

export interface ScannedFoodItem {
  name_of_the_food: string;
  barcode: string; // Corresponds to @JsonProperty("barcode_scanned")

  // Change this to match the @JsonProperty name from Java
  // This tells TypeScript that the incoming JSON will have 'nutritional_macros'
  nutritionalMacros: FoodMacros; // <--- CHANGED THIS LINE
}

export enum FoodType {
  ITEM = "ITEM",
  MEAL = "MEAL",
}

export interface Food {
  id: string;
  userId: string;
  name: string;
  type: FoodType;
  servingSize: number;
  servingUnit: string;
  macros: FoodMacros;
}

// You can add other shared interfaces/types here as your app grows