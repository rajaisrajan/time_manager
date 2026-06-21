import React from 'react';
import { ChevronLeft, ChevronRight, Download, Clock } from 'lucide-react';

const CATEGORIES = [
  { name: 'Sleep', color: '#1d4ed8' },
  { name: 'Work', color: '#dc2626' },
  { name: 'Learning', color: '#7c3aed' },
  { name: 'Self Improvement', color: '#16a34a' },
  { name: 'Family', color: '#ea580c' },
  { name: 'Entertainment', color: '#ca8a04' },
  { name: 'Daily Activities', color: '#475569' },
  { name: 'Wasted', color: '#1c1917' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const getCellColor = (dayIndex: number, hour: number) => {
  if (hour >= 0 && hour <= 6) return '#1d4ed8'; // Sleep
  
  const isWeekend = dayIndex === 5 || dayIndex === 6;
  
  if (!isWeekend && hour >= 8 && hour <= 17) return '#dc2626'; // Work
  if (isWeekend && hour >= 8 && hour <= 12) return '#16a34a'; // Self Improvement weekend
  if (isWeekend && hour >= 13 && hour <= 17) return '#ea580c'; // Family weekend
  
  if (hour >= 18 && hour <= 20) {
    if (dayIndex % 2 === 0) return '#ca8a04'; // Entertainment
    if (dayIndex % 3 === 0) return '#7c3aed'; // Learning
    return '#ea580c'; // Family
  }
  
  if (hour >= 21 && hour <= 23) return '#475569'; // Daily Activities
  
  if (hour === 7) return '#475569'; // Morning routine
  
  return '#1c1917'; // Wasted/empty
};

export function ObsidianPurple() {
  return (
    <div className="min-h-screen font-sans text-slate-200 selection:bg-violet-500/30" style={{ backgroundColor: '#08080f', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="w-[800px] h-[800px] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen opacity-50" />
      </div>

      {/* Glassmorphism Navbar */}
      <header className="sticky top-0 z-50 border-b border-violet-900/30 bg-[#08080f]/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-white">168 Hours</h1>
          </div>

          <div className="flex items-center gap-4 bg-violet-950/20 p-1 rounded-full border border-violet-900/40">
            <button className="p-1.5 rounded-full hover:bg-violet-900/50 text-violet-300 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium px-2 text-violet-100">Oct 23 - Oct 29, 2023</span>
            <button className="p-1.5 rounded-full hover:bg-violet-900/50 text-violet-300 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/30 shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        
        {/* Grid Area */}
        <div className="bg-[#0c0c16]/80 backdrop-blur-sm border border-violet-900/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex">
            
            {/* Time Axis */}
            <div className="w-16 flex flex-col pt-8 border-r border-violet-900/30 pr-4">
              {HOURS.map((hour) => (
                <div key={hour} className="h-[28px] relative">
                  {[0, 6, 12, 18, 23].includes(hour) && (
                    <span className="absolute -top-2.5 right-0 text-xs text-violet-400/60 font-medium tracking-wider">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="flex-1 pl-4 flex flex-col">
              
              {/* Day Headers */}
              <div className="flex mb-4">
                {DAYS.map((day, i) => (
                  <div key={day} className="flex-1 text-center">
                    <span className={`text-sm font-semibold tracking-wide ${i >= 5 ? 'text-fuchsia-400/80' : 'text-violet-200/80'}`}>
                      {day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Grid Cells */}
              <div className="flex gap-2">
                {DAYS.map((_, dayIndex) => (
                  <div key={dayIndex} className="flex-1 flex flex-col gap-1">
                    {HOURS.map((hour) => {
                      const color = getCellColor(dayIndex, hour);
                      const isWasted = color === '#1c1917';
                      return (
                        <div
                          key={`${dayIndex}-${hour}`}
                          className="h-[26px] w-full rounded-[3px] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_12px_currentColor] cursor-crosshair group relative"
                          style={{ 
                            backgroundColor: color,
                            opacity: isWasted ? 0.4 : 0.9,
                            boxShadow: isWasted ? 'none' : 'inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 8px rgba(139,92,246,0.4)'
                          }}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-[#08080f] border border-violet-500/30 text-white text-xs py-1 px-2 rounded shadow-xl z-20">
                            {hour}:00 - {hour+1}:00
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center items-center bg-[#0c0c16]/60 backdrop-blur-sm border border-violet-900/20 rounded-xl p-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2 bg-[#08080f]/50 px-3 py-1.5 rounded-md border border-white/5 hover:border-violet-500/30 transition-colors cursor-default">
              <div 
                className="w-3 h-3 rounded-sm shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: cat.color, color: cat.color }}
              />
              <span className="text-xs font-medium text-slate-300">{cat.name}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
