import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";

import { useColorScheme } from "../src/hooks/use-color-scheme";

// 1. Import Contexts
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { PlanProvider } from "../src/contexts/PlanContext";

// 2. Import Login Screen
import LoginScreen from "../src/screens/auth/LoginScreen";

export const unstable_settings = {
  anchor: "(tabs)",
};

// --- THE GATEKEEPER COMPONENT ---
// This component decides: Show Login OR Show App?
function InnerLayout() {
  const { user, loading } = useAuth();

  // While checking firebase connection, show nothing (or a spinner)
  if (loading) return null;

  // IF NO USER -> SHOW LOGIN SCREEN
  if (!user) {
    return <LoginScreen />;
  }

  // IF USER EXISTS -> SHOW THE APP
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
      {/* Add the Routes we created earlier */}
      <Stack.Screen
        name="add-food"
        options={{ presentation: "modal", title: "Add Log" }}
      />
      <Stack.Screen
        name="premium"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}

// --- THE ROOT LAYOUT ---
// This wraps everything in Providers
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PlanProvider>
        <AuthProvider>
          <InnerLayout />
        </AuthProvider>
      </PlanProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
