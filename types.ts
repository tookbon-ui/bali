
export type Currency = 'IDR' | 'TWD';

export interface ItineraryItem {
  id: string;
  time: string;
  location: string;
  note: string;
  date: string;
}

export interface Member {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: Currency;
  payerId: string;
  participantIds: string[];
  date: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
  currency: Currency;
}
