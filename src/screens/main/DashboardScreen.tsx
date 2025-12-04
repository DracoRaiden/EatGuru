import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlan } from "../../contexts/PlanContext";

export default function DashboardScreen() {
  const { budget, moneySpent, caloriesConsumed } = usePlan();

  // Calculations for the UI
  const budgetLeft = budget - moneySpent;
  const budgetProgress = (budgetLeft / budget) * 100;
  const calorieTarget = 2400; // Average Male Student
  const calorieProgress = (caloriesConsumed / calorieTarget) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, GIKian!</Text>
          <Text style={styles.subGreeting}>Let's save some money today.</Text>
        </View>

        {/* 1. The "Dual-Fuel" Gauge (Money vs Food) */}
        <View style={styles.statsContainer}>
          {/* Budget Card */}
          <View style={[styles.statCard, { backgroundColor: "#E8F5E9" }]}>
            <Text style={styles.statLabel}>Budget Left</Text>
            <Text style={[styles.statValue, { color: "#2E7D32" }]}>
              PKR {budgetLeft}
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${budgetProgress}%`, backgroundColor: "#4CAF50" },
                ]}
              />
            </View>
            <Text style={styles.statSub}>of PKR {budget}</Text>
          </View>

          {/* Calorie Card */}
          <View style={[styles.statCard, { backgroundColor: "#FFEBEE" }]}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={[styles.statValue, { color: "#C62828" }]}>
              {caloriesConsumed}
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${calorieProgress}%`, backgroundColor: "#EF5350" },
                ]}
              />
            </View>
            <Text style={styles.statSub}>of {calorieTarget} kcal</Text>
          </View>
        </View>

        {/* 2. Today's "Next Meal" Teaser */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Up Next</Text>
          <View style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTime}>LUNCH • 1:00 PM</Text>
              <Text style={styles.mealLocation}>📍 Mess</Text>
            </View>
            <Text style={styles.mealName}>Chicken Biryani (Mess)</Text>
            <Text style={styles.mealPrice}>Cost: Free (Pre-paid)</Text>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Mark as Eaten</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Quick Actions */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.smallButton}>
            <Text>🎲 Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton}>
            <Text>➕ Add Snack</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  subGreeting: { fontSize: 16, color: "#6B7280" },

  statsContainer: { flexDirection: "row", gap: 15, marginBottom: 25 },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
    justifyContent: "space-between",
  },
  statLabel: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  statValue: { fontSize: 22, fontWeight: "bold", marginVertical: 8 },
  statSub: { fontSize: 12, color: "#9CA3AF", marginTop: 5 },

  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
  },
  progressBarFill: { height: 6, borderRadius: 3 },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#374151",
  },

  mealCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mealTime: { fontSize: 12, fontWeight: "bold", color: "#9CA3AF" },
  mealLocation: { fontSize: 12, fontWeight: "bold", color: "#3B82F6" },
  mealName: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  mealPrice: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "500",
    marginBottom: 15,
  },

  actionButton: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: { color: "white", fontWeight: "bold" },

  row: { flexDirection: "row", gap: 10 },
  smallButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
