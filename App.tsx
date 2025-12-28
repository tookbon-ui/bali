
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CreditCard
} from 'lucide-react';
import { ItineraryItem, Expense, Member } from './types';
import HorizontalDateSelector from './components/HorizontalDateSelector';
import WeatherCard from './components/WeatherCard';
import ItinerarySection from './components/ItinerarySection';
import ExpenseSection from './components/ExpenseSection';

const DEFAULT_MEMBERS: Member[] = [
  { id: '1', name: '我' },
  { id: '2', name: '小明' },
  { id: '3', name: '小華' }
];

const INITIAL_ITINERARY: ItineraryItem[] = [
  { id: 'b1', date: '2025-02-03', time: '10:00', location: '桃園機場 - BR255 起飛', note: '前往峇里島 (DPS)' },
  { id: 'b2', date: '2025-02-03', time: '15:30', location: '抵達峇里島伍拉·賴機場', note: '包車司機接機' },
  { id: 'b3', date: '2025-02-03', time: '17:00', location: 'Villa Check-in (水明漾)', note: '放行李、休息' },
  { id: 'b4', date: '2025-02-03', time: '18:30', location: 'La Favela 晚餐', note: '水明漾著名餐酒館' },
  { id: 'b5', date: '2025-02-04', time: '09:00', location: '烏布森林鞦韆', note: '拍美照行程' },
  { id: 'b6', date: '2025-02-04', time: '14:00', location: '烏布皇宮 & 市場', note: '買手工藝品' },
  { id: 'b7', date: '2025-02-05', time: '16:00', location: '海神廟夕陽', note: '峇里島必看地標' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'expenses'>('itinerary');
  const [selectedDate, setSelectedDate] = useState<string>('2025-02-03');
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('bali_members');
    return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
  });
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    const saved = localStorage.getItem('bali_itinerary');
    return saved ? JSON.parse(saved) : INITIAL_ITINERARY;
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('bali_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bali_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('bali_itinerary', JSON.stringify(itinerary));
  }, [itinerary]);

  useEffect(() => {
    localStorage.setItem('bali_expenses', JSON.stringify(expenses));
  }, [expenses]);

  return (
    <div className="min-h-screen pb-24 text-slate-800 bg-[#f4f7f6]">
      <header className="bg-white px-6 pt-12 pb-6 shadow-sm rounded-b-[40px]">
        <h1 className="text-2xl font-bold tracking-tight text-[#2d5a57]">峇里島極簡之旅</h1>
        <p className="text-sm text-slate-400 mt-1 uppercase tracking-widest font-light">Bali Travel Log</p>
        
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

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-lg rounded-full shadow-xl border border-white/40 flex justify-around items-center p-3 z-50">
        <button 
          onClick={() => setActiveTab('itinerary')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'itinerary' ? 'bg-[#438a84] text-white' : 'text-slate-400 hover:text-[#438a84]'}`}
        >
          <Calendar size={18} />
          <span className="text-sm font-medium">行程</span>
        </button>
        <button 
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'expenses' ? 'bg-[#438a84] text-white' : 'text-slate-400 hover:text-[#438a84]'}`}
        >
          <CreditCard size={18} />
          <span className="text-sm font-medium">記帳</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
