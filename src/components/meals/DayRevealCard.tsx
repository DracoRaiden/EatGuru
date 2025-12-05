import Ionicons from "@expo/vector-icons/Ionicons"; // <--- ADD THIS LINE
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlan } from "../../contexts/PlanContext"; // Import Hook
import { DayPlan } from "../../types/DailyPlan";
import { IconSymbol } from "../common/icon-symbol";

interface Props {
  day: DayPlan;
  dayIndex: number;
}
export default function DayRevealCard({ day, dayIndex }: Props) {
  const { toggleMealStatus, shuffleMeal, shuffleCount, isPremium } = usePlan(); // Get isPremium
  const router = useRouter();
  const isLocked = !day.isRevealed;

  // Helper Component for a Single Meal Row
  const MealRow = ({
    type,
    data,
  }: {
    type: "breakfast" | "lunch" | "dinner";
    data: any;
  }) => {
    const isEaten = data.status === "eaten";

    // Handler for Shuffle
    const handleShuffle = () => {
      console.log("Shuffle Clicked. Count:", shuffleCount);

      if (isEaten) {
        if (Platform.OS === "web") {
          alert(
            "Action Blocked: You cannot shuffle a meal you have already eaten!"
          );
        } else {
          Alert.alert(
            "Action Blocked",
            "You cannot shuffle a meal you have already eaten!"
          );
        }
        return;
      }

      // --- THE PREMIUM TRIGGER (Web Fixed) ---
      if (!isPremium && shuffleCount >= 5) {
        if (Platform.OS === "web") {
          // 1. Browser-Specific Popup
          const wantsToUpgrade = window.confirm(
            "Limit Reached: You have used all your free shuffles. Do you want to Upgrade?"
          );
          if (wantsToUpgrade) {
            router.push("/premium");
          }
        } else {
          // 2. Mobile-Specific Popup
          Alert.alert(
            "Limit Reached",
            "You have used all your free shuffles.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Upgrade", onPress: () => router.push("/premium") },
            ]
          );
        }
        return;
      }
      // ---------------------------------------

      shuffleMeal(dayIndex, type);
    };

    return (
      <View style={styles.mealRow}>
        {/* LEFT: Checkbox (Click to Eat) */}
        <TouchableOpacity
          style={[styles.checkbox, isEaten && styles.checkboxChecked]}
          onPress={() => toggleMealStatus(dayIndex, type)}
        >
          {isEaten && <IconSymbol name="checkmark" size={12} color="white" />}
        </TouchableOpacity>

        {/* MIDDLE: Text Details */}
        <View style={{ flex: 1 }}>
          <Text style={styles.mealLabel}>{type.toUpperCase()}</Text>
          <Text style={[styles.mealItem, isEaten && styles.strikethrough]}>
            {data.item.name}
          </Text>
        </View>

        {/* RIGHT: Actions (Price + Shuffle) */}
        <View style={styles.rightActions}>
          <Text style={styles.priceTag}>
            {data.item.price === 0 ? "Free" : `PKR ${data.item.price}`}
          </Text>

          {/* Shuffle Button (Only show if not eaten) */}
          {!isEaten && (
            <TouchableOpacity onPress={handleShuffle} style={styles.shuffleBtn}>
              {/* OLD LINE: <IconSymbol name="arrow.triangle.2.circlepath" size={18} color="#3B82F6" /> */}

              {/* NEW LINE: Use a standard shuffle icon */}
              <Ionicons name="shuffle" size={20} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLocked) {
    // ... (Keep your existing Locked Card Code)
    return (
      <View style={[styles.card, styles.lockedCard]}>
        <Text style={styles.lockedText}>Locked</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.dateText}>Day {dayIndex + 1}</Text>
        <Text style={styles.costText}>Total: PKR {day.totalCost}</Text>
      </View>

      <MealRow type="breakfast" data={day.meals.breakfast} />
      <MealRow type="lunch" data={day.meals.lunch} />
      <MealRow type="dinner" data={day.meals.dinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  lockedCard: { backgroundColor: "#F3F4F6", alignItems: "center", padding: 30 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 10,
  },
  dateText: { fontSize: 16, fontWeight: "bold" },
  costText: { fontSize: 14, color: "#10B981", fontWeight: "bold" },

  mealRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#10B981", borderColor: "#10B981" },

  mealLabel: { fontSize: 10, color: "#9CA3AF", fontWeight: "bold" },
  mealItem: { fontSize: 14, fontWeight: "500", color: "#1F2937" },
  strikethrough: { textDecorationLine: "line-through", color: "#9CA3AF" },

  priceTag: { marginLeft: "auto", fontSize: 12, color: "#6B7280" },
  lockedText: { color: "#9CA3AF" },
  rightActions: { alignItems: "flex-end" },
  shuffleBtn: { marginTop: 4, padding: 4 }, // Give it touch area
  // Ensure 'mealRow' has 'alignItems: center' removed or adjusted if layout breaks,
  // but keeping 'flexDirection: row' is key.
});
