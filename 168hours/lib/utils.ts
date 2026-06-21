import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HourEntry } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

export function formatHour24(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function computeWeekStats(entries: HourEntry[]) {
  const byCategory: Record<string, number> = {};
  const byDay: Record<number, Record<string, number>> = {};

  for (let d = 0; d < 7; d++) byDay[d] = {};

  for (const e of entries) {
    if (!e.category) continue;
    byCategory[e.category] = (byCategory[e.category] || 0) + 1;
    byDay[e.day][e.category] = (byDay[e.day][e.category] || 0) + 1;
  }

  const totalLogged = entries.filter((e) => e.category).length;
  const totalUnlogged = 168 - totalLogged;

  const positiveCategories = ["learning", "work", "self-improvement"];
  const negativeCategories = ["wasted"];
  const positiveHours = positiveCategories.reduce((sum, c) => sum + (byCategory[c] || 0), 0);
  const negativeHours = negativeCategories.reduce((sum, c) => sum + (byCategory[c] || 0), 0);
  const productivityScore = Math.max(0, Math.min(100,
    Math.round((positiveHours / 168) * 100 - (negativeHours / 168) * 50 + (totalLogged / 168) * 30)
  ));

  const wastedHours = byCategory["wasted"] || 0;
  const sleepHours = byCategory["sleep"] || 0;

  return {
    totalLogged,
    totalUnlogged,
    byCategory,
    byDay,
    productivityScore,
    wastedHours,
    sleepHours,
  };
}

export function getWeekLabel(weekId: string): string {
  const [yearStr, weekStr] = weekId.split("-W");
  const year = parseInt(yearStr);
  const week = parseInt(weekStr);
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - jan4Day + 1 + (week - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(weekStart)} – ${fmt(weekEnd)}, ${year}`;
}
