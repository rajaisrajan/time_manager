import React from "react";

const CATEGORIES = [
  { name: "Sleep", color: "#1d4ed8" },
  { name: "Work", color: "#dc2626" },
  { name: "Learning", color: "#7c3aed" },
  { name: "Self Improvement", color: "#16a34a" },
  { name: "Family", color: "#ea580c" },
  { name: "Entertainment", color: "#ca8a04" },
  { name: "Daily Activities", color: "#475569" },
  { name: "Wasted", color: "#1c1917" }
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getCellColor(dayIndex: number, hour: number) {
  if (hour >= 0 && hour <= 6) return "#1d4ed8"; // Sleep
  
  if (dayIndex >= 0 && dayIndex <= 4) {
    if (hour >= 8 && hour <= 17) return "#dc2626"; // Work
  }
  
  if (hour >= 18 && hour <= 20) {
    const mixed = ["#ca8a04", "#ea580c", "#7c3aed"];
    return mixed[(dayIndex + hour) % mixed.length];
  }
  
  if (hour >= 21 && hour <= 23) return "#475569"; // Daily Activities
  
  return "transparent";
}

export function TerminalGreen() {
  return (
    <div 
      className="min-h-screen text-[#22c55e] p-8 relative overflow-hidden"
      style={{
        backgroundColor: "#090d09",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(34, 197, 94, 0.03) 0px, rgba(34, 197, 94, 0.03) 1px, transparent 1px, transparent 4px)"
      }}
    >
      <div className="max-w-6xl mx-auto border border-[#22c55e]/30 bg-[#090d09]/90 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative z-10">
        
        {/* Navbar */}
        <header className="border-b border-[#22c55e]/30 p-4 flex items-center justify-between bg-[#090d09]">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">&gt; 168_HOURS</h1>
            <span className="text-[#4ade80]/60 text-sm animate-pulse">_sys.ready</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm border border-[#22c55e]/30 px-3 py-1 bg-[#22c55e]/5">
              <button className="hover:text-[#4ade80] transition-colors">&lt;</button>
              <span className="px-4">WEEK_42 / OCT_2023</span>
              <button className="hover:text-[#4ade80] transition-colors">&gt;</button>
            </div>
            
            <button className="text-sm px-4 py-1 border border-[#22c55e] text-[#090d09] bg-[#22c55e] hover:bg-[#4ade80] transition-colors font-bold">
              [ EXPORT_DAT ]
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <div className="flex gap-4">
            
            {/* Y-Axis Hours */}
            <div className="flex flex-col pt-8 pb-1 w-12 flex-shrink-0 text-[#22c55e]/60 text-xs justify-between">
              {[0, 6, 12, 18, 23].map((hour) => (
                <div key={hour} className="h-7 flex items-center justify-end pr-2" style={{ position: 'relative', top: `${(hour / 24) * 100}%`, transform: 'translateY(-50%)', marginTop: hour === 0 ? '14px' : '0' }}>
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex-1 border-l border-t border-[#22c55e]/20 relative">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:calc(100%/7)_28px]" />
              
              <div className="grid grid-cols-7 border-b border-r border-[#22c55e]/20 relative z-10">
                {DAYS.map((day, dIdx) => (
                  <div key={day} className="flex flex-col border-l border-[#22c55e]/20">
                    <div className="h-8 flex items-center justify-center text-xs font-bold border-b border-[#22c55e]/20 bg-[#22c55e]/5 text-[#4ade80]">
                      {day}
                    </div>
                    <div className="p-1 flex flex-col gap-1">
                      {Array.from({ length: 24 }).map((_, hIdx) => {
                        const color = getCellColor(dIdx, hIdx);
                        return (
                          <div 
                            key={hIdx}
                            className="h-[26px] w-full rounded-sm opacity-90 hover:opacity-100 transition-opacity cursor-crosshair border border-black/20"
                            style={{ backgroundColor: color !== "transparent" ? color : 'rgba(34,197,94,0.05)' }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Legend */}
        <footer className="border-t border-[#22c55e]/30 p-4 bg-[#090d09]">
          <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center text-xs">
            {CATEGORIES.map(cat => (
              <div key={cat.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 border border-black/20 rounded-sm" 
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[#22c55e]/80 uppercase">{cat.name}</span>
              </div>
            ))}
          </div>
        </footer>
        
      </div>
    </div>
  );
}
