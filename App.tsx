
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CreditCard,
  Compass
} from 'lucide-react';
import { ItineraryItem, Expense, Member } from './types';
import HorizontalDateSelector from './components/HorizontalDateSelector';
import WeatherCard from './components/WeatherCard';
import ItinerarySection from './components/ItinerarySection';
import ExpenseSection from './components/ExpenseSection';

const DEFAULT_MEMBERS: Member[] = [
  { id: '1', name: 'Sherry' },
  { id: '2', name: 'QQ' }
];

const START_DATE = '2026-06-01'; // 峇里島乾季

const INITIAL_ITINERARY: ItineraryItem[] = [
  { id: 'b1', date: '2026-06-01', time: '15:00', location: '伍拉·賴國際機場 (DPS)', note: '接機人員會拿牌子在出口等' },
  { id: 'b2', date: '2026-06-01', time: '17:00', location: '烏布民宿 Check-in', note: '放行李，附近逛逛烏布市場' },
  { id: 'b3', date: '2026-06-02', time: '09:00', location: '德哥拉朗梯田', note: '拍鞦韆照片，喝椰子水' },
  { id: 'b4', date: '2026-06-02', time: '14:00', location: '聖泉寺 Pura Tirta Empul', note: '體驗洗禮儀式' },
  { id: 'b5', date: '2026-06-03', time: '16:00', location: '海神廟 Tanah Lot', note: '看夕陽，注意潮汐時間' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'expenses'>('itinerary');
  const [selectedDate, setSelectedDate] = useState<string>(START_DATE);
  const [lastSaved, setLastSaved] = useState<string>('');
  
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('bali_2026_members_v2');
    return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
  });
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    const saved = localStorage.getItem('bali_2026_itinerary_v2');
    return saved ? JSON.parse(saved) : INITIAL_ITINERARY;
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('bali_2026_expenses_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bali_2026_members_v2', JSON.stringify(members));
    localStorage.setItem('bali_2026_itinerary_v2', JSON.stringify(itinerary));
    localStorage.setItem('bali_2026_expenses_v2', JSON.stringify(expenses));
    
    const now = new Date();
    setLastSaved(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
  }, [members, itinerary, expenses]);

  return (
    <div className="min-h-screen pb-24 text-slate-700 bg-[#f0f4f3]">
      <header className="bg-white px-6 pt-12 pb-6 shadow-sm rounded-b-[40px]">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#4a7c77]">2026 峇里島之旅</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-medium flex items-center gap-1">
              Bali Explorer • <span className="text-[#789d9a]">Auto Saved {lastSaved}</span>
            </p>
          </div>
          <div className="bg-[#789d9a]/10 p-2.5 rounded-2xl text-[#789d9a]">
            <Compass size={20} />
          </div>
        </div>
        
        <div className="mt-8">
          <HorizontalDateSelector 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} 
          />
        </div>

        <div className="mt-6">
          <WeatherCard />
        </div>
      </header>

      <main className="px-5 mt-8 max-w-2xl mx-auto">
        {activeTab === 'itinerary' ? (
          <ItinerarySection 
            selectedDate={selectedDate} 
            itinerary={itinerary} 
            setItinerary={setItinerary} 
          />
        ) : (
          <ExpenseSection 
            expenses={expenses} 
            setExpenses={setExpenses} 
            members={members}
            setMembers={setMembers}
          />
        )}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[85%] max-w-sm bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/40 flex justify-around items-center p-2 z-50">
        <button 
          onClick={() => setActiveTab('itinerary')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-500 ${activeTab === 'itinerary' ? 'bg-[#789d9a] text-white shadow-md' : 'text-slate-400 hover:text-[#789d9a]'}`}
        >
          <Calendar size={18} />
          <span className="text-sm font-bold">行程</span>
        </button>
        <button 
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-500 ${activeTab === 'expenses' ? 'bg-[#789d9a] text-white shadow-md' : 'text-slate-400 hover:text-[#789d9a]'}`}
        >
          <CreditCard size={18} />
          <span className="text-sm font-bold">帳目</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
