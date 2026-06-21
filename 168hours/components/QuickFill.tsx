"use client";
import { useState } from "react";
import { Category } from "@/lib/types";
import { setEntries, getCategories } from "@/lib/storage";
import { HourEntry } from "@/lib/types";

const TEMPLATES = [
  {
    label: "Working Professional",
    icon: "💼",
    blocks: [
      { days: [0,1,2,3,4], hours: [23,0,1,2,3,4,5,6], category: "sleep", title: "Sleep" },
      { days: [0,1,2,3,4], hours: [7], category: "daily-activities", title: "Morning routine" },
      { days: [0,1,2,3,4], hours: [8,9,10,11,12,13,14,15,16,17], category: "work", title: "Work" },
      { days: [0,1,2,3,4], hours: [18,19], category: "daily-activities", title: "Dinner / commute" },
      { days: [0,1,2,3,4], hours: [20,21], category: "entertainment", title: "Relax" },
      { days: [0,1,2,3,4], hours: [22], category: "self-improvement", title: "Reading" },
      { days: [5,6], hours: [23,0,1,2,3,4,5,6,7], category: "sleep", title: "Weekend sleep" },
      { days: [5,6], hours: [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22], category: "family", title: "Family / leisure" },
    ],
  },
  {
    label: "Student",
    icon: "📚",
    blocks: [
      { days: [0,1,2,3,4,5,6], hours: [23,0,1,2,3,4,5,6], category: "sleep", title: "Sleep" },
      { days: [0,1,2,3,4], hours: [7], category: "daily-activities", title: "Morning routine" },
      { days: [0,1,2,3,4], hours: [8,9,10,11,12], category: "learning", title: "Classes" },
      { days: [0,1,2,3,4], hours: [13,14,15,16], category: "learning", title: "Study" },
      { days: [0,1,2,3,4], hours: [17,18], category: "self-improvement", title: "Exercise / skills" },
      { days: [0,1,2,3,4], hours: [19,20,21,22], category: "entertainment", title: "Social / relax" },
      { days: [5,6], hours: [7,8,9,10,11,12,13,14], category: "learning", title: "Weekend study" },
      { days: [5,6], hours: [15,16,17,18,19,20,21,22], category: "entertainment", title: "Free time" },
    ],
  },
];

interface Props {
  weekId: string;
  categories: Category[];
  onFill: (entries: HourEntry[]) => void;
  onClose: () => void;
}

export default function QuickFill({ weekId, categories, onFill, onClose }: Props) {
  const [step, setStep] = useState<"choose" | "sleep">("choose");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [sleepStart, setSleepStart] = useState(23);
  const [sleepEnd, setSleepEnd] = useState(7);

  function fillSleepAllWeek() {
    const slots: { day: number; hour: number }[] = [];
    for (let d = 0; d < 7; d++) {
      if (sleepStart <= sleepEnd) {
        for (let h = sleepStart; h <= sleepEnd; h++) slots.push({ day: d, hour: h });
      } else {
        for (let h = sleepStart; h < 24; h++) slots.push({ day: d, hour: h });
        for (let h = 0; h <= sleepEnd; h++) slots.push({ day: d, hour: h });
      }
    }
    const newEntries = setEntries(weekId, slots, { category: "sleep", title: "Sleep" });
    onFill(newEntries);
    onClose();
  }

  function applyTemplate(idx: number) {
    const t = TEMPLATES[idx];
    let entries: HourEntry[] = [];
    for (const block of t.blocks) {
      const slots: { day: number; hour: number }[] = [];
      for (const d of block.days) {
        for (const h of block.hours) {
          slots.push({ day: d, hour: h % 24 });
        }
      }
      entries = setEntries(weekId, slots, { category: block.category, title: block.title });
    }
    onFill(entries);
    onClose();
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}>
      <div className="fade-in" style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "28px",
        width: "100%",
        maxWidth: 480,
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", margin: 0 }}>Quick Fill</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Sleep fill */}
          <div style={{
            padding: 16,
            background: "var(--surface2)",
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span>🌙</span> Fill Sleep — All Week
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>From</label>
                <select value={sleepStart} onChange={e => setSleepStart(Number(e.target.value))} style={{
                  padding: "6px 10px", background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--text)", fontSize: 13, cursor: "pointer",
                }}>
                  {Array.from({length:24},(_,i)=>i).map(h=>(
                    <option key={h} value={h}>{String(h).padStart(2,"0")}:00</option>
                  ))}
                </select>
              </div>
              <span style={{ color: "var(--muted)", marginTop: 16 }}>→</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>Until</label>
                <select value={sleepEnd} onChange={e => setSleepEnd(Number(e.target.value))} style={{
                  padding: "6px 10px", background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--text)", fontSize: 13, cursor: "pointer",
                }}>
                  {Array.from({length:24},(_,i)=>i).map(h=>(
                    <option key={h} value={h}>{String(h).padStart(2,"0")}:00</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={fillSleepAllWeek} style={{
              width: "100%",
              padding: "9px",
              background: "#1d4ed8",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}>
              Fill Sleep All Week
            </button>
          </div>

          {/* Templates */}
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>
            Templates
          </div>
          {TEMPLATES.map((t, i) => (
            <button
              key={i}
              onClick={() => applyTemplate(i)}
              style={{
                padding: "14px 16px",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                color: "var(--text)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
            >
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
