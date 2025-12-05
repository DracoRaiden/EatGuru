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

export default function PremiumUnlockScreen() {
  const { unlockPremium } = usePlan();
  const router = useRouter();
  const [trxId, setTrxId] = useState("");

  const handleVerify = () => {
    // MVP LOGIC: If they typed anything, let them in.
    // LATER: You will send this ID to your Admin Panel for manual check.
    if (trxId.length < 5) {
      Alert.alert("Invalid ID", "Please enter a valid Transaction ID.");
      return;
    }

    unlockPremium();
    router.back(); // Close modal
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="diamond" size={50} color="#8B5CF6" />
          <Text style={styles.title}>Become a Transformer</Text>
          <Text style={styles.subtitle}>Stop surviving. Start building.</Text>
        </View>

        {/* Benefits Card */}
        <View style={styles.card}>
          <BenefitRow icon="shuffle" text="Unlimited Meal Shuffles" />
          <BenefitRow icon="nutrition" text="Macro Tracking (Protein/Carbs)" />
          <BenefitRow icon="restaurant" text="Access to Non-GIKI Restaurants" />
          <BenefitRow icon="cloud-upload" text="Priority Support" />
        </View>

        {/* Price Tag */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Monthly Subscription</Text>
          <Text style={styles.price}>PKR 500</Text>
        </View>

        {/* Payment Instructions (MVP) */}
        <View style={styles.paymentBox}>
          <Text style={styles.stepTitle}>Step 1: Send Money</Text>
          <Text style={styles.instruction}>
            EasyPaisa: <Text style={styles.bold}>0300-1234567</Text>
          </Text>
          <Text style={styles.instruction}>
            Title: <Text style={styles.bold}>EatGuru Official</Text>
          </Text>

          <View style={styles.divider} />

          <Text style={styles.stepTitle}>Step 2: Enter TRX ID</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 82736182..."
            value={trxId}
            onChangeText={setTrxId}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.upgradeBtn} onPress={handleVerify}>
          <Text style={styles.btnText}>Verify & Unlock</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>No thanks, I'll stick to basics</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Component
const BenefitRow = ({ icon, text }: { icon: any; text: string }) => (
  <View style={styles.row}>
    <View style={styles.iconBg}>
      <Ionicons name={icon} size={20} color="#8B5CF6" />
    </View>
    <Text style={styles.rowText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F3FF" }, // Light Purple Bg
  scroll: { padding: 25 },
  header: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  title: { fontSize: 28, fontWeight: "bold", color: "#111827", marginTop: 10 },
  subtitle: { fontSize: 16, color: "#6B7280" },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 5,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  rowText: { fontSize: 16, color: "#374151", fontWeight: "500" },

  priceContainer: { alignItems: "center", marginBottom: 30 },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  price: { fontSize: 36, fontWeight: "bold", color: "#8B5CF6" },

  paymentBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B5CF6",
    marginBottom: 5,
  },
  instruction: { fontSize: 16, color: "#374151", marginBottom: 2 },
  bold: { fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 15 },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
  },

  upgradeBtn: {
    backgroundColor: "#8B5CF6",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  btnText: { color: "white", fontSize: 18, fontWeight: "bold" },

  closeBtn: { marginTop: 20, alignItems: "center" },
  closeText: { color: "#9CA3AF", fontWeight: "600" },
});
