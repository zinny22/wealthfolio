import { TravelCurrency } from "./travel";

export interface CountryInfo {
  name: string;
  currency: TravelCurrency;
  emoji: string;
}

export const COUNTRIES: CountryInfo[] = [
  { name: "일본", currency: "JPY", emoji: "🇯🇵" },
  { name: "미국", currency: "USD", emoji: "🇺🇸" },
  { name: "베트남", currency: "VND", emoji: "🇻🇳" },
  { name: "태국", currency: "THB", emoji: "🇹🇭" },
  { name: "유럽 (대표)", currency: "EUR", emoji: "🇪🇺" },
  { name: "대한민국", currency: "KRW", emoji: "🇰🇷" },
  { name: "대만", currency: "TWD" as any, emoji: "🇹🇼" },
  { name: "홍콩", currency: "HKD" as any, emoji: "🇭🇰" },
];
