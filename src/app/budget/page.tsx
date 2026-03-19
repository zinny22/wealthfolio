"use client";

import { useState, useMemo } from "react";
import { format, subMonths, startOfMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { useTransactionStore } from "@/store/useTransactionStore";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Plus, ChevronRight, Target, Flame } from "lucide-react";
import * as Icons from "lucide-react";

export default function BudgetPage() {
  const { budgets, categories, transactions, setBudget, copyBudget } = useTransactionStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStr = format(currentMonth, "yyyy-MM");
  const prevMonthStr = format(subMonths(currentMonth, 1), "yyyy-MM");

  const monthlyBudgets = useMemo(() => 
    budgets.filter(b => b.month === monthStr),
    [budgets, monthStr]
  );

  const totalBudget = useMemo(() => 
    monthlyBudgets.reduce((sum, b) => sum + b.amount, 0),
    [monthlyBudgets]
  );

  const handleCopyPrev = () => {
    if (confirm("지난달 예산을 이번 달로 복사하시겠습니까?")) {
      copyBudget(prevMonthStr, monthStr);
    }
  };

  const currentMonthExpenses = useMemo(() => 
    transactions.filter(t => t.date.startsWith(monthStr) && t.type === 'expense'),
    [transactions, monthStr]
  );

  const getExpenseByCategory = (catId: string) => {
    return currentMonthExpenses
      .filter(t => t.categoryId === catId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 pb-32"
    >
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#f2f4f6] relative overflow-hidden">
        <div className="flex flex-col gap-0.5 mb-3">
           <span className="text-[12px] font-bold text-[#8b95a1] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-primary" /> {format(currentMonth, "yyyy년 M월")} 예산
           </span>
           <h2 className="text-2xl font-black text-[#191f28]">
             {totalBudget.toLocaleString()}원
           </h2>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={handleCopyPrev}
             className="flex items-center gap-1.5 px-3.5 py-2 bg-[#f2f4f6] text-[#4e5968] rounded-xl text-[12px] font-bold hover:bg-[#e5e8eb] transition-all"
           >
             <Copy size={14} /> 지난달 복사
           </button>
        </div>
        
        {/* 전체 예산 진행률 바 */}
        <div className="mt-6 flex flex-col gap-1.5">
           <div className="flex justify-between items-end text-[10px] font-bold text-[#adb5bd]">
              <span>예산 대비 총 소비</span>
              <span className="text-[#191f28]">{((currentMonthExpenses.reduce((s, t) => s + t.amount, 0) / (totalBudget || 1)) * 100).toFixed(1)}%</span>
           </div>
           <div className="h-2 w-full bg-[#f2f4f6] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((currentMonthExpenses.reduce((s, t) => s + t.amount, 0) / (totalBudget || 1)) * 100, 100)}%` }}
                className="h-full bg-primary rounded-full"
              />
           </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
           <h4 className="text-[17px] font-black text-[#191f28]">카테고리별 예산</h4>
        </div>

        <AnimatePresence mode="popLayout">
          {categories.slice(0, 7).map((cat, index) => {
            const budget = monthlyBudgets.find(b => b.categoryId === cat.id);
            const expense = getExpenseByCategory(cat.id);
            const progress = budget ? (expense / budget.amount) * 100 : 0;
            const isOver = progress > 100;

            // @ts-ignore
            const IconComp = cat?.icon ? (Icons[cat.icon as keyof typeof Icons] as any) : Icons.MoreHorizontal;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-4 rounded-3xl shadow-sm border border-[#f2f4f6] group flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${cat.color} opacity-80 group-hover:opacity-100 transition-opacity border border-black/5`}>
                      <IconComp size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[#191f28]">{cat.name}</span>
                      <span className="text-[11px] font-semibold text-[#adb5bd]">
                        {budget ? `${budget.amount.toLocaleString()}원` : "예산 미설정"}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const val = prompt(`${cat.name} 예산 설정 (원)`, budget?.amount.toString() || "0");
                      if (val !== null) setBudget(monthStr, cat.id, parseInt(val));
                    }}
                    className="p-1.5 text-[#adb5bd] hover:text-[#3182f6] hover:bg-[#3182f61a] rounded-full transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {budget && (
                  <div className="flex flex-col gap-1.5">
                    <div className="h-1.5 w-full bg-[#f2f4f6] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        className={`h-full rounded-full ${isOver ? 'bg-expense' : 'bg-success'}`}
                        style={{ backgroundColor: isOver ? undefined : '#4ade80' }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className={`${isOver ? 'text-expense' : 'text-[#8b95a1]'}`}>
                         {isOver ? '예산 초과!' : `남은 ${(budget.amount - expense).toLocaleString()}원`}
                       </span>
                       <span className="text-[#191f28]">{progress.toFixed(0)}%</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
