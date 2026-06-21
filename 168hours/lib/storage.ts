import { HourEntry, Category } from "./types";
import { DEFAULT_CATEGORIES, generateColor } from "./categories";

export function getWeekId(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export function getWeekStart(weekId: string): Date {
  const [yearStr, weekStr] = weekId.split("-W");
  const year = parseInt(yearStr);
  const week = parseInt(weekStr);
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - jan4Day + 1 + (week - 1) * 7);
  return weekStart;
}

export function offsetWeekId(weekId: string, offset: number): string {
  const start = getWeekStart(weekId);
  start.setDate(start.getDate() + offset * 7);
  return getWeekId(start);
}

export function getWeekEntries(weekId: string): HourEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`168hours_week_${weekId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWeekEntries(weekId: string, entries: HourEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`168hours_week_${weekId}`, JSON.stringify(entries));
}

export function setEntry(weekId: string, day: number, hour: number, data: Partial<HourEntry>): HourEntry[] {
  const entries = getWeekEntries(weekId);
  const idx = entries.findIndex((e) => e.day === day && e.hour === hour);
  if (idx >= 0) {
    entries[idx] = { ...entries[idx], ...data };
  } else {
    entries.push({ weekId, day, hour, category: "", title: "", ...data });
  }
  saveWeekEntries(weekId, entries);
  return entries;
}

export function setEntries(weekId: string, slots: { day: number; hour: number }[], data: Partial<HourEntry>): HourEntry[] {
  let entries = getWeekEntries(weekId);
  for (const slot of slots) {
    const idx = entries.findIndex((e) => e.day === slot.day && e.hour === slot.hour);
    if (idx >= 0) {
      entries[idx] = { ...entries[idx], ...data };
    } else {
      entries.push({ weekId, day: slot.day, hour: slot.hour, category: "", title: "", ...data });
    }
  }
  saveWeekEntries(weekId, entries);
  return entries;
}

export function clearEntry(weekId: string, day: number, hour: number): HourEntry[] {
  const entries = getWeekEntries(weekId).filter((e) => !(e.day === day && e.hour === hour));
  saveWeekEntries(weekId, entries);
  return entries;
}

export function getEntryAt(entries: HourEntry[], day: number, hour: number): HourEntry | undefined {
  return entries.find((e) => e.day === day && e.hour === hour);
}

export function getCategories(): Category[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem("168hours_categories");
    const custom: Category[] = raw ? JSON.parse(raw) : [];
    return [...DEFAULT_CATEGORIES, ...custom];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCustomCategory(name: string): Category {
  if (typeof window === "undefined") throw new Error("No window");
  const raw = localStorage.getItem("168hours_custom_categories");
  const customs: Category[] = raw ? JSON.parse(raw) : [];
  const newCat: Category = {
    id: `custom_${Date.now()}`,
    name,
    color: generateColor(customs.length),
    isDefault: false,
  };
  customs.push(newCat);
  localStorage.setItem("168hours_custom_categories", JSON.stringify(customs));
  return newCat;
}

export function duplicatePreviousWeek(weekId: string): HourEntry[] {
  const prev = offsetWeekId(weekId, -1);
  const prevEntries = getWeekEntries(prev);
  const newEntries = prevEntries.map((e) => ({ ...e, weekId }));
  saveWeekEntries(weekId, newEntries);
  return newEntries;
}

export function exportToCSV(weekId: string): string {
  const entries = getWeekEntries(weekId);
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const header = "Day,Hour,Category,Title,Notes";
  const rows = entries.map((e) =>
    `${days[e.day]},${String(e.hour).padStart(2,"0")}:00,${e.category},${e.title || ""},${e.notes || ""}`
  );
  return [header, ...rows].join("\n");
}

export function exportToJSON(weekId: string): string {
  return JSON.stringify(getWeekEntries(weekId), null, 2);
}
