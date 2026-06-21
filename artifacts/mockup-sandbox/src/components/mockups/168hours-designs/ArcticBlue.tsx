import React from "react";
import { ChevronLeft, ChevronRight, Download, Activity } from "lucide-react";

const CATEGORY_COLORS = {
  Sleep: "#1d4ed8",
  Work: "#dc2626",
  Learning: "#7c3aed",
  "Self Improvement": "#16a34a",
  Family: "#ea580c",
  Entertainment: "#ca8a04",
  "Daily Activities": "#475569",
  Wasted: "#1c1917",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const getCellColor = (dayIndex: number, hour: number) => {
  if (hour >= 0 && hour <= 6) return CATEGORY_COLORS["Sleep"];
  if (dayIndex < 5 && hour >= 8 && hour <= 17) return CATEGORY_COLORS["Work"];
  if (hour >= 18 && hour <= 20) {
    if (dayIndex === 5 || dayIndex === 6) return CATEGORY_COLORS["Entertainment"];
    return dayIndex % 2 === 0 ? CATEGORY_COLORS["Family"] : CATEGORY_COLORS["Learning"];
  }
  if (hour >= 21 && hour <= 23) return CATEGORY_COLORS["Daily Activities"];
  return "transparent";
};

export function ArcticBlue() {
  return (
    <div
      className="min-h-screen font-sans text-slate-100 flex flex-col"
      style={{ backgroundColor: "#050d1a" }}
    >
      {/* Navbar */}
      <nav
        className="px-6 py-4 flex items-center justify-between border-b"
        style={{
          background: "linear-gradient(to right, #050d1a, #0a192f, #050d1a)",
          borderColor: "#1e3a5f",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: "rgba(56, 189, 248, 0.1)", color: "#38bdf8" }}
          >
            <Activity size={18} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">168 Hours</h1>
        </div>

        <div className="flex items-center gap-4 bg-[#0a192f] rounded-full px-1 border" style={{ borderColor: "#1e3a5f" }}>
          <button className="p-2 hover:text-[#38bdf8] transition-colors rounded-full hover:bg-white/5">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium px-2">Oct 23 - Oct 29, 2023</span>
          <button className="p-2 hover:text-[#38bdf8] transition-colors rounded-full hover:bg-white/5">
            <ChevronRight size={18} />
          </button>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
          style={{
            backgroundColor: "#38bdf8",
            color: "#050d1a",
            boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)",
          }}
        >
          <Download size={16} />
          Export PDF
        </button>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8">
        {/* Grid Container */}
        <div
          className="rounded-xl border shadow-2xl p-6 overflow-x-auto"
          style={{
            backgroundColor: "#0a192f",
            borderColor: "#1e3a5f",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="flex mb-4">
              <div className="w-16 flex-shrink-0"></div>
              <div className="flex-1 grid grid-cols-7 gap-4">
                {DAYS.map((day, i) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold tracking-wider uppercase"
                    style={{ color: i > 4 ? "#38bdf8" : "#94a3b8" }}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Grid Body */}
            <div className="flex relative">
              {/* Left Axis */}
              <div className="w-16 flex-shrink-0 flex flex-col justify-between text-xs font-medium text-slate-500 py-2 relative">
                {[0, 6, 12, 18, 23].map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full text-right pr-4 transform -translate-y-1/2"
                    style={{ top: `${(hour / 24) * 100}%` }}
                  >
                    {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                  </div>
                ))}
              </div>

              {/* Cells */}
              <div
                className="flex-1 grid grid-cols-7 gap-4 relative rounded-lg border p-4"
                style={{ borderColor: "#1e3a5f", backgroundColor: "#050d1a" }}
              >
                {/* Horizontal Dividers for guides */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-4 opacity-20">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full border-b" style={{ borderColor: "#38bdf8" }}></div>
                  ))}
                </div>

                {DAYS.map((day, dayIndex) => (
                  <div key={day} className="flex flex-col gap-1 z-10">
                    {HOURS.map((hour) => {
                      const color = getCellColor(dayIndex, hour);
                      const isEmpty = color === "transparent";
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className="w-full transition-transform hover:scale-[1.02] cursor-pointer"
                          style={{
                            height: "28px",
                            backgroundColor: isEmpty ? "transparent" : color,
                            borderRadius: "4px",
                            border: isEmpty ? "1px dashed #1e3a5f" : "1px solid rgba(255,255,255,0.1)",
                            opacity: isEmpty ? 0.3 : 0.9,
                          }}
                          title={`${day} ${hour}:00`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div
          className="rounded-xl border p-6 mt-auto"
          style={{ backgroundColor: "#0a192f", borderColor: "#1e3a5f" }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {Object.entries(CATEGORY_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded shadow-sm"
                  style={{ backgroundColor: color, border: "1px solid rgba(255,255,255,0.2)" }}
                />
                <span className="text-sm font-medium text-slate-300">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
