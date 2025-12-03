import { MenuData } from "../constants/MenuData"; // Placeholder for now
import { DayPlan, WeeklyPlan } from "../types/DailyPlan";
import { FoodItem } from "../types/FoodItem";

// 1. The Setup
const DAILY_CALORIE_TARGET = 2000; // Default, will come from user later
const MESS_DAILY_COST = 0; // Assuming pre-paid

// Helper: Get random item from list
const getRandom = (items: FoodItem[]) =>
  items[Math.floor(Math.random() * items.length)];

export const generateWeeklyPlan = (totalBudget: number): WeeklyPlan => {
  const days: DayPlan[] = [];
  const today = new Date();

  // Reserve 10% for snacks
  let workableBudget = totalBudget * 0.9;
  let runningBudget = workableBudget;

  // Filter Menus by Category (Optimization)
  const breakfastMenu = MenuData.filter((i) =>
    i.category.includes("Breakfast")
  );
  const lunchMenu = MenuData.filter((i) => i.category.includes("Lunch"));
  const dinnerMenu = MenuData.filter((i) => i.category.includes("Dinner"));

  // 2. The Loop (Generate 7 Days)
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    let bItem: FoodItem, lItem: FoodItem, dItem: FoodItem;

    // --- ALGORITHM CORE ---

    // Check: Are we broke?
    const dailyBudget = runningBudget / (7 - i);
    const isLowBudget = dailyBudget < 300; // 300 PKR/day limit

    if (isLowBudget) {
      // STRATEGY: SURVIVAL MODE (Force Mess or Cheap Tuc)
      // For MVP simplicity: Force Mess Lunch/Dinner if available
      lItem = lunchMenu.find((x) => x.isMess) || getRandom(lunchMenu);
      dItem = dinnerMenu.find((x) => x.isMess) || getRandom(dinnerMenu);
      bItem =
        breakfastMenu.find((x) => x.price < 100) || getRandom(breakfastMenu);
    } else {
      // STRATEGY: NORMAL MODE (Random Selection)
      lItem = getRandom(lunchMenu);

      // RULE: Mess Logic (If Lunch is Mess, Dinner MUST be Mess)
      if (lItem.isMess) {
        dItem = dinnerMenu.find((x) => x.isMess) || getRandom(dinnerMenu);
      } else {
        dItem = getRandom(dinnerMenu);
      }

      bItem = getRandom(breakfastMenu);
    }

    // Calculate Costs
    const dayCost = bItem.price + lItem.price + dItem.price;
    runningBudget -= dayCost;

    // Push to Plan
    days.push({
      date: currentDate.toISOString(),
      meals: {
        breakfast: { item: bItem, status: "pending" },
        lunch: { item: lItem, status: "pending" },
        dinner: { item: dItem, status: "pending" },
      },
      totalCost: dayCost,
      totalCalories: bItem.calories + lItem.calories + dItem.calories,
      isRevealed: i < 3, // Reveal only first 3 days
    });
  }

  return {
    days,
    startDate: today.toISOString(),
    generatedAt: Date.now(),
  };
};
