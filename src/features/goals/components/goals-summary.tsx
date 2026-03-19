// src/features/goals/components/goals-summary.tsx
"use client";

import { Card } from "@/components/ui/card";
import { GoalYearRow } from "../types";

interface GoalsSummaryProps {
  goals: GoalYearRow[];
}

export function GoalsSummary({ goals }: GoalsSummaryProps) {
  if (!goals || goals.length === 0) {
    return (
      <Card className="p-8 text-center text-[#8b95a1] font-medium border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        목표 데이터가 없습니다.
      </Card>
    );
  }

  const total = goals.reduce((sum, g) => sum + g.totalNeeded, 0);
  const firstYear = goals[0].year;
  const lastYear = goals[goals.length - 1].year;

  const maxRow = goals.reduce((max, g) =>
    g.totalNeeded > max.totalNeeded ? g : max
  );

  return (
    <Card className="p-8 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#8b95a1]">전체 필요 예산 ({firstYear} ~ {lastYear})</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-[#191f28] tracking-tight font-mono-num">
              ₩ {total.toLocaleString()}
            </h2>
            <span className="text-sm text-[#8b95a1]">KRW</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-2.5 bg-[#f2f4f6] rounded-2xl group-hover:bg-[#3182f61a] transition-all">
          <span className="text-[11px] font-bold text-[#8b95a1] tracking-wider uppercase">최대 지출 연도</span>
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-[#191f28] font-mono-num">{maxRow.year} ({maxRow.age}세)</span>
            <span className="text-[10px] font-bold text-[#3182f6] font-mono-num">₩ {maxRow.totalNeeded.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-[#f2f4f6]">
         <div className="w-full h-3 bg-[#f2f4f6] rounded-full overflow-hidden mb-6">
            <div className="h-full w-[15%] bg-[#3182f6] rounded-full transition-all duration-1000" />
         </div>
         <p className="text-xs font-bold text-[#3182f6]">현재 목표의 약 15%를 준비 중입니다 (예시)</p>
      </div>
    </Card>
  );
}
