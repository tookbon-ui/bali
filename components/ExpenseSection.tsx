
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Users, DollarSign, Wallet, ArrowRight, CreditCard } from 'lucide-react';
import { Expense, Member, Settlement } from '../types';
import { calculateSettlements } from '../utils/splitWise';

interface Props {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

const ExpenseSection: React.FC<Props> = ({ expenses, setExpenses, members, setMembers }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    payerId: members[0]?.id || '',
    participantIds: members.map(m => m.id)
  });

  const settlements = useMemo(() => calculateSettlements(expenses, members), [expenses, members]);

  const handleAdd = () => {
    if (!newExpense.description || !newExpense.amount) return;
    const expense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      payerId: newExpense.payerId,
      participantIds: newExpense.participantIds,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([...expenses, expense]);
    setIsAdding(false);
    setNewExpense({
      ...newExpense,
      description: '',
      amount: ''
    });
  };

  const toggleParticipant = (id: string) => {
    const current = newExpense.participantIds;
    if (current.includes(id)) {
      setNewExpense({ ...newExpense, participantIds: current.filter(p => p !== id) });
    } else {
      setNewExpense({ ...newExpense, participantIds: [...current, id] });
    }
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="bg-[#2d5a57] p-6 rounded-[32px] text-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet size={120} />
        </div>
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <DollarSign size={20} />
          記帳匯總
        </h2>
        {settlements.length === 0 ? (
          <p className="text-emerald-100/60 text-sm font-light">目前暫無記帳紀錄</p>
        ) : (
          <div className="space-y-4">
            {settlements.map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="font-bold">{members.find(m => m.id === s.from)?.name}</span>
                  <ArrowRight size={14} className="text-emerald-300" />
                  <span className="font-bold">{members.find(m => m.id === s.to)?.name}</span>
                </div>
                <span className="text-lg font-black text-emerald-300">Rp {s.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-bold text-[#2d5a57]">開支明細</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 bg-[#438a84] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">項目名稱</label>
              <input 
                placeholder="例如：晚餐、按摩費、車資..."
                value={newExpense.description}
                onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full bg-[#f4f7f6] p-3 rounded-xl focus:ring-2 focus:ring-[#438a84] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">金額 (Rp)</label>
                <input 
                  type="number"
                  placeholder="0"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full bg-[#f4f7f6] p-3 rounded-xl focus:ring-2 focus:ring-[#438a84] outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">付款人</label>
                <select 
                  value={newExpense.payerId}
                  onChange={e => setNewExpense({...newExpense, payerId: e.target.value})}
                  className="w-full bg-[#f4f7f6] p-3 rounded-xl focus:ring-2 focus:ring-[#438a84] outline-none appearance-none"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-2 block">費用分攤成員</label>
              <div className="flex flex-wrap gap-2">
                {members.map(m => (
                  <button
                    key={m.id}
                    onClick={() => toggleParticipant(m.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                      newExpense.participantIds.includes(m.id)
                        ? 'bg-[#438a84] text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
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
              記錄開支
            </button>
          </div>
        </div>
      )}

      {expenses.length === 0 && !isAdding ? (
        <div className="text-center py-20">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CreditCard size={32} className="text-[#438a84]/30" />
          </div>
          <p className="text-slate-400 font-light">目前還沒有任何開支紀錄。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expenses.slice().reverse().map((exp) => (
            <div key={exp.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-50 flex items-center justify-between group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-tighter bg-emerald-100 text-[#438a84] px-2 py-0.5 rounded-md">
                    {members.find(m => m.id === exp.payerId)?.name} 付款
                  </span>
                  <span className="text-[10px] text-slate-300">{exp.date}</span>
                </div>
                <h3 className="text-base font-bold text-[#2d5a57]">{exp.description}</h3>
                <div className="flex items-center gap-1 mt-1">
                   <Users size={12} className="text-slate-300" />
                   <span className="text-[10px] text-slate-400">
                     {exp.participantIds.length} 位分攤
                   </span>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div className="text-lg font-black text-[#438a84]">
                  Rp {exp.amount.toLocaleString()}
                </div>
                <button 
                  onClick={() => handleDelete(exp.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-200 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseSection;
