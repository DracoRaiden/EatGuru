import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DayPlan } from "../../types/DailyPlan";
import { IconSymbol } from "../common/icon-symbol"; // Using your existing icon component

interface Props {
  day: DayPlan;
  dayIndex: number; // 0 = Monday, 1 = Tuesday...
}

export default function DayRevealCard({ day, dayIndex }: Props) {
  // Logic: Only show details if the day is "Revealed"
  const isLocked = !day.isRevealed;

  // Helper to format date (e.g., "Mon, 24 Oct")
  const dateObj = new Date(day.date);
  const dateLabel = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  if (isLocked) {
    return (
      <View style={[styles.card, styles.lockedCard]}>
        <View style={styles.header}>
          <Text style={styles.dateText}>{dateLabel}</Text>
          <IconSymbol name="lock.fill" size={20} color="#9CA3AF" />
        </View>
        <Text style={styles.lockedText}>Menu Hidden</Text>
        <Text style={styles.lockedSubText}>
          Complete previous days to reveal.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <Text style={styles.costText}>PKR {day.totalCost}</Text>
      </View>

      {/* Meals List */}
      <View style={styles.mealRow}>
        <Text style={styles.mealLabel}>🍳 Breakfast</Text>
        <Text style={styles.mealItem}>{day.meals.breakfast.item.name}</Text>
      </View>
      <View style={styles.mealRow}>
        <Text style={styles.mealLabel}>🍱 Lunch</Text>
        <Text style={styles.mealItem}>{day.meals.lunch.item.name}</Text>
        <Text style={styles.locationTag}>{day.meals.lunch.item.location}</Text>
      </View>
      <View style={styles.mealRow}>
        <Text style={styles.mealLabel}>🍽️ Dinner</Text>
        <Text style={styles.mealItem}>{day.meals.dinner.item.name}</Text>
        <Text style={styles.locationTag}>{day.meals.dinner.item.location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  lockedCard: {
    backgroundColor: "#F3F4F6",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateText: { fontSize: 16, fontWeight: "bold", color: "#374151" },
  costText: { fontSize: 14, fontWeight: "bold", color: "#10B981" },
  lockedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 5,
  },
  lockedSubText: { fontSize: 12, color: "#9CA3AF" },

  mealRow: { marginBottom: 8 },
  mealLabel: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  mealItem: { fontSize: 15, fontWeight: "500", color: "#1F2937" },
  locationTag: { fontSize: 10, color: "#3B82F6", marginTop: 1 },
});
