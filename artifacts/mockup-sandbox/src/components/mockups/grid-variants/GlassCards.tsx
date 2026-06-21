import React from 'react';
import { Clock } from 'lucide-react';

const CATEGORIES = {
  Sleep: '#1d4ed8',
  Work: '#dc2626',
  Learning: '#7c3aed',
  'Self Improve': '#16a34a',
  Family: '#ea580c',
  Entertainment: '#ca8a04',
  Daily: '#475569',
  Wasted: '#1c1917',
};

type Category = keyof typeof CATEGORIES;

interface CellData {
  category?: Category;
  title?: string;
}

const GRID_DATA: CellData[][] = [
  // 00:00
  [
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
  ],
  // 01:00
  [
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
  ],
  // 02:00
  [
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
  ],
  // 03:00
  [
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
  ],
  // 04:00
  [
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
  ],
  // 05:00
  [
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
    { category: 'Sleep' },
  ],
  // 06:00
  [
    { category: 'Daily', title: 'Morning Routine' },
    { category: 'Sleep' },
    { category: 'Daily', title: 'Gym' },
    { category: 'Sleep' },
    { category: 'Learning', title: 'Reading' },
  ],
  // 07:00
  [
    { category: 'Daily', title: 'Breakfast / Commute' },
    { category: 'Daily', title: 'Breakfast / Commute' },
    { category: 'Daily', title: 'Breakfast / Commute' },
    { category: 'Daily', title: 'Breakfast / Commute' },
    { category: 'Daily', title: 'Breakfast' },
  ],
  // 08:00
  [
    { category: 'Work', title: 'Deep Work' },
    { category: 'Work', title: 'Planning' },
    { category: 'Work', title: 'Deep Work' },
    { category: 'Work', title: 'Meetings' },
    { category: 'Work', title: 'Emails' },
  ],
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = Array.from({ length: 9 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

function getTextColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.45 ? '#111827' : '#ffffff';
}

export function GlassCards() {
  return (
    <div className="min-h-screen p-8 font-sans" style={{ backgroundColor: '#0f1117', color: '#f0f4ff' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-purple-500" />
            Glass Cards Variant
          </h1>
          <p className="text-[rgba(240,244,255,0.55)] text-sm">
            Premium frosted-glass effect with inner glow and gradient blending.
          </p>
        </div>

        <div className="relative border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden bg-[#161b27] shadow-2xl">
          {/* Header */}
          <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-[rgba(255,255,255,0.08)] bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-10">
            <div className="p-3 text-xs font-medium text-[rgba(240,244,255,0.35)] flex items-end justify-center border-r border-[rgba(255,255,255,0.04)]">
              GMT
            </div>
            {DAYS.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-[#f0f4ff] border-r border-[rgba(255,255,255,0.04)] last:border-0">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="relative z-0">
            {HOURS.map((hour, rowIndex) => (
              <div key={hour} className="grid grid-cols-[60px_repeat(5,1fr)] group border-b border-[rgba(255,255,255,0.04)] last:border-0">
                {/* Hour Label */}
                <div className="p-2 text-[10px] font-medium text-[rgba(240,244,255,0.35)] text-center flex items-start justify-center border-r border-[rgba(255,255,255,0.04)] group-hover:text-[rgba(240,244,255,0.7)] transition-colors bg-[#0f1117]/40">
                  {hour}
                </div>

                {/* Cells */}
                {GRID_DATA[rowIndex].map((cell, colIndex) => {
                  if (!cell.category) {
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="h-[40px] border-r border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(255,255,255,0.01)] transition-colors cursor-pointer"
                      />
                    );
                  }

                  const hex = CATEGORIES[cell.category];
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="h-[40px] border-r border-[rgba(255,255,255,0.04)] last:border-0 cursor-pointer relative overflow-hidden group/cell p-1 transition-all duration-200 hover:brightness-125"
                      style={{
                        background: `linear-gradient(135deg, ${hex}33, ${hex}11)`,
                        borderLeft: `2px solid ${hex}`,
                        boxShadow: `inset 3px 0 8px ${hex}22`
                      }}
                    >
                      <div className="flex flex-col h-full justify-center px-1">
                        <div 
                          className="text-[9px] font-bold uppercase tracking-wider leading-none"
                          style={{
                            color: hex,
                            textShadow: `0 0 8px ${hex}88`
                          }}
                        >
                          {cell.category}
                        </div>
                        {cell.title && (
                          <div className="text-[9px] truncate mt-[2px]" style={{ color: 'rgba(240,244,255,0.75)' }}>
                            {cell.title}
                          </div>
                        )}
                      </div>
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

export default GlassCards;
