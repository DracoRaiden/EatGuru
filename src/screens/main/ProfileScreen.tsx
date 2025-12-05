import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlan } from "../../contexts/PlanContext";

export default function ProfileScreen() {
  const { budget, setBudget, generatePlan, isPremium, unlockPremium } =
    usePlan();
  const router = useRouter();

  const [newBudget, setNewBudget] = useState(budget.toString());
  const [weight, setWeight] = useState("70"); // Default demo value
  const [height, setHeight] = useState("175"); // Default demo value

  // BMI Calculation
  const w = parseFloat(weight);
  const h = parseFloat(height) / 100; // convert cm to m
  const bmi = (w / (h * h)).toFixed(1);

  const handleSaveBudget = () => {
    const val = parseInt(newBudget);
    if (isNaN(val) || val < 5000) {
      Alert.alert("Error", "Minimum budget is 5000 PKR.");
      return;
    }
    setBudget(val);
    generatePlan(); // Regenerate the menu based on new money!
    Alert.alert("Success", "Budget updated and Plan regenerated!");
  };

  const handleReset = () => {
    Alert.alert(
      "Reset App",
      "This will clear your plan and progress. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => generatePlan() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Profile */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>G</Text>
          </View>
          <Text style={styles.name}>GIKI Student</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: isPremium ? "#8B5CF6" : "#9CA3AF" },
            ]}
          >
            <Text style={styles.badgeText}>
              {isPremium ? "TRANSFORMER" : "SURVIVOR"}
            </Text>
          </View>
        </View>

        {/* 1. Health Stats */}
        <Text style={styles.sectionTitle}>My Physics</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: 15 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.bmiBox}>
            <Text style={styles.bmiLabel}>Your BMI</Text>
            <Text style={styles.bmiValue}>{bmi}</Text>
            <Text style={styles.bmiText}>Normal Weight</Text>
          </View>
        </View>

        {/* 2. Financial Settings */}
        <Text style={styles.sectionTitle}>Financials</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Monthly Food Budget (PKR)</Text>
          <View style={styles.rowInput}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={newBudget}
              onChangeText={setNewBudget}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBudget}>
              <Text style={styles.saveText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Danger Zone / Actions */}
        <Text style={styles.sectionTitle}>Actions</Text>

        {!isPremium && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push("/premium")}
          >
            <Ionicons name="diamond" size={20} color="#8B5CF6" />
            <Text style={[styles.actionText, { color: "#8B5CF6" }]}>
              Upgrade to Premium
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionBtn} onPress={handleReset}>
          <Ionicons name="refresh" size={20} color="#EF4444" />
          <Text style={[styles.actionText, { color: "#EF4444" }]}>
            Reset Simulation
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { padding: 20 },
  header: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { color: "white", fontSize: 32, fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  badgeText: { color: "white", fontSize: 10, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#374151",
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 1,
  },

  row: { flexDirection: "row" },
  label: { fontSize: 12, color: "#6B7280", marginBottom: 5, fontWeight: "600" },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 0,
  },

  bmiBox: {
    marginTop: 15,
    backgroundColor: "#ECFDF5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  bmiLabel: { fontSize: 12, color: "#059669", fontWeight: "bold" },
  bmiValue: { fontSize: 28, fontWeight: "bold", color: "#059669" },
  bmiText: { fontSize: 12, color: "#059669" },

  rowInput: { flexDirection: "row", gap: 10 },
  saveBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 8,
  },
  saveText: { color: "white", fontWeight: "bold" },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    gap: 15,
  },
  actionText: { fontSize: 16, fontWeight: "600" },
});
