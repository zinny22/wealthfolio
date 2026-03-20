"use client";

import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
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
  const [activeSubTab, setActiveSubTab] = useState<"stats" | "card">("stats");

  const monthStr = format(currentMonth, "yyyy-MM");
  const monthDisplay = format(currentMonth, "yyyy년 M월");
  
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));

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
          icon: cat?.icon,
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
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="absolute inset-0 z-50 bg-[#f9fafb] flex flex-col pt-safe-top overflow-hidden"
    >
      {/* Compact Header with Month Navigation */}
      <header className="flex h-16 items-center justify-between px-4 bg-white border-b border-[#f2f4f6]">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => router.push("/")}
            className="p-2 hover:bg-[#f2f4f6] rounded-full text-[#191f28] transition-all"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-2 ml-1">
            <button onClick={handlePrevMonth} className="p-1 text-[#adb5bd] hover:text-[#191f28]"><ChevronLeft size={18} /></button>
            <h2 className="text-[16px] font-black text-[#191f28] tracking-tight">{monthDisplay}</h2>
            <button onClick={handleNextMonth} className="p-1 text-[#adb5bd] hover:text-[#191f28]"><ChevronRight size={18} /></button>
          </div>
        </div>
        
        <div className="flex bg-[#f2f4f6] p-1 rounded-2xl gap-0.5">
          <button 
            onClick={() => setType("expense")}
            className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all ${type === 'expense' ? 'bg-white text-expense shadow-sm' : 'text-[#8b95a1]'}`}
          >
            지출
          </button>
          <button 
            onClick={() => setType("income")}
            className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all ${type === 'income' ? 'bg-white text-income shadow-sm' : 'text-[#8b95a1]'}`}
          >
            수입
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-40 space-y-8 max-w-[600px] mx-auto w-full">
        {activeSubTab === "stats" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Statistics Hero Section */}
            <div className="bg-white rounded-5xl p-8 shadow-sm border border-[#f2f4f6] space-y-6">
              <div className="text-center space-y-1">
                 <span className="text-[12px] font-bold text-[#adb5bd] tracking-widest uppercase">Total {type === 'expense' ? 'Spend' : 'Income'}</span>
                 <h3 className="text-3xl font-black text-[#191f28]">{totalAmount.toLocaleString()}원</h3>
              </div>
    
              <div className="relative flex items-center justify-center py-4">
                 {categoryStats.length > 0 ? (
                   <>
                     <DonutChart data={categoryStats} />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-2">
                        <span className="text-[11px] font-black text-[#adb5bd] block mb-1">Highest</span>
                        <span className="text-[16px] font-black text-primary">{categoryStats[0].percentage.toFixed(0)}%</span>
                     </div>
                   </>
                 ) : (
                   <div className="h-48 w-48 rounded-full bg-[#f2f4f6] flex items-center justify-center">
                     <span className="text-sm font-bold text-[#adb5bd]">데이터 없음</span>
                   </div>
                 )}
              </div>
    
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#f2f4f6]">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#adb5bd]">일평균</span>
                    <span className="text-[15px] font-black text-[#4e5968]">{(totalAmount/30).toLocaleString()}원</span>
                 </div>
                 <div className="flex flex-col gap-1 border-l border-[#f2f4f6] pl-4">
                    <span className="text-[10px] font-bold text-[#adb5bd]">저축 가능</span>
                    <span className="text-[15px] font-black text-income">520,300원</span>
                 </div>
              </div>
            </div>
    
            {/* Category Rankings - Compact Integrated List */}
            <div className="bg-white rounded-5xl shadow-sm border border-[#f2f4f6] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#f2f4f6] flex items-center justify-between">
                <h4 className="text-[15px] font-black text-[#191f28]">카테고리별 {type === 'expense' ? '지출' : '수입'}</h4>
                <span className="text-[11px] font-bold text-[#adb5bd]">{categoryStats.length}개</span>
              </div>
              <div className="divide-y divide-[#f9fafb]">
                {categoryStats.map((stat, idx) => (
                  <div key={stat.id} className="p-4 px-6 hover:bg-[#f9fafb] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                         <Wallet size={14} />
                      </div>
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-[#4e5968] truncate">{stat.name}</span>
                          <span className="text-[14px] font-black text-[#191f28]">{stat.value.toLocaleString()}원</span>
                        </div>
                        <div className="relative h-1.5 w-full bg-[#f2f4f6] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.percentage}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: stat.color }}
                          />
                        </div>
                      </div>
                      <div className="w-10 text-right shrink-0">
                         <span className="text-[11px] font-black text-[#adb5bd] group-hover:text-primary transition-colors">{stat.percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}



        {activeSubTab === "card" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
             <div className="bg-[#191f28] p-8 rounded-5xl text-white space-y-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="flex justify-between items-start relative z-10">
                   <div className="space-y-1">
                      <span className="text-xs font-bold text-[#8b95a1]">Total Card Spending</span>
                      <h3 className="text-2xl font-black">{totalAmount.toLocaleString()}원</h3>
                   </div>
                   <CreditCard className="text-[#8b95a1]" />
                </div>
                <div className="flex gap-4 relative z-10">
                   <div className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-bold text-[#8b95a1] mb-1">체크카드</p>
                      <p className="font-black text-[15px]">1,200,000원</p>
                   </div>
                   <div className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-bold text-[#8b95a1] mb-1">신용카드</p>
                      <p className="font-black text-[15px]">850,200원</p>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-5xl shadow-sm border border-[#f2f4f6] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#f2f4f6]">
                   <h4 className="text-[15px] font-black text-[#191f28]">결제 수단별 상세</h4>
                </div>
                <div className="divide-y divide-[#f9fafb]">
                   {['card', 'cash', 'bank'].map(method => {
                      const amount = transactions.filter(t => t.method === method && t.date.startsWith(monthStr)).reduce((s,t) => s + t.amount, 0);
                      const methodNames: Record<string, string> = { card: '카드', cash: '현금', bank: '계좌이체' };
                      return (
                        <div key={method} className="p-6 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#f2f4f6] rounded-2xl flex items-center justify-center text-primary">
                                 {method === 'card' ? <CreditCard size={18} /> : method === 'cash' ? <Wallet size={18} /> : <div className="font-bold text-xs">🏦</div>}
                              </div>
                              <span className="text-[14px] font-black text-[#4e5968]">{methodNames[method]}</span>
                           </div>
                           <span className="text-[15px] font-black text-[#191f28]">{amount.toLocaleString()}원</span>
                        </div>
                      );
                   })}
                </div>
             </div>
          </motion.div>
        )}
      </div>

      {/* Floating App Tab Bar (Glassmorphism) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-2xl border border-white/20 p-1.5 rounded-5xl shadow-2xl flex items-center gap-1 z-50">
         <button 
           onClick={() => setActiveSubTab("stats")}
           className={`flex items-center gap-2 px-6 py-4 rounded-4xl transition-all ${activeSubTab === 'stats' ? 'bg-[#191f28] text-white shadow-xl translate-y-[-2px]' : 'text-[#adb5bd]'}`}
         >
            <PieChart size={18} strokeWidth={2.5} />
            <span className="text-[13px] font-black">통계</span>
         </button>
         <button 
           onClick={() => setActiveSubTab("card")}
           className={`flex items-center gap-2 px-6 py-4 rounded-4xl transition-all ${activeSubTab === 'card' ? 'bg-[#191f28] text-white shadow-xl translate-y-[-2px]' : 'text-[#adb5bd]'}`}
         >
            <CreditCard size={18} />
            <span className="text-[13px] font-black">카드</span>
         </button>
      </div>

      {/* Quick Add FAB */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-5xl shadow-2xl flex items-center justify-center z-50 border-4 border-white"
      >
         <Plus size={28} strokeWidth={3} />
      </motion.button>
    </motion.div>
  );
}
