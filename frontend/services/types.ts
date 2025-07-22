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


export interface ScannedFoodItem {
  name_of_the_food: string;
  barcode: string; 
  nutritionalMacros: FoodMacros; 
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

