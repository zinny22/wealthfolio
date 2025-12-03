// src/features/goals/components/goals-table.tsx
"use client";

import { GoalYearRow } from "../types";

interface GoalsTableProps {
  goals: GoalYearRow[];
}

export function GoalsTable({ goals }: GoalsTableProps) {
  if (!goals || goals.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800 text-sm">
      <table className="min-w-full text-left">
        <thead className="bg-slate-900 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-3 py-2">연도</th>
            <th className="px-3 py-2">나이</th>
            <th className="px-3 py-2">주택</th>
            <th className="px-3 py-2">차량</th>
            <th className="px-3 py-2">교육비</th>
            <th className="px-3 py-2">가족용돈</th>
            <th className="px-3 py-2">기타</th>
            <th className="px-3 py-2">합계</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((g) => (
            <tr key={g.id} className="border-t border-slate-800">
              <td className="px-3 py-2">{g.year}</td>
              <td className="px-3 py-2">{g.age}세</td>
              <td className="px-3 py-2">{g.house.toLocaleString()}</td>
              <td className="px-3 py-2">{g.car.toLocaleString()}</td>
              <td className="px-3 py-2">{g.education.toLocaleString()}</td>
              <td className="px-3 py-2">{g.familyExpense.toLocaleString()}</td>
              <td className="px-3 py-2">{g.etc.toLocaleString()}</td>
              <td className="px-3 py-2 font-semibold">
                {g.totalNeeded.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
