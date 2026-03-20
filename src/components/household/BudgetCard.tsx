"use client";

import React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface BudgetCardProps {
  budget: number;
  spent: number;
  income: number;
  label?: string;
  isMonthMode?: boolean;
  currentDate?: Date;
}

export default function BudgetCard({ 
  budget, 
  spent, 
  income, 
  label = "소비요약",
  isMonthMode = true,
  currentDate = new Date()
}: BudgetCardProps) {
  // 기준을 예산에서 수입(income)으로 변경. 수입이 0이거나 없을 경우 예산(budget)을 기준으로 사용
  const baseValue = income > 0 ? income : budget;
  const percent = Math.min(Math.round((spent / baseValue) * 100), 100);

  return (
    <section className="px-7 py-3">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 transition-all active:scale-[0.99] shadow-sm border border-slate-50 dark:border-slate-800">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-[16px] font-bold tracking-tight text-foreground opacity-80">
              {format(currentDate, isMonthMode ? "M월 " : "M월 ", { locale: ko })}소비요약
            </h2>
            <span className="text-[11px] font-bold text-slate-300 px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-full">
              {isMonthMode ? "이번 달" : "이번 주"}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col gap-0.5 flex-1">
              <p className="text-[11px] font-bold text-slate-400">지출</p>
              <h3 className="text-[20px] font-extrabold tracking-tighter text-foreground">
                {spent.toLocaleString()}<span className="text-sm ml-0.5">원</span>
              </h3>
            </div>
            <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 self-center opacity-50" />
            <div className="flex flex-col gap-0.5 flex-1 text-right">
              <p className="text-[11px] font-bold text-slate-400">수입</p>
              <h3 className="text-[20px] font-extrabold tracking-tighter text-primary">
                {income.toLocaleString()}<span className="text-sm ml-0.5">원</span>
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-bold text-slate-400">수입 대비 지출율</span>
              <span className="text-[13px] font-extrabold text-foreground">{percent}%</span>
            </div>
            <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  percent > 90 ? "bg-rose-400" : "bg-primary"
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
