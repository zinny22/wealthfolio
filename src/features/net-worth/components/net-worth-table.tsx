// src/features/net-worth/components/net-worth-table.tsx
"use client";

import { NetWorthSnapshot } from "../types";

interface NetWorthTableProps {
  snapshots: NetWorthSnapshot[];
}

export function NetWorthTable({ snapshots }: NetWorthTableProps) {
  if (!snapshots || snapshots.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-900 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-3 py-2">날짜</th>
            <th className="px-3 py-2">자산</th>
            <th className="px-3 py-2">부채</th>
            <th className="px-3 py-2">순자산</th>
            <th className="px-3 py-2">전월 대비</th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map((s) => (
            <tr key={s.id} className="border-t border-slate-800">
              <td className="px-3 py-2">{s.date}</td>
              <td className="px-3 py-2">{s.totalAssets.toLocaleString()} 원</td>
              <td className="px-3 py-2">
                {s.totalLiabilities.toLocaleString()} 원
              </td>
              <td className="px-3 py-2 font-semibold">
                {s.netWorth.toLocaleString()} 원
              </td>
              <td className="px-3 py-2">
                {s.momChangeAmount >= 0 ? "+" : ""}
                {s.momChangeAmount.toLocaleString()} 원 (
                {s.momChangeRate > 0 ? "+" : ""}
                {s.momChangeRate.toFixed(2)}%)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
