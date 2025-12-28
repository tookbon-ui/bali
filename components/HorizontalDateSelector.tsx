
import React, { useRef } from 'react';

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const HorizontalDateSelector: React.FC<Props> = ({ selectedDate, onSelectDate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 2026/02/03 開始的 7 天行程
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(2026, 1, 3); // 月份從 0 開始，1 代表 2 月
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
            className={`flex flex-col items-center justify-center min-w-[68px] h-24 rounded-2xl transition-all duration-300 transform ${
              isSelected 
                ? 'bg-[#438a84] text-white shadow-lg scale-105' 
                : 'bg-[#f0f4f4] text-slate-500 hover:bg-[#e2ebeb]'
            }`}
          >
            <span className={`text-[9px] font-black uppercase mb-0.5 tracking-tighter ${isSelected ? 'text-emerald-200' : 'text-[#438a84]/60'}`}>
              Day {date.dayIndex}
            </span>
            <span className={`text-[10px] font-medium mb-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
              {date.dayName}
            </span>
            <span className="text-xl font-bold leading-tight">
              {date.dayNumber}
            </span>
            <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
              {date.month}月
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default HorizontalDateSelector;
