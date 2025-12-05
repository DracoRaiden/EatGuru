import { FoodItem } from "./FoodItem";

// 1. NEW: Define and Export the MealTime type
export type MealTime = "breakfast" | "lunch" | "dinner" | "snack";

export interface DailyMeal {
  item: FoodItem;
  status: "pending" | "eaten" | "skipped" | "swapped";
}

export interface DayPlan {
  date: string; // ISO String "2025-10-24"
  meals: {
    breakfast: DailyMeal;
    lunch: DailyMeal;
    dinner: DailyMeal;
    snack?: DailyMeal;
  };
  totalCost: number;
  totalCalories: number;
  isRevealed: boolean; // For the rolling feature
}

export interface WeeklyPlan {
  days: DayPlan[];
  startDate: string;
  generatedAt: number;
}
