
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
  payerId: string;
  participantIds: string[];
  date: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
}
