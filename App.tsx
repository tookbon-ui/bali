
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CreditCard,
  CloudCheck
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

const START_DATE = '2026-02-03';

const INITIAL_ITINERARY: ItineraryItem[] = [
  { id: 'b1', date: '2026-02-03', time: '10:00', location: '桃園機場 (TPE) 出發', note: '搭乘華航/長榮直飛峇里島' },
  { id: 'b2', date: '2026-02-03', time: '15:30', location: '抵達伍拉·賴國際機場 (DPS)', note: '領取行李與辦理落地簽' },
  { id: 'b3', date: '2026-02-03', time: '18:00', location: '入住烏布森林 VILLA', note: '放鬆休息，享受叢林氣息' },
  { id: 'b4', date: '2026-02-03', time: '19:30', location: '晚餐：Naughty Nuri\'s', note: '必吃碳烤豬肋排' },
  { id: 'b5', date: '2026-02-04', time: '09:00', location: '德哥拉朗梯田', note: '早起拍梯田美景' },
  { id: 'b6', date: '2026-02-04', time: '14:00', location: '聖泉寺', note: '體驗當地洗禮文化' },
  { id: 'b7', date: '2026-02-05', time: '16:00', location: '海神廟夕陽', note: '海邊斷崖絕景' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'expenses'>('itinerary');
  const [selectedDate, setSelectedDate] = useState<string>(START_DATE);
  const [lastSaved, setLastSaved] = useState<string>('');
  
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('bali_2026_members');
    return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
  });
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    const saved = localStorage.getItem('bali_2026_itinerary');
    return saved ? JSON.parse(saved) : INITIAL_ITINERARY;
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('bali_2026_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bali_2026_members', JSON.stringify(members));
    localStorage.setItem('bali_2026_itinerary', JSON.stringify(itinerary));
    localStorage.setItem('bali_2026_expenses', JSON.stringify(expenses));
    
    const now = new Date();
    setLastSaved(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
  }, [members, itinerary, expenses]);

  return (
    <div className="min-h-screen pb-24 text-slate-800 bg-[#f4f7f6]">
      <header className="bg-white px-6 pt-12 pb-6 shadow-sm rounded-b-[40px]">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#2d5a57]">2026 峇里島之旅</h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-light flex items-center gap-1">
              Bali Adventure • <span className="text-[#438a84] font-medium">已儲存 {lastSaved}</span>
            </p>
          </div>
          <div className="bg-[#438a84]/10 p-2 rounded-full text-[#438a84]">
            <CloudCheck size={20} />
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
