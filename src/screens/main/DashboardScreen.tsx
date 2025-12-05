import Ionicons from "@expo/vector-icons/Ionicons"; // Icons
import { useRouter } from "expo-router"; // Needed for navigation
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
  const router = useRouter();
  // Inside DashboardScreen component
  const { budget, moneySpent, caloriesConsumed, shuffleCount, isPremium } =
    usePlan(); // <--- Add shuffleCount, isPremium
  // 1. Calculate Stats
  const budgetLeft = budget - moneySpent;
  const budgetProgress = Math.max(0, (budgetLeft / budget) * 100);
  const calorieTarget = 2400; // Average GIKI student
  const calorieProgress = Math.min(
    100,
    (caloriesConsumed / calorieTarget) * 100
  );
  // Logic: How many shuffles are left?
  const maxShuffles = 5;
  const shufflesLeft = Math.max(0, maxShuffles - shuffleCount);
  const shuffleLabel = isPremium ? "Unlimited" : `${shufflesLeft} left`;
  const shuffleColor = isPremium
    ? "#8B5CF6"
    : shufflesLeft === 0
    ? "#EF4444"
    : "#6B7280"; // Purple (Prem), Red (0), Grey (Normal)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, GIKian! 👋</Text>
          <Text style={styles.subGreeting}>Let's save some money today.</Text>
        </View>

        {/* 2. The "Dual-Fuel" Gauge (Money vs Food) */}
        <View style={styles.statsContainer}>
          {/* Budget Card (Green) */}
          <View style={[styles.statCard, { backgroundColor: "#E8F5E9" }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.statLabel}>Budget Left</Text>
              <Ionicons name="wallet-outline" size={18} color="#2E7D32" />
            </View>
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

          {/* Calorie Card (Red) */}
          <View style={[styles.statCard, { backgroundColor: "#FFEBEE" }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.statLabel}>Calories</Text>
              <Ionicons name="flame-outline" size={18} color="#C62828" />
            </View>
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

        {/* 3. Up Next Section (Dynamic) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Up Next</Text>
          <View style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTime}>RECOMMENDED</Text>
              <Text style={styles.mealLocation}>📍 Check Plan Tab</Text>
            </View>
            <Text style={styles.mealName}>
              Go to "Weekly Plan" to track meals.
            </Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/explore")} // Navigates to the 2nd tab
            >
              <Text style={styles.actionText}>View Full Menu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Quick Actions (Buttons) */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.row}>
          {/* Shuffle Shortcut with Counter */}
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => router.push("/explore")}
          >
            <Ionicons name="shuffle" size={24} color="#3B82F6" />
            <Text style={styles.btnLabel}>Shuffle</Text>

            {/* NEW: Counter Badge */}
            <Text
              style={{
                fontSize: 10,
                color: shuffleColor,
                fontWeight: "600",
                marginTop: 2,
              }}
            >
              {shuffleLabel}
            </Text>
          </TouchableOpacity>

          {/* ADD SNACK BUTTON (This is what you were missing!) */}
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => router.push("/add-food")}
          >
            <Ionicons name="add-circle" size={24} color="#10B981" />
            <Text style={styles.btnLabel}>Add Snack</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { padding: 20 },
  header: { marginBottom: 25 },
  greeting: { fontSize: 26, fontWeight: "bold", color: "#111827" },
  subGreeting: { fontSize: 16, color: "#6B7280", marginTop: 5 },

  statsContainer: { flexDirection: "row", gap: 15, marginBottom: 25 },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 20,
    justifyContent: "space-between",
    minHeight: 140,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  statLabel: { fontSize: 13, color: "#4B5563", fontWeight: "600" },
  statValue: { fontSize: 24, fontWeight: "bold", marginVertical: 8 },
  statSub: { fontSize: 11, color: "#6B7280", marginTop: 5 },

  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
  },
  progressBarFill: { height: 6, borderRadius: 3 },

  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
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
  mealName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 15,
    color: "#4B5563",
  },

  actionButton: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: { color: "white", fontWeight: "bold" },

  row: { flexDirection: "row", gap: 15 },
  smallButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    elevation: 1,
  },
  btnLabel: { marginTop: 8, fontWeight: "600", color: "#374151" },
});
