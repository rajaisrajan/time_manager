import { Category } from "./types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "sleep", name: "Sleep", color: "#1d4ed8", isDefault: true },
  { id: "work", name: "Work", color: "#dc2626", isDefault: true },
  { id: "learning", name: "Learning", color: "#7c3aed", isDefault: true },
  { id: "self-improvement", name: "Self Improvement", color: "#16a34a", isDefault: true },
  { id: "family", name: "Family", color: "#ea580c", isDefault: true },
  { id: "entertainment", name: "Entertainment", color: "#ca8a04", isDefault: true },
  { id: "daily-activities", name: "Daily Activities", color: "#475569", isDefault: true },
  { id: "wasted", name: "Wasted Time", color: "#1c1917", isDefault: true },
];

const CUSTOM_COLORS = [
  "#0891b2","#0d9488","#65a30d","#d97706","#be185d","#6366f1","#f59e0b","#10b981",
];

export function generateColor(index: number): string {
  return CUSTOM_COLORS[index % CUSTOM_COLORS.length];
}

export function getCategoryById(categories: Category[], id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryColor(categories: Category[], id: string): string {
  const cat = getCategoryById(categories, id);
  return cat?.color ?? "#334155";
}
