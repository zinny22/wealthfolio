"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

export function SummaryCard() {
  const { transactions, selectedCategoryIds } = useTransactionStore();
  const now = new Date();
  const currentMonth = format(now, "yyyy-MM");

  const monthlyTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth) && (selectedCategoryIds.length === 0 || selectedCategoryIds.includes(t.categoryId))
  );

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 gap-4 mb-4">
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#f2f4f6] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-3xl" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-bold text-[#8b95a1] flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5" />
            {format(now, "yyyy년 M월", { locale: ko })} 소비 요약
          </span>
          <h2 className="text-2xl font-black text-[#191f28] mt-0.5">
            {balance.toLocaleString()}원
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-[#f2f4f6]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-[#adb5bd] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-income" /> 수입
            </span>
            <span className="text-base font-black text-income">
              +{totalIncome.toLocaleString()}원
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-[#adb5bd] flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-expense" /> 지출
            </span>
            <span className="text-base font-black text-expense">
              -{totalExpense.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
