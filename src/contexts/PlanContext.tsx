import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"; // Added useEffect
import { Alert } from "react-native"; // <--- Add this import
import { MenuData } from "../constants/MenuData";
import { generateWeeklyPlan } from "../engine/Generator"; // Import the Engine!
import { WeeklyPlan } from "../types/DailyPlan"; // Ensure MealTime is imported or defined as string

interface PlanContextType {
  budget: number;
  setBudget: (amount: number) => void;
  plan: WeeklyPlan | null;
  generatePlan: () => void;
  caloriesConsumed: number;
  moneySpent: number;
  toggleMealStatus: (
    dayIndex: number,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => void;
  shuffleMeal: (
    dayIndex: number,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => void;
  shuffleCount: number;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [budget, setBudget] = useState(15000);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [moneySpent, setMoneySpent] = useState(0);
  // Add this line with your other useState hooks
  const [shuffleCount, setShuffleCount] = useState(0);
  const toggleMealStatus = (
    dayIndex: number,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    if (!plan) return;
    // --- NEW: STRICT PROGRESSION CHECK ---
    // If we are trying to edit Day 2 (Index 1) or higher...
    if (dayIndex > 0) {
      // Check if the Previous Day (Index - 1) is fully eaten
      const prevDay = plan.days[dayIndex - 1];
      const isPrevDayFinished =
        prevDay.meals.breakfast.status === "eaten" &&
        prevDay.meals.lunch.status === "eaten" &&
        prevDay.meals.dinner.status === "eaten";

      if (!isPrevDayFinished) {
        Alert.alert(
          "Locked",
          "Please finish yesterday's meals before starting a new day!"
        );
        return; // <--- STOP EXECUTION HERE
      }
    }
    const newPlan = { ...plan };
    const day = newPlan.days[dayIndex];
    const meal = day.meals[mealType];
    // 2. Toggle Logic
    if (meal.status === "eaten") {
      // Undo: Remove cost/calories
      meal.status = "pending";
      setMoneySpent((prev) => prev - meal.item.price);
      setCaloriesConsumed((prev) => prev - meal.item.calories);
    } else {
      // Do: Add cost/calories
      meal.status = "eaten";
      setMoneySpent((prev) => prev + meal.item.price);
      setCaloriesConsumed((prev) => prev + meal.item.calories);
    }

    // 3. The "Rolling Reveal" Check
    // If Breakfast, Lunch, AND Dinner are all eaten...
    if (
      day.meals.breakfast.status === "eaten" &&
      day.meals.lunch.status === "eaten" &&
      day.meals.dinner.status === "eaten"
    ) {
      // Unlock the target day (Current Day Index + 3)
      const targetUnlockIndex = dayIndex + 3;
      if (newPlan.days[targetUnlockIndex]) {
        newPlan.days[targetUnlockIndex].isRevealed = true;
      }
    }

    // 4. Save
    setPlan(newPlan);
  };

  // ... inside PlanProvider

  const shuffleMeal = (
    dayIndex: number,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    if (!plan) return;

    // 1. Check Limits
    if (shuffleCount >= 5) {
      Alert.alert(
        "Limit Reached",
        "You have used all 5 shuffles for this month. Upgrade to Premium for unlimited shuffles!"
      );
      return;
    }

    const newPlan = { ...plan };
    const day = newPlan.days[dayIndex];
    const currentMeal = day.meals[mealType];
    const currentItem = currentMeal.item;

    // --- NEW: THE MESS INTEGRITY LOGIC ---

    // Check if we are breaking a "Mess Day"
    const isMessDay = currentItem.isMess;
    let mealsToSwap: ("lunch" | "dinner")[] = [];

    if (isMessDay && (mealType === "lunch" || mealType === "dinner")) {
      // If leaving Mess, we must swap BOTH Lunch and Dinner
      mealsToSwap = ["lunch", "dinner"];

      // Optional: Alert the user (You can remove this if you want it to be silent)
      Alert.alert(
        "Leaving Mess Plan",
        "Since Mess is a daily deal, we are shuffling both Lunch and Dinner for you.",
        [{ text: "OK" }]
      );
    } else {
      // Normal Shuffle (Just this meal)
      mealsToSwap = [mealType as "lunch" | "dinner"]; // Cast for simplicity, breakfast logic is separate usually
    }

    // 2. Perform the Swap(s)
    let swapSuccess = false;

    mealsToSwap.forEach((type) => {
      // Don't swap if it's breakfast (unless your mess has breakfast, usually it's lunch/dinner)
      if (type === "breakfast") return;

      const oldItem = day.meals[type].item;

      // Filter candidates
      // If we are breaking a Mess Day, we ONLY want Non-Mess options
      // If we are doing a normal shuffle, we accept anything except the current item
      const candidates = MenuData.filter(
        (item) =>
          item.category.includes(
            (type.charAt(0).toUpperCase() + type.slice(1)) as any
          ) &&
          item.id !== oldItem.id &&
          (isMessDay ? !item.isMess : true) // If leaving mess, ban mess items from candidates
      );

      if (candidates.length > 0) {
        const newItem =
          candidates[Math.floor(Math.random() * candidates.length)];

        // Update Data
        day.meals[type].item = newItem;
        day.meals[type].status = "swapped";

        // Update Budget/Calories
        day.totalCost = day.totalCost - oldItem.price + newItem.price;
        day.totalCalories =
          day.totalCalories - oldItem.calories + newItem.calories;

        swapSuccess = true;
      }
    });

    if (!swapSuccess) {
      Alert.alert("No Options", "Could not find an alternative meal.");
      return;
    }

    // 3. Save & Increment Counter
    setPlan(newPlan);
    setShuffleCount((prev) => prev + 1); // We still only charge 1 shuffle credit!
  };

  // --- NEW LOGIC START ---
  const generatePlan = () => {
    console.log("Running Algorithm for Budget:", budget);
    const newPlan = generateWeeklyPlan(budget); // Call the Engine
    setPlan(newPlan);

    // Reset trackers when new plan is made
    setCaloriesConsumed(0);
    setMoneySpent(0);
  };

  // Automatically generate a plan on first load if one doesn't exist
  useEffect(() => {
    if (!plan) {
      generatePlan();
    }
  }, []);
  // --- NEW LOGIC END ---

  return (
    <PlanContext.Provider
      value={{
        budget,
        setBudget,
        plan,
        generatePlan,
        caloriesConsumed,
        moneySpent,
        toggleMealStatus, // Export the new function
        shuffleMeal,
        shuffleCount,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlan must be used within a PlanProvider");
  return context;
};
