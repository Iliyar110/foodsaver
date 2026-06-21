import { create } from "zustand";

export type FridgeItem = {
  id: string;
  name: string;
  category: string;
  icon: string;
  daysToExpiry: number;
};

export type View = "lockscreen" | "hem" | "planering" | "poang" | "installningar";

type State = {
  view: View;
  score: number;
  streak: number;
  fridge: FridgeItem[];
  shoppingList: string[];
  setView: (v: View) => void;
  consume: (id: string) => void;
  trash: (id: string) => void;
  addShopping: (items: string[]) => void;
  addItem: (item: FridgeItem) => void;
};

export const useApp = create<State>((set) => ({
  view: "lockscreen",
  score: 1250,
  streak: 5,
  fridge: [
    { id: "1", name: "Mellanmjölk", category: "Mejeri", icon: "🥛", daysToExpiry: 1 },
    { id: "2", name: "Formfranska", category: "Bröd", icon: "🍞", daysToExpiry: 1 },
    { id: "3", name: "Äpplen", category: "Frukt", icon: "🍎", daysToExpiry: 5 },
  ],
  shoppingList: [],
  setView: (view) => set({ view }),
  consume: (id) =>
    set((s) => ({
      fridge: s.fridge.filter((i) => i.id !== id),
      score: s.score + 50,
    })),
  trash: (id) =>
    set((s) => ({
      fridge: s.fridge.filter((i) => i.id !== id),
    })),
  addShopping: (items) =>
    set((s) => ({
      shoppingList: Array.from(new Set([...s.shoppingList, ...items])),
    })),
  addItem: (item) =>
    set((s) => ({
      fridge: s.fridge.some((i) => i.id === item.id)
        ? s.fridge
        : [...s.fridge, item],
    })),
}));
