export type TravelCurrency = "KRW" | "JPY" | "USD" | "EUR" | "VND" | "THB";

export interface TravelMember {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
}

export type TripStatus = "upcoming" | "active" | "completed";

export interface TravelTrip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  baseCurrency: TravelCurrency;
  emoji: string;
  status: TripStatus;
  members: TravelMember[];
}

export interface TravelSpending {
  id: string;
  tripId: string;
  date: string;
  amountKrw: number;
  amountLocal: number;
  localCurrency: TravelCurrency;
  exchangeRate: number;
  payerId: string;
  category: string;
  memo: string;
  splitMemberIds: string[]; // N분의 1 대상들
  isExcludedFromSettlement: boolean; // 정산 제외 여부
}

export interface SettlementResult {
  from: string;
  to: string;
  amount: number;
}
