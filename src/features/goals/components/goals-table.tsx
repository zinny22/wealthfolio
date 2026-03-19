// src/features/goals/components/goals-table.tsx
"use client";

import { Card } from "@/components/ui/card";
import { GoalYearRow } from "../types";

interface GoalsTableProps {
  goals: GoalYearRow[];
}

export function GoalsTable({ goals }: GoalsTableProps) {
  if (!goals || goals.length === 0) return null;

  return (
    <Card className="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[24px]">
      <div className="overflow-x-auto px-4">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white border-b border-[#f2f4f6]">
            <tr>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider">연도</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider">나이</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider text-right">주거</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider text-right">차량</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider text-right">교육</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider text-right">가족</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider text-right">기타</th>
              <th className="px-6 py-5 text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider text-right">연간 합계</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f6]">
            {goals.map((g) => (
              <tr
                key={g.id}
                className="hover:bg-[#f9fafb] transition-colors group"
              >
                <td className="px-6 py-5 font-mono-num text-[#8b95a1] font-bold">
                  {g.year}
                </td>
                <td className="px-6 py-5 font-mono-num text-[#4e5968] font-medium">
                  {g.age}세
                </td>
                <td className="px-6 py-5 text-right font-mono-num text-[#8b95a1] font-medium">
                  {g.house > 0 ? g.house.toLocaleString() : "-"}
                </td>
                <td className="px-6 py-5 text-right font-mono-num text-[#8b95a1] font-medium">
                  {g.car > 0 ? g.car.toLocaleString() : "-"}
                </td>
                <td className="px-6 py-5 text-right font-mono-num text-[#8b95a1] font-medium">
                  {g.education > 0 ? g.education.toLocaleString() : "-"}
                </td>
                <td className="px-6 py-5 text-right font-mono-num text-[#8b95a1] font-medium">
                  {g.familyExpense > 0 ? g.familyExpense.toLocaleString() : "-"}
                </td>
                <td className="px-6 py-5 text-right font-mono-num text-[#8b95a1] font-medium">
                  {g.etc > 0 ? g.etc.toLocaleString() : "-"}
                </td>
                <td className="px-6 py-5 text-right font-bold font-mono-num text-[#191f28] text-lg">
                  ₩ {g.totalNeeded.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
