// src/constants/MenuData.ts
import { FoodItem } from "../types/FoodItem";

export const MenuData: FoodItem[] = [
  // --- MESS (Fixed) ---
  {
    id: "m1",
    name: "Mess Daal",
    location: "Mess",
    price: 0,
    calories: 350,
    protein: 12,
    category: ["Lunch", "Dinner"],
    isMess: true,
  },
  {
    id: "m2",
    name: "Mess Biryani",
    location: "Mess",
    price: 0,
    calories: 700,
    protein: 25,
    category: ["Lunch", "Dinner"],
    isMess: true,
  },

  // --- RAJU (Desi/Fast Food) ---
  {
    id: "r1",
    name: "Raju Paratha",
    location: "Raju",
    price: 80,
    calories: 450,
    protein: 6,
    category: ["Breakfast"],
    isMess: false,
  },
  {
    id: "r2",
    name: "Raju Chicken Karahi",
    location: "Raju",
    price: 400,
    calories: 800,
    protein: 40,
    category: ["Lunch", "Dinner"],
    isMess: false,
  },

  // --- AYAAN (Economical) ---
  {
    id: "a1",
    name: "Ayaan Omelet",
    location: "Ayaan",
    price: 70,
    calories: 200,
    protein: 14,
    category: ["Breakfast"],
    isMess: false,
  },
  {
    id: "a2",
    name: "Ayaan Chana",
    location: "Ayaan",
    price: 120,
    calories: 300,
    protein: 10,
    category: ["Breakfast", "Lunch"],
    isMess: false,
  },

  // --- HOT AND SPICY (Fast Food) ---
  {
    id: "h1",
    name: "Zinger Burger",
    location: "Hot and Spicy",
    price: 350,
    calories: 650,
    protein: 25,
    category: ["Lunch", "Dinner"],
    isMess: false,
  },
  {
    id: "h2",
    name: "Chicken Roll",
    location: "Hot and Spicy",
    price: 200,
    calories: 400,
    protein: 18,
    category: ["Lunch", "Snack"],
    isMess: false,
  },

  // --- ISRARBUCKS (Drinks Only) ---
  {
    id: "i1",
    name: "Mint Margarita",
    location: "Israrbucks",
    price: 150,
    calories: 120,
    protein: 0,
    category: ["Drink", "Snack"],
    isMess: false,
  },
  {
    id: "i2",
    name: "Cold Coffee",
    location: "Israrbucks",
    price: 200,
    calories: 250,
    protein: 4,
    category: ["Drink", "Snack"],
    isMess: false,
  },

  // --- SIP SPOT (Drinks Only) ---
  {
    id: "s1",
    name: "Lemonade",
    location: "Sip Spot",
    price: 100,
    calories: 80,
    protein: 0,
    category: ["Drink", "Snack"],
    isMess: false,
  },
  {
    id: "s2",
    name: "Tea",
    location: "Sip Spot",
    price: 50,
    calories: 60,
    protein: 2,
    category: ["Breakfast", "Snack"],
    isMess: false,
  },

  // --- CAFE (Premium) ---
  {
    id: "c1",
    name: "Grilled Sandwich",
    location: "Cafe",
    price: 280,
    calories: 400,
    protein: 20,
    category: ["Lunch", "Snack"],
    isMess: false,
  },
];
