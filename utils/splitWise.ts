
import { Expense, Member, Settlement, Currency } from '../types';

// 假設匯率：1 TWD = 500 IDR (大約值)
const EXCHANGE_RATE = 500;

/**
 * 計算分帳。
 */
export const calculateSettlements = (
  expenses: Expense[], 
  members: Member[], 
  displayCurrency: Currency = 'IDR'
): Settlement[] => {
  const balances: Record<string, number> = {};
  
  members.forEach(m => balances[m.id] = 0);

  expenses.forEach(exp => {
    // 轉換為台幣統一計算
    const amountInTWD = exp.currency === 'TWD' ? exp.amount : exp.amount / EXCHANGE_RATE;
    balances[exp.payerId] += amountInTWD;

    const share = amountInTWD / exp.participantIds.length;
    exp.participantIds.forEach(pId => {
      balances[pId] -= share;
    });
  });

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
    
    const settleAmountInTWD = Math.min(debtor.amount, creditor.amount);
    
    if (settleAmountInTWD > 0.01) {
      const finalAmount = displayCurrency === 'TWD' 
        ? Math.round(settleAmountInTWD) 
        : Math.round(settleAmountInTWD * EXCHANGE_RATE);

      if (finalAmount > 0) {
        settlements.push({
          from: debtor.id,
          to: creditor.id,
          amount: finalAmount,
          currency: displayCurrency
        });
      }
    }

    debtor.amount -= settleAmountInTWD;
    creditor.amount -= settleAmountInTWD;

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return settlements;
};
