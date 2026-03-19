"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Transaction } from "@/types/transaction";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DailyDetailListProps {
  date: Date | null;
  onEdit?: (t: Transaction) => void;
}

export function DailyDetailList({ date, onEdit }: DailyDetailListProps) {
  const { transactions, categories, selectedCategoryIds } = useTransactionStore();

  if (!date) return (
    <div className="mt-10 py-12 text-center text-[#adb5bd] font-semibold text-sm animate-pulse">
      날짜를 선택하면 상세 내역이 표시됩니다.
    </div>
  );

  const dateStr = format(date, "yyyy-MM-dd");
  const dailyTransactions = transactions
    .filter((t) => t.date === dateStr && (selectedCategoryIds.length === 0 || selectedCategoryIds.includes(t.categoryId)))
    .sort((a, b) => b.amount - a.amount);

  const getCategory = (id: string) => categories.find((c) => c.id === id);

  return (
    <div className="mt-8 pb-32">
      <div className="flex items-center justify-between mb-3 px-1">
        <h4 className="text-[17px] font-black text-[#191f28]">
          {format(date, "M월 d일 (E)", { locale: ko })}
        </h4>
        <span className="text-[12px] font-bold text-[#adb5bd]">
          {dailyTransactions.length}건의 기록
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#f2f4f6] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {dailyTransactions.length > 0 ? (
            dailyTransactions.map((t, index) => {
              const category = getCategory(t.categoryId);
              // @ts-ignore
              const IconComp = category?.icon ? (Icons[category.icon as keyof typeof Icons] as any) : Icons.MoreHorizontal;

              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileTap={{ backgroundColor: "#f9fafb" }}
                  onClick={() => onEdit?.(t)}
                  className={`flex items-center justify-between p-4 px-5 cursor-pointer transition-colors ${
                    index !== dailyTransactions.length - 1 ? "border-b border-[#f9fafb]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${category?.color} shadow-sm border border-black/5`}>
                      <IconComp size={18} className="opacity-90" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-[#191f28]">
                        {category?.name}
                      </span>
                      <span className="text-[11px] font-semibold text-[#adb5bd] flex items-center gap-1.5 mt-0.5">
                        {t.method === 'card' ? '카드' : '현금'}
                        {t.memo && (
                          <>
                            <span className="w-0.5 h-0.5 bg-[#e5e8eb] rounded-full" />
                            <span className="truncate max-w-[100px]">{t.memo}</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={`text-[16px] font-black ${t.type === "income" ? "text-income" : "text-expense"}`}>
                    {t.type === "income" ? "+" : ""}
                    {t.amount.toLocaleString()}원
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 text-[#adb5bd] font-bold text-sm">
              기록된 내역이 없습니다.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
