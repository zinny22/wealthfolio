"use client";

import { useState, useMemo } from "react";
import { format, subMonths } from "date-fns";
import { useTransactionStore, Category } from "@/store/useTransactionStore";
import { motion } from "framer-motion";
import { 
  Copy, 
  Target, 
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  AlertCircle,
  Pencil,
  Check,
  TrendingUp,
  Flame,
  Wallet
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ModernBottomSheet } from "@/components/shared/ModernBottomSheet";

export default function BudgetPage() {
  const { budgets, categories, transactions, setBudget, copyBudget } = useTransactionStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Modals state
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string, amount: number} | null>(null);

  const monthStr = format(currentMonth, "yyyy-MM");
  const prevMonthStr = format(subMonths(currentMonth, 1), "yyyy-MM");

  // Summary Data
  const monthlyBudgets = useMemo(() => 
    budgets.filter(b => b.month === monthStr),
    [budgets, monthStr]
  );

  const prevBudgets = useMemo(() => 
    budgets.filter(b => b.month === prevMonthStr),
    [budgets, prevMonthStr]
  );

  const totalBudget = useMemo(() => 
    monthlyBudgets.reduce((sum, b) => sum + b.amount, 0),
    [monthlyBudgets]
  );
  
  const totalPrevBudget = useMemo(() => 
    prevBudgets.reduce((sum, b) => sum + b.amount, 0),
    [prevBudgets]
  );

  const currentMonthExpenses = useMemo(() => 
    transactions.filter(t => t.date.startsWith(monthStr) && t.type === 'expense'),
    [transactions, monthStr]
  );

  const totalSpent = currentMonthExpenses.reduce((s, t) => s + t.amount, 0);
  const remainingTotal = totalBudget - totalSpent;
  const totalProgress = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const handleConfirmCopy = () => {
    copyBudget(prevMonthStr, monthStr);
    setIsCopyModalOpen(false);
  };

  const saveCategoryBudget = (amount: number) => {
    if (editingCategory) {
      setBudget(monthStr, editingCategory.id, amount);
      setEditingCategory(null);
    }
  };

  return (
    <div className="flex flex-col space-y-6 pb-24 animate-in fade-in slide-in-from-top-4 duration-500 max-w-[700px] mx-auto relative px-4 sm:px-0">
      {/* Header - Simple and Clean */}
      <header className="flex items-center justify-between py-4 border-b border-[#f2f4f6]">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-[#f2f4f6] rounded-full text-[#adb5bd] transition-all"
          >
            <ChevronLeft size={18} strokeWidth={3} />
          </button>
          <h2 className="text-[17px] font-black text-[#191f28] tabular-nums">{format(currentMonth, "yyyy. MM")}</h2>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className="p-1.5 hover:bg-[#f2f4f6] rounded-full text-[#adb5bd] transition-all"
          >
            <ChevronRightIcon size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="flex items-center gap-2">
           <button 
              onClick={() => setIsCopyModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f2f4f6] text-[#4e5968] rounded-full text-[12px] font-black transition-all hover:bg-primary/10 hover:text-primary"
           >
              <Copy size={13} /> 지난달 복사
           </button>
        </div>
      </header>

      {/* Main Summary Card */}
      <div className="bg-white rounded-5xl p-8 shadow-sm border border-[#f2f4f6] space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <Target size={120} strokeWidth={1} />
        </div>
        
        <div className="text-center space-y-1 relative z-10">
           <span className="text-[11px] font-bold text-[#adb5bd] tracking-widest uppercase">Remaining Budget</span>
           <h3 className={`text-4xl font-black transition-colors ${remainingTotal < 0 ? 'text-expense' : 'text-[#191f28]'}`}>
              {remainingTotal.toLocaleString()}원
           </h3>
           <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-[14px] font-black text-primary/70">목표: {totalBudget.toLocaleString()}원</span>
           </div>
        </div>
        
        <div className="space-y-4">
           <div className="relative flex flex-col gap-2 px-2">
              <div className="h-4 w-full bg-[#f2f4f6] rounded-full overflow-hidden flex">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${totalProgress}%` }} 
                   className={`h-full transition-all duration-500 rounded-full ${totalProgress > 90 ? 'bg-expense' : 'bg-primary'}`}
                 />
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold">
                 <span className={totalProgress > 90 ? 'text-expense' : 'text-primary'}>{totalProgress.toFixed(1)}% 사용 중</span>
                 <span className="text-[#adb5bd]">총 예산 기준</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 pt-5 border-t border-[#f2f4f6]">
              <div className="flex flex-col gap-1">
                 <span className="text-[11px] font-bold text-[#adb5bd]">총 지출</span>
                 <span className="text-[17px] font-black text-[#4e5968]">{totalSpent.toLocaleString()}원</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-[#f2f4f6] pl-4">
                 <span className="text-[11px] font-bold text-[#adb5bd]">하루 권장</span>
                 <span className="text-[17px] font-black text-income">
                    {remainingTotal > 0 ? Math.floor(remainingTotal/15).toLocaleString() : 0}원
                 </span>
              </div>
           </div>
        </div>
      </div>

      {/* Category Budget Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
           <h4 className="text-[16px] font-black text-[#191f28]">카테고리별 예산</h4>
        </div>

        <div className="bg-white rounded-5xl shadow-sm border border-[#f2f4f6] overflow-hidden mb-12">
           <div className="divide-y divide-[#f9fafb]">
              {categories.map((cat: Category) => {
                 const budgetItem = monthlyBudgets.find(b => b.categoryId === cat.id);
                 const budgetAmount = budgetItem?.amount || 0;
                 const spent = transactions
                    .filter(t => t.categoryId === cat.id && t.date.startsWith(monthStr) && t.type === 'expense')
                    .reduce((s, t) => s + t.amount, 0);
                 const progress = budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0;
                 const isOver = spent > budgetAmount && budgetAmount > 0;

                 // @ts-ignore
                 const IconComp = LucideIcons[cat.icon] || LucideIcons.MoreHorizontal;

                 return (
                   <div key={cat.id} className="p-5 px-6 hover:bg-[#f9fafb] transition-all group relative">
                      <div className="flex items-center gap-5">
                         <div className={`w-11 h-11 rounded-2xl flex items-center justify-center grow-0 shrink-0 ${cat.color} border border-black/5 shadow-sm group-hover:scale-105 transition-transform`}>
                            <IconComp size={22} />
                         </div>
                         
                         <div className="flex-1 space-y-2.5 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                               <div className="flex flex-col">
                                  <span className="text-[15px] font-black text-[#4e5968] truncate">{cat.name}</span>
                                  <span className="text-[11px] font-bold text-[#adb5bd]">계획 {budgetAmount.toLocaleString()}원</span>
                               </div>
                               <div className="text-right">
                                  <p className={`text-[16px] font-black ${isOver ? 'text-expense' : 'text-[#191f28]'}`}>
                                     {budgetAmount > 0 ? (budgetAmount - spent).toLocaleString() + "원" : "0원"}
                                  </p>
                                  <span className="text-[10px] font-black text-[#adb5bd] uppercase">{isOver ? 'Over' : 'Left'}</span>
                               </div>
                            </div>
                            
                            <div className="relative h-2 w-full bg-[#f2f4f6] rounded-full overflow-hidden shadow-inner font-black">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${progress}%` }} 
                                 className={`h-full rounded-full ${progress > 90 ? 'bg-expense' : 'bg-primary'}`} 
                               />
                            </div>
                         </div>

                         {/* Quick Edit Button */}
                         <button 
                           onClick={() => setEditingCategory({id: cat.id, name: cat.name, amount: budgetAmount})}
                           className="p-3 bg-[#f2f4f6] text-[#adb5bd] rounded-2xl hover:bg-primary/10 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                         >
                            <Pencil size={16} />
                         </button>
                      </div>
                   </div>
                 );
              })}
           </div>
        </div>
      </div>

      {/* REUSABLE BOTTOM SHEET: Copy Preview */}
      <ModernBottomSheet
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        title="지난달 복사하기"
        description={`${format(subMonths(currentMonth, 1), "yyyy년 M월")} 예산 계획을 가져옵니다.`}
        maxWidth="500px"
        footer={
          <div className="flex gap-3">
             <button onClick={() => setIsCopyModalOpen(false)} className="flex-1 py-4.5 bg-[#f2f4f6] text-[#adb5bd] rounded-3xl font-black text-[15px]">취소</button>
             <button 
               onClick={handleConfirmCopy} 
               disabled={prevBudgets.length === 0}
               className="flex-[2] py-4.5 bg-primary text-white rounded-3xl font-black text-[15px] shadow-lg shadow-primary/20 disabled:opacity-50"
             >
                복제하기
             </button>
          </div>
        }
      >
        <div className="space-y-6 pt-2">
           <div className="bg-[#191f28] p-6 rounded-[2.5rem] flex justify-between items-center text-white shadow-xl">
              <div className="space-y-1">
                 <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest leading-none">Total Budget</span>
                 <p className="text-[24px] font-black">{totalPrevBudget.toLocaleString()}원</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                 <TrendingUp size={24} />
              </div>
           </div>

           <div className="space-y-3 pb-4">
              <p className="text-[12px] font-black text-[#adb5bd] uppercase tracking-wider ml-1">상세 내역</p>
              <div className="space-y-2.5">
                 {categories.map((cat: Category) => {
                    const prevBudget = prevBudgets.find(b => b.categoryId === cat.id);
                    if (!prevBudget) return null;
                    // @ts-ignore
                    const IconComp = LucideIcons[cat.icon] || LucideIcons.MoreHorizontal;
                    return (
                       <div key={cat.id} className="flex items-center justify-between p-4 bg-[#f9fafb] border border-[#f2f4f6] rounded-3xl">
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${cat.color} border border-black/5`}>
                                <IconComp size={16} />
                             </div>
                             <span className="text-[14px] font-bold text-[#4e5968]">{cat.name}</span>
                          </div>
                          <span className="text-[15px] font-black text-[#191f28]">{prevBudget.amount.toLocaleString()}원</span>
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </ModernBottomSheet>

      {/* REUSABLE BOTTOM SHEET: Edit Category Budget */}
      <ModernBottomSheet
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title={editingCategory?.name || "예산 수정"}
        description="해당 카테고리의 한달 목표 예산을 설정하세요."
        maxWidth="460px"
      >
        <div className="space-y-8 pt-4 pb-4">
           <div className="space-y-3">
              <div className="bg-[#f9fafb] p-8 rounded-[2.5rem] border-2 border-primary/10 flex flex-col items-center justify-center gap-2">
                 <span className="text-[11px] font-black text-primary uppercase tracking-widest">Setting Amount</span>
                 <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      autoFocus
                      defaultValue={editingCategory?.amount || 0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveCategoryBudget(Number(e.currentTarget.value));
                      }}
                      className="text-4xl font-black text-[#191f28] bg-transparent w-full text-center outline-none"
                    />
                    <span className="text-2xl font-black text-[#191f28]">원</span>
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                   const input = document.querySelector('input') as HTMLInputElement;
                   saveCategoryBudget(Number(input.value));
                }}
                className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-[16px] shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                 예산 설정 완료
              </button>
              <button 
                onClick={() => setEditingCategory(null)}
                className="w-full py-5 bg-[#f2f4f6] text-[#8b95a1] rounded-[2rem] font-black text-[16px] active:scale-95 transition-all"
              >
                 취소
              </button>
           </div>
        </div>
      </ModernBottomSheet>
    </div>
  );
}
