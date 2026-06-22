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

export function getEntryAt(entries: HourEntry[], day: number, hour: number): HourEntry | undefined {
  return entries.find((e) => e.day === day && e.hour === hour);
}

function mapRow(row: Record<string, unknown>): HourEntry {
  return {
    weekId: row.week_id as string,
    day: row.day as number,
    hour: row.hour as number,
    category: row.category as string,
    title: row.title as string,
    notes: row.notes as string | undefined,
  };
}

export async function getWeekEntries(weekId: string): Promise<HourEntry[]> {
  const res = await fetch(`/api/entries?weekId=${encodeURIComponent(weekId)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data as Record<string, unknown>[]).map(mapRow);
}

export async function saveWeekEntries(weekId: string, entries: HourEntry[]): Promise<void> {
  await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weekId, entries }),
  });
}

export async function setEntry(weekId: string, day: number, hour: number, data: Partial<HourEntry>, currentEntries: HourEntry[]): Promise<HourEntry[]> {
  const idx = currentEntries.findIndex((e) => e.day === day && e.hour === hour);
  let updated: HourEntry[];
  if (idx >= 0) {
    updated = currentEntries.map((e, i) => i === idx ? { ...e, ...data } : e);
  } else {
    updated = [...currentEntries, { weekId, day, hour, category: "", title: "", ...data }];
  }
  await saveWeekEntries(weekId, updated);
  return updated;
}

export async function setEntries(weekId: string, slots: { day: number; hour: number }[], data: Partial<HourEntry>, currentEntries: HourEntry[]): Promise<HourEntry[]> {
  let updated = [...currentEntries];
  for (const slot of slots) {
    const idx = updated.findIndex((e) => e.day === slot.day && e.hour === slot.hour);
    if (idx >= 0) {
      updated[idx] = { ...updated[idx], ...data };
    } else {
      updated.push({ weekId, day: slot.day, hour: slot.hour, category: "", title: "", ...data });
    }
  }
  await saveWeekEntries(weekId, updated);
  return updated;
}

export async function clearEntry(weekId: string, day: number, hour: number, currentEntries: HourEntry[]): Promise<HourEntry[]> {
  const updated = currentEntries.filter((e) => !(e.day === day && e.hour === hour));
  await saveWeekEntries(weekId, updated);
  return updated;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch("/api/categories");
    if (!res.ok) return DEFAULT_CATEGORIES;
    const custom = await res.json() as Array<{ id: string; name: string; color: string }>;
    const customCats: Category[] = custom.map(c => ({ id: c.id, name: c.name, color: c.color, isDefault: false }));
    return [...DEFAULT_CATEGORIES, ...customCats];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function deleteCustomCategory(id: string): Promise<void> {
  await fetch(`/api/categories?id=${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function saveCustomCategory(name: string): Promise<Category> {
  const res = await fetch("/api/categories");
  const existing = res.ok ? await res.json() as unknown[] : [];
  const newCat: Category = {
    id: `custom_${Date.now()}`,
    name,
    color: generateColor(existing.length),
    isDefault: false,
  };
  await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCat),
  });
  return newCat;
}

export async function duplicatePreviousWeek(weekId: string): Promise<HourEntry[]> {
  const prev = offsetWeekId(weekId, -1);
  const prevEntries = await getWeekEntries(prev);
  const newEntries = prevEntries.map((e) => ({ ...e, weekId }));
  await saveWeekEntries(weekId, newEntries);
  return newEntries;
}

export function exportToCSV(weekId: string, entries: HourEntry[]): string {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const header = "Day,Hour,Category,Title,Notes";
  const rows = entries.map((e) =>
    `${days[e.day]},${String(e.hour).padStart(2,"0")}:00,${e.category},${e.title || ""},${e.notes || ""}`
  );
  return [header, ...rows].join("\n");
}

export function exportToJSON(_weekId: string, entries: HourEntry[]): string {
  return JSON.stringify(entries, null, 2);
}

export function clearLocalStorage(): void {
  if (typeof window === "undefined") return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("168hours_")) keysToRemove.push(k);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}
