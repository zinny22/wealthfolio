// src/features/net-worth/components/net-worth-summary.tsx
"use client";

import { NetWorthSnapshot } from "../types";

interface NetWorthSummaryProps {
  snapshots: NetWorthSnapshot[];
}

export function NetWorthSummary({ snapshots }: NetWorthSummaryProps) {
  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="rounded-lg bg-slate-900 p-4 text-sm text-slate-400">
        데이터가 없습니다. (나중에 DB 연결 예정)
      </div>
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
    <div className="space-y-3 rounded-lg bg-slate-900 p-4 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-400">기준일</span>
        <span className="font-medium">{latest.date}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">자산 / 부채</span>
        <span>
          {latest.totalAssets.toLocaleString()} /{" "}
          {latest.totalLiabilities.toLocaleString()} 원
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">순자산</span>
        <span className="font-semibold">
          {latest.netWorth.toLocaleString()} 원
        </span>
      </div>
      {prev && (
        <div className="flex justify-between">
          <span className="text-slate-400">전월 대비</span>
          <span
            className={
              direction === "up"
                ? "text-emerald-400"
                : direction === "down"
                ? "text-red-400"
                : "text-slate-300"
            }
          >
            {latest.momChangeAmount >= 0 ? "+" : ""}
            {latest.momChangeAmount.toLocaleString()} 원 (
            {latest.momChangeRate > 0 ? "+" : ""}
            {latest.momChangeRate.toFixed(2)}%)
          </span>
        </div>
      )}
    </div>
  );
}
