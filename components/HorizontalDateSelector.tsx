
import React, { useRef } from 'react';

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const HorizontalDateSelector: React.FC<Props> = ({ selectedDate, onSelectDate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 2026/06/01 開始的 7 天行程
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(2026, 5, 1); 
    d.setDate(d.getDate() + i);
    return {
      full: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('zh-TW', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.getMonth() + 1,
      dayIndex: i + 1
    };
  });

  return (
    <div 
      ref={containerRef}
      className="flex gap-4 overflow-x-auto hide-scrollbar py-2 px-1"
    >
      {dates.map((date) => {
        const isSelected = selectedDate === date.full;
        return (
          <button
            key={date.full}
            onClick={() => onSelectDate(date.full)}
            className={`flex flex-col items-center justify-center min-w-[72px] h-24 rounded-[28px] transition-all duration-500 transform ${
              isSelected 
                ? 'bg-[#789d9a] text-white shadow-xl scale-105' 
                : 'bg-white text-slate-400 hover:bg-[#789d9a]/5 shadow-sm'
            }`}
          >
            <span className={`text-[8px] font-black uppercase mb-1 tracking-widest ${isSelected ? 'text-white/60' : 'text-[#789d9a]/40'}`}>
              Day {date.dayIndex}
            </span>
            <span className={`text-[10px] font-bold mb-1 ${isSelected ? 'text-white/80' : 'text-slate-300'}`}>
              {date.dayName}
            </span>
            <span className="text-xl font-black leading-none">
              {date.dayNumber}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default HorizontalDateSelector;
