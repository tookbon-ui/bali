
import { Expense, Member, Settlement, Currency } from '../types';

// 固定匯率：1 TWD = 500 IDR (大約值，方便計算)
const EXCHANGE_RATE = 500;

/**
 * 計算誰該給誰錢。
 * 所有金額會先轉換成 IDR 進行內部計算，最後再轉回指定的顯示幣別。
 */
export const calculateSettlements = (
  expenses: Expense[], 
  members: Member[], 
  displayCurrency: Currency = 'IDR'
): Settlement[] => {
  const balances: Record<string, number> = {};
  
  // 初始化所有成員餘額
  members.forEach(m => balances[m.id] = 0);

  // 計算淨餘額（統一轉換為 IDR）
  expenses.forEach(exp => {
    const amountInIDR = exp.currency === 'IDR' ? exp.amount : exp.amount * EXCHANGE_RATE;
    
    // 付款人獲得該總額
    balances[exp.payerId] += amountInIDR;

    // 每個參與者分攤
    const share = amountInIDR / exp.participantIds.length;
    exp.participantIds.forEach(pId => {
      balances[pId] -= share;
    });
  });

  // 區分債務人與債權人
  const debtors = Object.keys(balances)
    .filter(id => balances[id] < -0.01)
    .map(id => ({ id, amount: Math.abs(balances[id]) }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = Object.keys(balances)
    .filter(id => balances[id] > 0.01)
    .map(id => ({ id, amount: balances[id] }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    
    const settleAmountInIDR = Math.min(debtor.amount, creditor.amount);
    
    if (settleAmountInIDR > 0.01) {
      // 轉換回顯示幣別
      const finalAmount = displayCurrency === 'IDR' 
        ? Math.round(settleAmountInIDR) 
        : Math.round(settleAmountInIDR / EXCHANGE_RATE);

      if (finalAmount > 0) {
        settlements.push({
          from: debtor.id,
          to: creditor.id,
          amount: finalAmount,
          currency: displayCurrency
        });
      }
    }

    debtor.amount -= settleAmountInIDR;
    creditor.amount -= settleAmountInIDR;

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return settlements;
};
