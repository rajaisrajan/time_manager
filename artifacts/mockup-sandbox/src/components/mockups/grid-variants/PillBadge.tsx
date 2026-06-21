import React from "react";
import { Clock } from "lucide-react";

const getTextColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 *b;
  return luminance > 0.45 ? "#111827" : "#ffffff";
};

const CATEGORIES = {
  Sleep: "#1d4ed8",
  Work: "#dc2626",
  Learning: "#7c3aed",
  SelfImprove: "#16a34a",
  Family: "#ea580c",
  Entertainment: "#ca8a04",
  Daily: "#475569",
  Wasted: "#1c1917",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = Array.from({ length: 9 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

type CellData = {
  category?: keyof typeof CATEGORIES;
  title?: string;
};

// Generate some realistic-looking data
const gridData: Record<string, CellData> = {
  // Monday
  "0-0": { category: "Sleep" },
  "1-0": { category: "Sleep" },
  "2-0": { category: "Sleep" },
  "3-0": { category: "Sleep" },
  "4-0": { category: "Sleep" },
  "5-0": { category: "Sleep" },
  "6-0": { category: "Daily", title: "Morning Routine" },
  "7-0": { category: "Learning", title: "Read Book" },
  "8-0": { category: "Work", title: "Deep Work" },
  
  // Tuesday
  "0-1": { category: "Sleep" },
  "1-1": { category: "Sleep" },
  "2-1": { category: "Sleep" },
  "3-1": { category: "Sleep" },
  "4-1": { category: "Sleep" },
  "5-1": { category: "Sleep" },
  "6-1": { category: "SelfImprove", title: "Gym" },
  "7-1": { category: "Daily", title: "Commute" },
  "8-1": { category: "Work", title: "Team Sync" },

  // Wednesday
  "0-2": { category: "Sleep" },
  "1-2": { category: "Sleep" },
  "2-2": { category: "Sleep" },
  "3-2": { category: "Sleep" },
  "4-2": { category: "Sleep" },
  "5-2": { category: "Sleep" },
  "6-2": { category: "Daily", title: "Morning Routine" },
  "7-2": { category: "Entertainment", title: "Podcast" },
  "8-2": { category: "Work", title: "Project Alpha" },

  // Thursday
  "0-3": { category: "Sleep" },
  "1-3": { category: "Sleep" },
  "2-3": { category: "Sleep" },
  "3-3": { category: "Sleep" },
  "4-3": { category: "Sleep" },
  "5-3": { category: "Sleep" },
  "6-3": { category: "SelfImprove", title: "Gym" },
  "7-3": { category: "Daily", title: "Commute" },
  "8-3": { category: "Work", title: "Emails" },

  // Friday
  "0-4": { category: "Sleep" },
  "1-4": { category: "Sleep" },
  "2-4": { category: "Sleep" },
  "3-4": { category: "Sleep" },
  "4-4": { category: "Sleep" },
  "5-4": { category: "Sleep" },
  "6-4": { category: "Daily", title: "Morning Routine" },
  "7-4": { category: "Family", title: "Breakfast" },
  "8-4": { category: "Work", title: "Planning" },
};

const getAbbreviation = (name: string) => {
  if (name === "SelfImprove") return "Self";
  return name.slice(0, 6);
};

export function PillBadge() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-[#f0f4ff] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Pill Badges</h2>
            <p className="text-[#f0f4ff]/55 text-sm">
              Refined calendar app feel with colored category pills.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-[#f0f4ff]/55 bg-[#161b27] px-3 py-1.5 rounded-full border border-white/10">
            <Clock size={16} />
            <span>00:00 - 08:00</span>
          </div>
        </div>

        <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#161b27] shadow-xl">
          {/* Header */}
          <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] border-b border-white/[0.08] sticky top-0 bg-[#161b27] z-10">
            <div className="p-3 border-r border-white/[0.04]"></div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-[#f0f4ff]/55 border-r border-white/[0.04] last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="relative">
            {HOURS.map((hour, rowIdx) => (
              <div
                key={hour}
                className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] border-b border-white/[0.05] last:border-b-0 group"
              >
                {/* Time Label */}
                <div className="p-2 text-xs text-right text-[#f0f4ff]/35 border-r border-white/[0.04] sticky left-0 bg-[#161b27]">
                  <span className="-translate-y-3 block">{hour}</span>
                </div>

                {/* Cells */}
                {DAYS.map((_, colIdx) => {
                  const cell = gridData[`${rowIdx}-${colIdx}`];
                  const hasContent = !!cell?.category;
                  const hex = hasContent ? CATEGORIES[cell.category!] : null;
                  const textColor = hex ? getTextColor(hex) : "";
                  const abbrev = cell?.category ? getAbbreviation(cell.category) : "";

                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className="h-[40px] border-r border-white/[0.04] last:border-r-0 p-[2px] transition-colors relative hover:bg-[#1e2637]"
                    >
                      {hasContent ? (
                        <div
                          className="w-full h-full rounded flex items-start gap-1.5 p-1 overflow-hidden"
                          style={{
                            backgroundColor: `${hex}14`, // 8% opacity
                          }}
                        >
                          <div
                            className="px-1.5 py-[1px] rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap shadow-sm"
                            style={{
                              backgroundColor: hex!,
                              color: textColor,
                            }}
                          >
                            {abbrev}
                          </div>
                          {cell.title && (
                            <div
                              className="text-[10px] leading-tight truncate font-medium mt-[1px]"
                              style={{ color: "rgba(240,244,255,0.7)" }}
                            >
                              {cell.title}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full rounded hover:bg-[#1e2637] transition-colors cursor-pointer group-hover:border-white/[0.02]" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PillBadge;
