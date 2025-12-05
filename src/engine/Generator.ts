import { MenuData } from "../constants/MenuData";
import { DayPlan, WeeklyPlan } from "../types/DailyPlan";
import { FoodItem } from "../types/FoodItem";

// Helper: Get random item from a specific list
const getRandom = (items: FoodItem[]) =>
  items[Math.floor(Math.random() * items.length)];

export const generateWeeklyPlan = (totalBudget: number): WeeklyPlan => {
  const days: DayPlan[] = [];
  const today = new Date();

  // Reserve 10% for snacks
  let workableBudget = totalBudget * 0.9;
  let runningBudget = workableBudget;

  // 1. Create Strict Pools
  const messLunch = MenuData.filter(
    (i) => i.category.includes("Lunch") && i.isMess
  );
  const messDinner = MenuData.filter(
    (i) => i.category.includes("Dinner") && i.isMess
  );

  const otherLunch = MenuData.filter(
    (i) => i.category.includes("Lunch") && !i.isMess
  );
  const otherDinner = MenuData.filter(
    (i) => i.category.includes("Dinner") && !i.isMess
  );
  const breakfastMenu = MenuData.filter((i) =>
    i.category.includes("Breakfast")
  );

  // 2. The Loop
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    let bItem: FoodItem, lItem: FoodItem, dItem: FoodItem;

    // Check Budget Health
    const dailyBudget = runningBudget / (7 - i);
    const isLowBudget = dailyBudget < 300;

    // --- NEW STRICT LOGIC ---

    // Decision: Is today a Mess Day?
    // If budget is low, force Mess. Else, 50/50 chance (or pure random).
    const forceMess = isLowBudget || Math.random() > 0.5;

    if (forceMess) {
      // STRICTLY PICK MESS ITEMS
      lItem = getRandom(messLunch);
      dItem = getRandom(messDinner); // Dinner MUST be mess
    } else {
      // STRICTLY PICK NON-MESS ITEMS
      lItem = getRandom(otherLunch);
      dItem = getRandom(otherDinner); // Dinner MUST NOT be mess
    }

    // Breakfast is independent
    bItem = getRandom(breakfastMenu);

    // Calculate Costs
    const dayCost = bItem.price + lItem.price + dItem.price;
    runningBudget -= dayCost;

    days.push({
      date: currentDate.toISOString(),
      meals: {
        breakfast: { item: bItem, status: "pending" },
        lunch: { item: lItem, status: "pending" },
        dinner: { item: dItem, status: "pending" },
      },
      totalCost: dayCost,
      totalCalories: bItem.calories + lItem.calories + dItem.calories,
      isRevealed: i < 3,
    });
  }

  return {
    days,
    startDate: today.toISOString(),
    generatedAt: Date.now(),
  };
};
