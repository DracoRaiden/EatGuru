import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlan } from "../../contexts/PlanContext";

export default function AddCustomFoodScreen() {
  const router = useRouter();
  const { addCustomTransaction } = usePlan();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [calories, setCalories] = useState("");

  const handleAdd = () => {
    if (!name || !price || !calories) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }

    const priceNum = parseFloat(price);
    const calNum = parseFloat(calories);

    // Logic Call
    addCustomTransaction(name, priceNum, calNum);

    // Success & Close
    Alert.alert("Logged", `${name} has been added to your daily stats.`);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Add Snack / Cheat Meal</Text>
          <View style={{ width: 28 }} />
        </View>

        <Text style={styles.label}>What did you eat?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Lays Masala, Savour Pulao"
          value={name}
          onChangeText={setName}
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Price (PKR)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Calories (kcal)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />
          </View>
        </View>

        {/* Quick Suggestions (Hardcoded for MVP Speed) */}
        <Text style={styles.subHeader}>Quick Add</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Lays (50)"
            onPress={() => {
              setName("Lays");
              setPrice("50");
              setCalories("200");
            }}
          />
          <Chip
            label="Coke (100)"
            onPress={() => {
              setName("Coke");
              setPrice("100");
              setCalories("140");
            }}
          />
          <Chip
            label="KitKat (150)"
            onPress={() => {
              setName("KitKat");
              setPrice("150");
              setCalories("250");
            }}
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleAdd}>
          <Text style={styles.btnText}>Add to Log</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Helper Chip Component
const Chip = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.chip} onPress={onPress}>
    <Text style={styles.chipText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: { fontSize: 20, fontWeight: "bold" },

  label: { fontSize: 14, fontWeight: "600", color: "#6B7280", marginBottom: 8 },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
    fontSize: 16,
  },

  row: { flexDirection: "row", gap: 15 },
  half: { flex: 1 },

  subHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 30,
  },
  chip: {
    backgroundColor: "#E0E7FF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  chipText: { color: "#4F46E5", fontWeight: "600" },

  btn: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 18 },
});
