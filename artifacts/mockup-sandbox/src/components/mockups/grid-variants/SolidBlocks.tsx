import React from 'react';

const CATEGORIES = {
  Sleep: '#1d4ed8',
  Work: '#dc2626',
  Learning: '#7c3aed',
  SelfImprove: '#16a34a',
  Family: '#ea580c',
  Entertainment: '#ca8a04',
  Daily: '#475569',
  Wasted: '#1c1917',
};

function getTextColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.45 ? '#111827' : '#ffffff';
}

const HOURS = Array.from({ length: 9 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const DATA = {
  'Mon': [
    { hour: 0, cat: 'Sleep' },
    { hour: 1, cat: 'Sleep' },
    { hour: 2, cat: 'Sleep' },
    { hour: 3, cat: 'Sleep' },
    { hour: 4, cat: 'Sleep' },
    { hour: 5, cat: 'Sleep' },
    { hour: 6, cat: 'Daily', title: 'Morning Routine' },
    { hour: 7, cat: 'Learning', title: 'Reading' },
    { hour: 8, cat: 'Work', title: 'Deep Work' },
  ],
  'Tue': [
    { hour: 0, cat: 'Sleep' },
    { hour: 1, cat: 'Sleep' },
    { hour: 2, cat: 'Sleep' },
    { hour: 3, cat: 'Sleep' },
    { hour: 4, cat: 'Sleep' },
    { hour: 5, cat: 'Sleep' },
    { hour: 6, cat: 'Daily', title: 'Morning Routine' },
    { hour: 7, cat: 'SelfImprove', title: 'Gym' },
    { hour: 8, cat: 'Work', title: 'Deep Work' },
  ],
  'Wed': [
    { hour: 0, cat: 'Sleep' },
    { hour: 1, cat: 'Sleep' },
    { hour: 2, cat: 'Sleep' },
    { hour: 3, cat: 'Sleep' },
    { hour: 4, cat: 'Sleep' },
    { hour: 5, cat: 'Sleep' },
    { hour: 6, cat: 'Daily', title: 'Morning Routine' },
    { hour: 7, cat: 'Wasted', title: 'Scrolling' },
    { hour: 8, cat: 'Work', title: 'Deep Work' },
  ],
  'Thu': [
    { hour: 0, cat: 'Sleep' },
    { hour: 1, cat: 'Sleep' },
    { hour: 2, cat: 'Sleep' },
    { hour: 3, cat: 'Sleep' },
    { hour: 4, cat: 'Sleep' },
    { hour: 5, cat: 'Sleep' },
    { hour: 6, cat: 'Daily', title: 'Morning Routine' },
    { hour: 7, cat: 'Family', title: 'Breakfast' },
    { hour: 8, cat: 'Work', title: 'Deep Work' },
  ],
  'Fri': [
    { hour: 0, cat: 'Sleep' },
    { hour: 1, cat: 'Sleep' },
    { hour: 2, cat: 'Sleep' },
    { hour: 3, cat: 'Sleep' },
    { hour: 4, cat: 'Sleep' },
    { hour: 5, cat: 'Sleep' },
    { hour: 6, cat: 'Daily', title: 'Morning Routine' },
    { hour: 7, cat: 'Entertainment', title: 'Gaming' },
    { hour: 8, cat: 'Work', title: 'Deep Work' },
  ],
};

function Cell({ data }: { data?: { cat: string; title?: string } }) {
  if (!data) {
    return (
      <div 
        className="w-[108px] h-[40px] transition-colors cursor-pointer"
        style={{
          backgroundColor: '#161b27',
          borderBottom: '1px solid rgba(0,0,0,0.3)',
          borderRight: '1px solid rgba(0,0,0,0.3)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e2637'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#161b27'}
      />
    );
  }

  const bgColor = CATEGORIES[data.cat as keyof typeof CATEGORIES] || '#161b27';
  const textColor = getTextColor(bgColor);
  const stripeColor = textColor === '#ffffff' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)';

  return (
    <div 
      className="w-[108px] h-[40px] relative overflow-hidden flex flex-col justify-center px-2 cursor-pointer"
      style={{
        backgroundColor: bgColor,
        borderBottom: '1px solid rgba(0,0,0,0.3)',
        borderRight: '1px solid rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }} />
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: stripeColor }} />
      
      <div className="relative z-10 flex flex-col leading-tight">
        <span 
          className="font-bold uppercase tracking-wider"
          style={{ color: textColor, fontSize: '9px' }}
        >
          {data.cat === 'SelfImprove' ? 'Self Improve' : data.cat}
        </span>
        {data.title && (
          <span 
            className="truncate"
            style={{ color: textColor, fontSize: '9px', opacity: 0.85 }}
          >
            {data.title}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SolidBlocks() {
  return (
    <div className="min-h-screen p-8 flex items-center justify-center font-sans" style={{ backgroundColor: '#0f1117', color: '#f0f4ff' }}>
      <div className="flex flex-col rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0f1117' }}>
        
        {/* Header */}
        <div className="flex" style={{ backgroundColor: '#161b27', borderBottom: '1px solid rgba(0,0,0,0.3)' }}>
          <div className="w-[60px] h-[40px] flex-shrink-0" style={{ borderRight: '1px solid rgba(0,0,0,0.3)' }} />
          {DAYS.map(day => (
            <div 
              key={day} 
              className="w-[108px] h-[40px] flex items-center justify-center text-xs font-medium"
              style={{ color: 'rgba(240,244,255,0.55)', borderRight: '1px solid rgba(0,0,0,0.3)' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-col">
          {HOURS.map((hour, rowIdx) => (
            <div key={hour} className="flex">
              {/* Time Label */}
              <div 
                className="w-[60px] h-[40px] flex items-center justify-center text-[10px] flex-shrink-0"
                style={{ 
                  color: 'rgba(240,244,255,0.35)', 
                  borderRight: '1px solid rgba(0,0,0,0.3)',
                  borderBottom: '1px solid rgba(0,0,0,0.3)',
                  backgroundColor: '#0f1117'
                }}
              >
                {hour}
              </div>

              {/* Day Cells */}
              {DAYS.map(day => {
                const cellData = DATA[day as keyof typeof DATA]?.find(d => d.hour === rowIdx);
                return <Cell key={`${day}-${hour}`} data={cellData} />;
              })}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
