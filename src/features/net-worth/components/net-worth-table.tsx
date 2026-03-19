// src/features/net-worth/components/net-worth-table.tsx
"use client";

import { Card } from "@/components/ui/card";
import { NetWorthSnapshot } from "../types";

interface NetWorthTableProps {
  snapshots: NetWorthSnapshot[];
}

export function NetWorthTable({ snapshots }: NetWorthTableProps) {
  if (!snapshots || snapshots.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[24px]">
      <div className="overflow-x-auto px-4">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white border-b border-[#f2f4f6]">
            <tr>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider">기준일</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider text-right">총 자산</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider text-right">총 부채</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider text-right">순자산</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider text-right">전월 대비</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f6]">
            {[...snapshots].reverse().map((s) => (
              <tr
                key={s.id}
                className="hover:bg-[#f9fafb] transition-colors group"
              >
                <td className="px-6 py-5 font-mono-num text-[#8b95a1] font-medium">
                  {s.date}
                </td>
                <td className="px-6 py-5 text-right font-mono-num text-[#191f28] font-semibold">
                  {s.totalAssets.toLocaleString()}
                </td>
                <td className="px-6 py-5 text-right font-mono-num text-[#f04452] font-semibold opacity-80">
                  {s.totalLiabilities.toLocaleString()}
                </td>
                <td className="px-6 py-5 text-right font-bold font-mono-num text-[#191f28] text-lg">
                  {s.netWorth.toLocaleString()}
                </td>
                <td className="px-6 py-5 text-right">
                  <span
                    className={`font-mono-num font-bold ${
                      s.momChangeAmount >= 0
                        ? "text-[#3182f6]"
                        : "text-[#f04452]"
                    }`}
                  >
                    {s.momChangeAmount >= 0 ? "+" : ""}
                    {s.momChangeAmount.toLocaleString()}
                  </span>
                  <span className="ml-2 text-[10px] text-[#8b95a1] font-bold font-mono-num">
                    ({s.momChangeRate > 0 ? "+" : ""}
                    {s.momChangeRate.toFixed(1)}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
