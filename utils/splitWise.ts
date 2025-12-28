
import { Expense, Member, Settlement } from '../types';

/**
 * Calculates who owes whom and how much based on a list of expenses and members.
 * This implementation uses a simplified approach to minimize transactions.
 */
export const calculateSettlements = (expenses: Expense[], members: Member[]): Settlement[] => {
  const balances: Record<string, number> = {};
  
  // Initialize balances for all members
  members.forEach(m => balances[m.id] = 0);

  // Calculate net balances
  expenses.forEach(exp => {
    // Payer gets back the total amount
    balances[exp.payerId] += exp.amount;

    // Each participant owes their share
    const share = exp.amount / exp.participantIds.length;
    exp.participantIds.forEach(pId => {
      balances[pId] -= share;
    });
  });

  // Separate debtors and creditors
  const debtors = Object.keys(balances)
    .filter(id => balances[id] < -0.01) // Use small threshold for floating point
    .map(id => ({ id, amount: Math.abs(balances[id]) }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = Object.keys(balances)
    .filter(id => balances[id] > 0.01)
    .map(id => ({ id, amount: balances[id] }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];

  // Greedy algorithm to match debtors to creditors
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    
    const settleAmount = Math.min(debtor.amount, creditor.amount);
    
    if (settleAmount > 0.01) {
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: Math.round(settleAmount)
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return settlements;
};
