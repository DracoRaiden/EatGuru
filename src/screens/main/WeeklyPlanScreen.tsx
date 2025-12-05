import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DayRevealCard from "../../components/meals/DayRevealCard";
import { usePlan } from "../../contexts/PlanContext";

export default function WeeklyPlanScreen() {
  const { plan, generatePlan } = usePlan();

  if (!plan) {
    return (
      <View style={styles.centerContainer}>
        <Text>No Plan Found</Text>
        <TouchableOpacity onPress={generatePlan} style={styles.button}>
          <Text style={styles.buttonText}>Generate Plan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your 7-Day Menu</Text>
        <TouchableOpacity onPress={generatePlan}>
          <Text style={styles.regenText}>Regenerate</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {plan.days.map((day, index) => (
          <DayRevealCard key={index} day={day} dayIndex={index} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold" },
  regenText: { color: "#3B82F6", fontWeight: "600" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    marginTop: 20,
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
