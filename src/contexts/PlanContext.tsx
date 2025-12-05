import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"; // Added useEffect
import { generateWeeklyPlan } from "../engine/Generator"; // Import the Engine!
import { WeeklyPlan } from "../types/DailyPlan";

interface PlanContextType {
  budget: number;
  setBudget: (amount: number) => void;
  plan: WeeklyPlan | null;
  generatePlan: () => void;
  caloriesConsumed: number;
  moneySpent: number;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [budget, setBudget] = useState(15000);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [moneySpent, setMoneySpent] = useState(0);

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
