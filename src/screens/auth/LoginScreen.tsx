import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) return alert("Please fill in all fields");
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (e) {
      // Error handled in Context
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo Area */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="fast-food" size={40} color="white" />
          </View>
          <Text style={styles.title}>EatGuru</Text>
          <Text style={styles.subtitle}>
            {isLogin ? "Welcome back, Transformer!" : "Join the Survivor Squad"}
          </Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="student@giki.edu.pk"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>
                {isLogin ? "Log In" : "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Google Button (Visual Only for MVP) */}
        <TouchableOpacity style={styles.googleBtn}>
          <Ionicons name="logo-google" size={20} color="#374151" />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Toggle */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.link}>{isLogin ? " Sign Up" : " Log In"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" }, // Dark Theme Background
  content: { flex: 1, justifyContent: "center", padding: 25 },
  header: { alignItems: "center", marginBottom: 40 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "white" },
  subtitle: { color: "#9CA3AF", marginTop: 5 },

  form: {
    backgroundColor: "#1F2937",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  label: {
    color: "#D1D5DB",
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#374151",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },

  btn: {
    backgroundColor: "#8B5CF6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },

  googleBtn: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleText: { color: "#374151", fontWeight: "bold" },

  footer: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  footerText: { color: "#9CA3AF" },
  link: { color: "#8B5CF6", fontWeight: "bold" },
});
