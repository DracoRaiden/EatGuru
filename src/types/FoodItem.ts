// src/types/FoodItem.ts

// specific vendors in the GIKI "Tuc" area + others
export type LocationType =
  | "Mess"
  | "Cafe"
  | "Store"
  | "Raju"
  | "Ayaan"
  | "Hot and Spicy"
  | "Israrbucks" // Drinks only
  | "Sip Spot"; // Drinks only

export type MealTime = "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Drink";

export interface FoodItem {
  id: string;
  name: string;
  location: LocationType;
  price: number;
  calories: number;
  protein: number; // in grams
  category: MealTime[];
  isMess: boolean; // Vital for the "Mess Rule"
}
