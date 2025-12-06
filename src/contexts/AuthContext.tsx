import { FirebaseAuthTypes } from "@react-native-firebase/auth"; // Native Types
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { auth, db } from "../config/firebaseConfig"; // Your new native config
import { usePlan } from "./PlanContext";

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  userData: any | null;
  loading: boolean;
  login: (e: string, p: string) => Promise<void>;
  signup: (e: string, p: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { unlockPremium } = usePlan();

  // 1. Listen for Auth Changes (Native Style)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Native Firestore Syntax: db.collection().doc().get()
        try {
          const userDoc = await db
            .collection("users")
            .doc(currentUser.uid)
            .get();
          // OLD (Error)
          // if (userDoc.exists) {

          // NEW (Fixed)
          if ((userDoc as any).exists) {
            const data = userDoc.data();
            setUserData(data);
            if (data?.isPremium) unlockPremium();
          }
        } catch (e) {
          console.log("Error fetching user data:", e);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe; // Unsubscribe on unmount
  }, []);

  // 2. Login Function (Native Style)
  const login = async (email: string, pass: string) => {
    try {
      await auth.signInWithEmailAndPassword(email, pass);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
      throw error;
    }
  };

  // 3. Signup Function (Native Style)
  const signup = async (email: string, pass: string) => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, pass);

      // Create Database Entry using Native Syntax
      await db.collection("users").doc(res.user.uid).set({
        email: email,
        role: "user",
        isPremium: false,
        createdAt: new Date(),
      });
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
      throw error;
    }
  };

  const logout = () => {
    auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
