"use client";

import React, { useState, useEffect } from "react";
import { Plus, CreditCard, Wallet, Utensils, Bus, ShoppingBag, Clapperboard, HeartPulse, GraduationCap, Phone, Home as HomeIcon, Coffee, Gift, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EXPENSE_CATEGORIES = [
  { name: "식비", icon: Utensils, color: "#3B82F6" },
  { name: "교통", icon: Bus, color: "#F59E0B" },
  { name: "쇼핑", icon: ShoppingBag, color: "#EC4899" },
  { name: "문화생활", icon: Clapperboard, color: "#8B5CF6" },
  { name: "의료/건강", icon: HeartPulse, color: "#EF4444" },
  { name: "교육", icon: GraduationCap, color: "#10B981" },
  { name: "통신", icon: Phone, color: "#64748B" },
  { name: "주거/통신", icon: HomeIcon, color: "#78350F" },
  { name: "카페", icon: Coffee, color: "#D97706" },
  { name: "선물", icon: Gift, color: "#F472B6" },
];

const INCOME_CATEGORIES = [
  { name: "월급", icon: Gift, color: "#10B981" },
  { name: "부수입", icon: Plus, color: "#3B82F6" },
  { name: "용돈", icon: HeartPulse, color: "#F59E0B" },
  { name: "기타", icon: FileText, color: "#94A3B8" },
];

interface EntryBottomSheetProps {
  onAddTransaction: (amount: number, type: "income" | "expense", category: string, memo: string, paymentMethod: "card" | "cash") => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  mode?: "add" | "edit";
  initialAmount?: number;
  initialType?: "income" | "expense";
  initialCategory?: string;
  initialMemo?: string;
  initialPaymentMethod?: "card" | "cash";
}

export default function EntryBottomSheet({ 
  onAddTransaction, 
  isOpen: externalIsOpen, 
  setIsOpen: setExternalIsOpen,
  mode = "add",
  initialAmount = 0,
  initialType = "expense",
  initialCategory = "식비",
  initialMemo = "",
  initialPaymentMethod = "card"
}: EntryBottomSheetProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isOpen = mode === "edit" ? !!externalIsOpen : internalIsOpen;
  const setIsOpen = mode === "edit" ? setExternalIsOpen : setInternalIsOpen;

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("식비");
  const [memo, setMemo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit") {
        setAmount(initialAmount.toString());
        setType(initialType);
        setCategory(initialCategory);
        setMemo(initialMemo);
        setPaymentMethod(initialPaymentMethod);
      } else {
        setAmount("");
        setType("expense");
        setCategory("식비");
        setMemo("");
        setPaymentMethod("card");
      }
    }
  }, [isOpen, mode, initialAmount, initialType, initialCategory, initialMemo, initialPaymentMethod]);

  const handleSubmit = () => {
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(numAmount) && numAmount > 0) {
      onAddTransaction(numAmount, type, category, memo, paymentMethod);
      setIsOpen?.(false);
    }
  };

  const currentCategories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <>
      {mode === "add" && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[600px] pointer-events-none z-40">
          <div className="relative w-full h-full">
            <button
              onClick={() => setInternalIsOpen(true)}
              className="absolute right-6 bottom-0 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto"
            >
              <Plus size={28} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen?.(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-8 pb-12 z-[70] shadow-2xl shadow-black/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-8 shrink-0" />
              
              <div className="flex flex-col gap-7 pb-4">
                {/* 1. Header & Type Selector */}
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold tracking-tight">
                      {mode === "edit" ? "내역 수정하기" : "새로운 내역 기록"}
                    </h3>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
                      <button
                        onClick={() => { setType("expense"); setCategory("식비"); }}
                        className={`px-6 py-2 rounded-xl text-[13px] font-bold transition-all ${
                          type === "expense" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400"
                        }`}
                      >
                        지출
                      </button>
                      <button
                        onClick={() => { setType("income"); setCategory("월급"); }}
                        className={`px-6 py-2 rounded-xl text-[13px] font-bold transition-all ${
                          type === "income" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400"
                        }`}
                      >
                        수입
                      </button>
                    </div>
                  </div>
                  
                  {/* Payment Method Selector */}
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-[11px] font-bold text-slate-300 mr-1 uppercase tracking-wider">결제 수단</p>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-2 rounded-lg transition-all ${
                          paymentMethod === "card" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400"
                        }`}
                      >
                        <CreditCard size={18} />
                      </button>
                      <button
                        onClick={() => setPaymentMethod("cash")}
                        className={`p-2 rounded-lg transition-all ${
                          paymentMethod === "cash" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400"
                        }`}
                      >
                        <Wallet size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Amount Input */}
                <div className="space-y-2">
                  <p className="text-[12px] font-bold text-slate-400 ml-1">얼마나 {type === "expense" ? "쓰셨나요" : "벌으셨나요"}?</p>
                  <div className="flex items-center gap-2 border-b-3 border-slate-50 dark:border-slate-800 pb-3 focus-within:border-primary transition-colors">
                    <input
                      autoFocus
                      type="text"
                      inputMode="numeric"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="0"
                      className="flex-1 bg-transparent text-3xl font-extrabold outline-none tracking-tight"
                    />
                    <span className="text-2xl font-bold text-slate-300">원</span>
                  </div>
                </div>

                {/* 3. Category Selector */}
                <div className="space-y-3">
                  <p className="text-[12px] font-bold text-slate-400 ml-1">카테고리</p>
                  <div className="grid grid-cols-5 gap-y-5 gap-x-2">
                    {currentCategories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setCategory(cat.name)}
                        className="flex flex-col items-center gap-2 group cursor-pointer"
                      >
                        <div 
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative ${
                            category === cat.name ? "scale-105 shadow-md shadow-black/5" : "opacity-50"
                          }`}
                          style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                        >
                          <cat.icon size={20} strokeWidth={2.5} />
                          {category === cat.name && (
                            <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center border-2 border-white dark:border-slate-900">
                              <Check size={10} strokeWidth={4} />
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold ${category === cat.name ? "text-foreground" : "text-slate-400"}`}>
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Memo Input */}
                <div className="space-y-2">
                  <p className="text-[12px] font-bold text-slate-400 ml-1">메모 (선택사항)</p>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="내용을 입력해 주세요"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-[15px] font-bold outline-none border-2 border-transparent focus:border-primary/10 transition-all"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!amount || parseInt(amount) === 0}
                  className="w-full h-16 bg-primary disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-300 rounded-2xl text-[17px] font-extrabold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 mt-4"
                >
                  {mode === "edit" ? "정보 수정하기" : "입력 완료"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
