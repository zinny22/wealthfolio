// src/features/net-worth/mock.ts

import { NetWorthSnapshot } from "./types";

export function getMockNetWorthSnapshots(): NetWorthSnapshot[] {
  return [
    {
      id: 1,
      date: "2024-01-31",
      totalAssets: 350_000_000,
      totalLiabilities: 80_000_000,
      netWorth: 270_000_000,
      momChangeAmount: 0,
      momChangeRate: 0,
    },
    {
      id: 2,
      date: "2024-02-29",
      totalAssets: 360_000_000,
      totalLiabilities: 78_000_000,
      netWorth: 282_000_000,
      momChangeAmount: 12_000_000,
      momChangeRate: 4.4,
    },
    {
      id: 3,
      date: "2024-03-31",
      totalAssets: 372_000_000,
      totalLiabilities: 77_000_000,
      netWorth: 295_000_000,
      momChangeAmount: 13_000_000,
      momChangeRate: 4.6,
    },
    {
      id: 4,
      date: "2024-04-30",
      totalAssets: 388_000_000,
      totalLiabilities: 76_000_000,
      netWorth: 312_000_000,
      momChangeAmount: 17_000_000,
      momChangeRate: 5.8,
    },
    {
      id: 5,
      date: "2024-05-31",
      totalAssets: 400_000_000,
      totalLiabilities: 75_000_000,
      netWorth: 325_000_000,
      momChangeAmount: 13_000_000,
      momChangeRate: 4.2,
    },
  ];
}
