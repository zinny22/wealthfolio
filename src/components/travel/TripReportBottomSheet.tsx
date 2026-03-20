"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, TrendingUp, ArrowRight, User } from "lucide-react";

interface TripReportBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  trip: {
    title: string;
    members: string[];
    currencySymbol: string;
  };
  expenses: any[];
}

export default function TripReportBottomSheet({
  isOpen,
  onClose,
  trip,
  expenses
}: TripReportBottomSheetProps) {
  
  // Basic stats
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = totalAmount / trip.members.length;

  // Calculate internal balances
  const balances = trip.members.map(member => {
    const paid = expenses.filter(e => e.payer === member).reduce((s, e) => s + e.amount, 0);
    const shouldPay = expenses.reduce((s, e) => {
        if (e.participants.includes(member)) {
            return s + (e.amount / e.participants.length);
        }
        return s;
    }, 0);
    return { name: member, balance: paid - shouldPay };
  });

  // Debt optimization (simplistic for now)
  const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
  const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
  
  const settlements: any[] = [];
  let dIdx = 0;
  let cIdx = 0;
  
  const tempDebtors = debtors.map(d => ({...d}));
  const tempCreditors = creditors.map(c => ({...c}));

  while (dIdx < tempDebtors.length && cIdx < tempCreditors.length) {
    const settleAmount = Math.min(Math.abs(tempDebtors[dIdx].balance), tempCreditors[cIdx].balance);
    if (settleAmount > 0) {
      settlements.push({
        from: tempDebtors[dIdx].name,
        to: tempCreditors[cIdx].name,
        amount: Math.round(settleAmount)
      });
    }
    
    tempDebtors[dIdx].balance += settleAmount;
    tempCreditors[cIdx].balance -= settleAmount;
    
    if (Math.abs(tempDebtors[dIdx].balance) < 1) dIdx++;
    if (Math.abs(tempCreditors[cIdx].balance) < 1) cIdx++;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-white dark:bg-slate-900 rounded-t-4xl z-[70] shadow-2xl shadow-black/20 max-h-[92vh] flex flex-col"
          >
            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto my-4 shrink-0" />
            
            <div className="px-8 pb-4 flex items-center justify-between shrink-0">
              <div>
                <p className="text-[12px] font-black text-primary uppercase tracking-wider mb-0.5">Report</p>
                <h3 className="text-[22px] font-black tracking-tight text-foreground">정산 리포트</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-12 no-scrollbar">
              <div className="space-y-10 py-2">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl">
                    <p className="text-[11px] font-bold text-slate-500 uppercase mb-1.5">총 지출액</p>
                    <p className="text-[20px] font-black text-foreground">{trip.currencySymbol}{totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-primary/5 p-5 rounded-3xl">
                    <p className="text-[11px] font-bold text-primary uppercase mb-1.5">1인당 평균</p>
                    <p className="text-[20px] font-black text-primary">{trip.currencySymbol}{Math.round(perPerson).toLocaleString()}</p>
                  </div>
                </div>

                {/* Individual Balance */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <TrendingUp size={16} className="text-primary" />
                    <h4 className="text-[15px] font-bold text-foreground">멤버별 정산 현황</h4>
                  </div>
                  <div className="space-y-3">
                    {balances.map(b => (
                      <div key={b.name} className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <User size={18} />
                          </div>
                          <span className="font-bold text-foreground">{b.name}</span>
                        </div>
                        <div className="text-right">
                          <p className={`text-[15px] font-black ${b.balance >= 0 ? "text-primary" : "text-red-500"}`}>
                            {b.balance > 0 ? "+" : ""}{Math.round(b.balance).toLocaleString()}{trip.currencySymbol}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400">{b.balance >= 0 ? "받을 금액" : "보낼 금액"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Settlement Path */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <ArrowRight size={16} className="text-primary" />
                    <h4 className="text-[15px] font-bold text-foreground">추천 정산 경로</h4>
                  </div>
                  <div className="bg-primary/5 rounded-3xl p-6 space-y-4">
                    {settlements.length > 0 ? (
                      settlements.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-foreground">{s.from}</span>
                            <ArrowRight size={14} className="text-slate-300" />
                            <span className="font-bold text-foreground">{s.to}</span>
                          </div>
                          <span className="text-[15px] font-black text-primary">
                            {s.amount.toLocaleString()}{trip.currencySymbol}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-[14px] font-bold text-slate-400">모든 정산이 완료되었습니다! 🎉</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
