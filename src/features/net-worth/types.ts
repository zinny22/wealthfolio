// src/features/net-worth/types.ts
export interface NetWorthSnapshot {
  id: number;
  date: string; // ISO string 또는 'YYYY-MM-DD'
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  momChangeAmount: number;
  momChangeRate: number; // %
}
