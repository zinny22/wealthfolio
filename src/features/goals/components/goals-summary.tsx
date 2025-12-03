// src/features/goals/components/goals-summary.tsx
"use client";

import { GoalYearRow } from "../types";

interface GoalsSummaryProps {
  goals: GoalYearRow[];
}

export function GoalsSummary({ goals }: GoalsSummaryProps) {
  if (!goals || goals.length === 0) {
    return (
      <div className="rounded-lg bg-slate-900 p-4 text-sm text-slate-400">
        목표 데이터가 없습니다.
      </div>
    );
  }

  const total = goals.reduce((sum, g) => sum + g.totalNeeded, 0);
  const firstYear = goals[0].year;
  const lastYear = goals[goals.length - 1].year;

  const maxRow = goals.reduce((max, g) =>
    g.totalNeeded > max.totalNeeded ? g : max
  );

  return (
    <div className="space-y-3 rounded-lg bg-slate-900 p-4 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-400">기간</span>
        <span>
          {firstYear} ~ {lastYear}년
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">총 필요 자금</span>
        <span className="font-semibold">{total.toLocaleString()} 원</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">가장 큰 지출 연도</span>
        <span>
          {maxRow.year}년 (약 {maxRow.totalNeeded.toLocaleString()} 원)
        </span>
      </div>
    </div>
  );
}
