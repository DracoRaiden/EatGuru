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
import { useRouter } from "expo-router";

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
  isPremium: boolean;
  unlockPremium: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [budget, setBudget] = useState(15000);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [moneySpent, setMoneySpent] = useState(0);
  // Add this line with your other useState hooks
  const [shuffleCount, setShuffleCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  const unlockPremium = () => {
    setIsPremium(true);
    Alert.alert(
      "Welcome, Transformer!",
      "You now have unlimited shuffles and macro tracking."
    );
  };

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

  // Inside src/contexts/PlanContext.tsx

  const shuffleMeal = (
    dayIndex: number,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    if (!plan) return;

    if (shuffleCount >= 5) {
      Alert.alert(
        "Limit Reached",
        "Upgrade to Premium for unlimited shuffles!"
      );
      return;
    }

    const newPlan = { ...plan };
    const day = newPlan.days[dayIndex];
    const currentItem = day.meals[mealType].item;

    // 1. Get Candidates (All valid items for this meal time, excluding current)
    const candidates = MenuData.filter(
      (item) =>
        item.category.includes(
          (mealType.charAt(0).toUpperCase() + mealType.slice(1)) as any
        ) && item.id !== currentItem.id
    );

    if (candidates.length === 0) {
      Alert.alert("No Options", "No alternatives found.");
      return;
    }

    // 2. Pick a Random Candidate First
    const newItem = candidates[Math.floor(Math.random() * candidates.length)];

    // 3. Analyze the Switch
    const isEnteringMess = !currentItem.isMess && newItem.isMess; // Was Cafe -> Now Mess
    const isLeavingMess = currentItem.isMess && !newItem.isMess; // Was Mess -> Now Cafe

    // 4. Determine Scope (Do we update just this meal, or both Lunch & Dinner?)
    let mealsToUpdate: ("lunch" | "dinner")[] = [
      mealType as "lunch" | "dinner",
    ];

    // If it involves Mess (Entering OR Leaving) and it's not Breakfast, update BOTH
    if ((isEnteringMess || isLeavingMess) && mealType !== "breakfast") {
      mealsToUpdate = ["lunch", "dinner"];

      const action = isEnteringMess ? "joining" : "leaving";
      Alert.alert(
        "Mess Plan Update",
        `You are ${action} the Mess plan. Both Lunch and Dinner will be updated.`,
        [{ text: "OK" }]
      );
    }

    // 5. Execute Updates
    mealsToUpdate.forEach((type) => {
      const oldItem = day.meals[type].item;
      let selectedItem = newItem; // Default to the one we picked

      // CORRECTION: If we are updating the *other* meal (e.g. we picked Lunch, now updating Dinner)
      // We need to find a matching item for that type.
      if (type !== mealType) {
        // Find a compatible item for the OTHER slot
        const otherCandidates = MenuData.filter(
          (i) =>
            i.category.includes(
              (type.charAt(0).toUpperCase() + type.slice(1)) as any
            ) && i.isMess === newItem.isMess // MUST match the new status (Mess or Not)
        );
        selectedItem =
          otherCandidates[Math.floor(Math.random() * otherCandidates.length)];
      }

      // Apply Changes
      day.meals[type].item = selectedItem;
      day.meals[type].status = "swapped";
      day.totalCost = day.totalCost - oldItem.price + selectedItem.price;
      day.totalCalories =
        day.totalCalories - oldItem.calories + selectedItem.calories;
    });

    setPlan(newPlan);
    setShuffleCount((prev) => prev + 1);
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
        isPremium,
        unlockPremium,
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
