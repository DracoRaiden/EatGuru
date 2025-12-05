import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { MenuData } from "../constants/MenuData";
import { generateWeeklyPlan } from "../engine/Generator";
import { WeeklyPlan } from "../types/DailyPlan";

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

  // VITAL: Ensure these are here
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

  // State for Premium Features
  const [shuffleCount, setShuffleCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  const generatePlan = () => {
    const newPlan = generateWeeklyPlan(budget);
    setPlan(newPlan);
    setCaloriesConsumed(0);
    setMoneySpent(0);
    setShuffleCount(0); // Reset shuffles on new plan
  };

  useEffect(() => {
    if (!plan) generatePlan();
  }, []);

  const toggleMealStatus = (
    dayIndex: number,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    if (!plan) return;

    if (dayIndex > 0) {
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
        return;
      }
    }

    const newPlan = { ...plan };
    const day = newPlan.days[dayIndex];
    const meal = day.meals[mealType];

    if (meal.status === "eaten") {
      meal.status = "pending";
      setMoneySpent((prev) => prev - meal.item.price);
      setCaloriesConsumed((prev) => prev - meal.item.calories);
    } else {
      meal.status = "eaten";
      setMoneySpent((prev) => prev + meal.item.price);
      setCaloriesConsumed((prev) => prev + meal.item.calories);
    }

    // Unlock next day logic
    if (
      day.meals.breakfast.status === "eaten" &&
      day.meals.lunch.status === "eaten" &&
      day.meals.dinner.status === "eaten"
    ) {
      const targetUnlockIndex = dayIndex + 3;
      if (newPlan.days[targetUnlockIndex]) {
        newPlan.days[targetUnlockIndex].isRevealed = true;
      }
    }

    setPlan(newPlan);
  };

  const shuffleMeal = (
    dayIndex: number,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    if (!plan) return;

    // NOTE: We REMOVED the "Alert" here so it doesn't conflict with the UI Alert.
    // We only silently block if the count is reached to prevent hacking.
    if (!isPremium && shuffleCount >= 5) {
      console.log("Shuffle blocked by Context: Limit Reached");
      return;
    }

    const newPlan = { ...plan };
    const day = newPlan.days[dayIndex];
    const currentItem = day.meals[mealType].item;

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

    const newItem = candidates[Math.floor(Math.random() * candidates.length)];

    // Mess Logic
    const isEnteringMess = !currentItem.isMess && newItem.isMess;
    const isLeavingMess = currentItem.isMess && !newItem.isMess;
    let mealsToUpdate: ("lunch" | "dinner")[] = [
      mealType as "lunch" | "dinner",
    ];

    if ((isEnteringMess || isLeavingMess) && mealType !== "breakfast") {
      mealsToUpdate = ["lunch", "dinner"];
      const action = isEnteringMess ? "joining" : "leaving";
      Alert.alert(
        "Mess Plan Update",
        `You are ${action} the Mess plan. Lunch & Dinner updated.`
      );
    }

    mealsToUpdate.forEach((type) => {
      const oldItem = day.meals[type].item;
      let selectedItem = newItem;

      if (type !== mealType) {
        const otherCandidates = MenuData.filter(
          (i) =>
            i.category.includes(
              (type.charAt(0).toUpperCase() + type.slice(1)) as any
            ) && i.isMess === newItem.isMess
        );
        selectedItem =
          otherCandidates[Math.floor(Math.random() * otherCandidates.length)];
      }

      day.meals[type].item = selectedItem;
      day.meals[type].status = "swapped";
      day.totalCost = day.totalCost - oldItem.price + selectedItem.price;
      day.totalCalories =
        day.totalCalories - oldItem.calories + selectedItem.calories;
    });

    setPlan(newPlan);
    setShuffleCount((prev) => prev + 1); // Increment!
  };

  const unlockPremium = () => {
    setIsPremium(true);
    Alert.alert("Welcome, Transformer!", "You now have unlimited shuffles.");
  };

  return (
    <PlanContext.Provider
      value={{
        budget,
        setBudget,
        plan,
        generatePlan,
        caloriesConsumed,
        moneySpent,
        toggleMealStatus,
        shuffleMeal,
        // VITAL: Checking if these were missing in your previous code
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
