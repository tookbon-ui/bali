
import React, { useState } from 'react';
import { Plus, Trash2, Clock, MapPin, Edit3, X, Check } from 'lucide-react';
import { ItineraryItem } from '../types';

interface Props {
  selectedDate: string;
  itinerary: ItineraryItem[];
  setItinerary: React.Dispatch<React.SetStateAction<ItineraryItem[]>>;
}

const ItinerarySection: React.FC<Props> = ({ selectedDate, itinerary, setItinerary }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ time: '10:00', location: '', note: '' });

  const dayItems = itinerary
    .filter(item => item.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleAdd = () => {
    if (!newItem.location) return;
    const item: ItineraryItem = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      ...newItem
    };
    setItinerary([...itinerary, item]);
    setNewItem({ time: '10:00', location: '', note: '' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2d5a57]">本日行程</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 bg-[#438a84] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-5 rounded-[30px] shadow-sm border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">時間</label>
              <input 
                type="time" 
                value={newItem.time}
                onChange={e => setNewItem({...newItem, time: e.target.value})}
                className="w-full bg-[#f4f7f6] p-3 rounded-xl focus:ring-2 focus:ring-[#438a84] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">地點</label>
              <input 
                placeholder="例如：淺草寺"
                value={newItem.location}
                onChange={e => setNewItem({...newItem, location: e.target.value})}
                className="w-full bg-[#f4f7f6] p-3 rounded-xl focus:ring-2 focus:ring-[#438a84] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">備註 (可選)</label>
            <input 
              placeholder="想吃的餐廳、交通方式..."
              value={newItem.note}
              onChange={e => setNewItem({...newItem, note: e.target.value})}
              className="w-full bg-[#f4f7f6] p-3 rounded-xl focus:ring-2 focus:ring-[#438a84] outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAdding(false)}
              className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-medium"
            >
              取消
            </button>
            <button 
              onClick={handleAdd}
              className="flex-2 px-8 py-3 bg-[#438a84] text-white rounded-xl font-medium"
            >
              新增行程
            </button>
          </div>
        </div>
      )}

      {dayItems.length === 0 && !isAdding ? (
        <div className="text-center py-20">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
            <MapPin size={32} className="text-[#438a84]/30" />
          </div>
          <p className="text-slate-400 font-light">這一天還沒有安排任何行程呢。</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="mt-4 text-[#438a84] font-medium text-sm hover:underline"
          >
            立即新增一個吧！
          </button>
        </div>
      ) : (
        <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#438a84] before:to-transparent">
          {dayItems.map((item) => (
            <div key={item.id} className="relative group animate-in slide-in-from-left duration-500">
              <div className="absolute -left-[29px] top-1 w-5 h-5 bg-white border-4 border-[#438a84] rounded-full z-10 shadow-sm"></div>
              <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-50 group-hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-[#438a84]">
                    <Clock size={14} />
                    <span className="text-sm font-bold tracking-tight">{item.time}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-200 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-[#2d5a57] mb-1">{item.location}</h3>
                {item.note && <p className="text-sm text-slate-400 font-light leading-relaxed">{item.note}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItinerarySection;
