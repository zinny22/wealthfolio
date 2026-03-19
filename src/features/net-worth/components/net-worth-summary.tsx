// src/features/net-worth/components/net-worth-summary.tsx
"use client";

import { Card } from "@/components/ui/card";
import { NetWorthSnapshot } from "../types";

interface NetWorthSummaryProps {
  snapshots: NetWorthSnapshot[];
}

export function NetWorthSummary({ snapshots }: NetWorthSummaryProps) {
  if (!snapshots || snapshots.length === 0) {
    return (
      <Card className="p-8 text-center text-[#8b95a1] font-medium border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        데이터가 없습니다.
      </Card>
    );
  }

  const latest = snapshots[snapshots.length - 1];
  const prev = snapshots[snapshots.length - 2];

  const direction =
    latest.momChangeAmount > 0
      ? "up"
      : latest.momChangeAmount < 0
      ? "down"
      : "flat";

  return (
    <Card className="p-8 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#8b95a1]">현재 순자산 ({latest.date})</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-[#191f28] tracking-tight font-mono-num">
              ₩ {latest.netWorth.toLocaleString()}
            </h2>
            <span className="text-sm text-[#8b95a1]">KRW</span>
          </div>
        </div>
        
        {prev && (
          <div className="flex items-center gap-2 px-6 y-2 bg-[#f2f4f6] rounded-2xl group-hover:bg-[#3182f61a] transition-all py-2.5">
            <span className="text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider">전월 대비</span>
            <span
              className={`font-mono-num font-bold text-sm ${
                direction === "up"
                  ? "text-[#3182f6]"
                  : direction === "down"
                  ? "text-[#f04452]"
                  : "text-[#8b95a1]"
              }`}
            >
              {latest.momChangeAmount >= 0 ? "+" : ""}
              {latest.momChangeAmount.toLocaleString()} ({latest.momChangeRate > 0 ? "+" : ""}{latest.momChangeRate.toFixed(2)}%)
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 pt-8 border-t border-[#f2f4f6]">
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider">총 자산</p>
          <p className="text-2xl font-bold text-[#191f28] font-mono-num">₩ {latest.totalAssets.toLocaleString()}</p>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider">총 부채</p>
          <p className="text-2xl font-bold text-[#f04452] font-mono-num">₩ {latest.totalLiabilities.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
}
