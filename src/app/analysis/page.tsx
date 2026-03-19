"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, subMonths, eachMonthOfInterval } from "date-fns";
import { ko } from "date-fns/locale";
import { useTransactionStore } from "@/store/useTransactionStore";
import { DonutChart } from "@/components/analysis/DonutChart";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Wallet, 
  PieChart, 
  CreditCard,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type AnalysisType = "expense" | "income";

export default function AnalysisPage() {
  const router = useRouter();
  const { transactions, categories } = useTransactionStore();
  const [type, setType] = useState<AnalysisType>("expense");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeSubTab, setActiveSubTab] = useState<"stats" | "budget" | "card">("stats");

  const monthStr = format(currentMonth, "yyyy-MM");
  const monthDisplay = format(currentMonth, "M월");
  const dateRangeDisplay = `${format(startOfMonth(currentMonth), "M.d")} - ${format(endOfMonth(currentMonth), "M.d")}`;

  const monthTransactions = useMemo(() => 
    transactions.filter(t => t.date.startsWith(monthStr) && t.type === type),
    [transactions, monthStr, type]
  );

  const totalAmount = useMemo(() => 
    monthTransactions.reduce((sum, t) => sum + t.amount, 0),
    [monthTransactions]
  );

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    monthTransactions.forEach(t => {
      stats[t.categoryId] = (stats[t.categoryId] || 0) + t.amount;
    });

    return Object.entries(stats)
      .map(([id, amount]) => {
        const cat = categories.find(c => c.id === id);
        return {
          id,
          name: cat?.name || "기타",
          value: amount,
          color: cat?.color.includes('orange') ? "#f97316" : 
                 cat?.color.includes('blue') ? "#3182f6" :
                 cat?.color.includes('pink') ? "#fb7185" :
                 cat?.color.includes('green') ? "#10b981" :
                 cat?.color.includes('purple') ? "#a855f7" :
                 cat?.color.includes('indigo') ? "#6366f1" : 
                 cat?.color.includes('emerald') ? "#10b981" : 
                 cat?.color.includes('yellow') ? "#facc15" : "#94a3b8",
          percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [monthTransactions, categories, totalAmount]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-50 bg-white flex flex-col pt-safe-top overflow-hidden"
    >
      {/* Detail Header */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-[#f2f4f6]/50">
        <button 
          onClick={() => router.push("/")}
          className="p-2 -ml-2 hover:bg-[#f2f4f6] rounded-full text-[#191f28] transition-all"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center">
           <span className="text-lg font-bold text-[#191f28]">{monthDisplay}</span>
           <span className="text-[10px] font-bold text-[#adb5bd]">{dateRangeDisplay}</span>
        </div>

        <div className="flex bg-[#f2f4f6] p-1 rounded-xl gap-1">
          <button 
            onClick={() => setType("expense")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${type === 'expense' ? 'bg-expense text-white shadow-sm' : 'text-[#8b95a1]'}`}
          >
            지출
          </button>
          <button 
            onClick={() => setType("income")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${type === 'income' ? 'bg-income text-white shadow-sm' : 'text-[#8b95a1]'}`}
          >
            수입
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32 space-y-12">
        {/* Summary Info */}
        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-1">
              <h3 className="text-[17px] font-black text-[#191f28]">{monthDisplay} 지출</h3>
              <p className="text-2xl font-black text-expense">{totalAmount.toLocaleString()}원</p>
           </div>
           <div className="space-y-1">
              <h3 className="text-[17px] font-black text-[#191f28]">저축</h3>
              <p className="text-2xl font-black text-[#e5e8eb]">0원</p>
              <div className="h-[2px] w-12 bg-orange-400/30" />
           </div>
        </div>

        {/* Chart View */}
        <div className="relative py-10 flex flex-col items-center justify-center">
           {categoryStats.length > 0 ? (
             <>
               <DonutChart data={categoryStats} />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
                  <span className="text-[16px] font-black text-[#adb5bd]">100%</span>
               </div>
             </>
           ) : (
             <div className="flex flex-col items-center gap-6 py-10">
                <div className="w-48 h-48 rounded-full bg-[#f2f4f6] flex items-center justify-center relative">
                   <div className="w-20 h-20 rounded-full bg-white shadow-inner flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#e5e8eb]">100%</span>
                   </div>
                </div>
                <div className="text-center space-y-1">
                   <p className="text-[17px] font-bold text-[#adb5bd]">내역이 없습니다.</p>
                </div>
             </div>
           )}
        </div>

        {/* Category List */}
        <div className="space-y-4">
          {categoryStats.map((stat, index) => (
            <div key={stat.id} className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                  <span className="text-[15px] font-bold text-[#4e5968]">{stat.name}</span>
               </div>
               <span className="text-[15px] font-black text-[#191f28]">{stat.value.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Sub-Nav (Image based) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-[#f2f4f6] p-1.5 rounded-4xl shadow-2xl flex items-center gap-1 z-50">
         <button 
           onClick={() => setActiveSubTab("stats")}
           className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${activeSubTab === 'stats' ? 'bg-[#f2f4f6] text-primary' : 'text-[#adb5bd]'}`}
         >
            <PieChart size={18} />
            <span className="text-[13px] font-black">통계</span>
         </button>
         <button 
           onClick={() => setActiveSubTab("budget")}
           className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${activeSubTab === 'budget' ? 'bg-transparent text-[#adb5bd]' : 'text-[#adb5bd]'}`}
         >
            <Wallet size={18} />
            <span className="text-[13px] font-black">예산</span>
         </button>
         <button 
           onClick={() => setActiveSubTab("card")}
           className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${activeSubTab === 'card' ? 'bg-transparent text-[#adb5bd]' : 'text-[#adb5bd]'}`}
         >
            <CreditCard size={18} />
            <span className="text-[13px] font-black">카드</span>
         </button>
      </div>

      <button className="fixed bottom-10 right-10 w-12 h-12 bg-white rounded-full shadow-lg border border-[#f2f4f6] flex items-center justify-center text-[#191f28] z-50">
         <Plus size={24} />
      </button>
    </motion.div>
  );
}
