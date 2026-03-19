"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowLeft, ArrowRight, Wallet, CreditCard, ChevronDown } from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { format } from "date-fns";
import { Transaction } from "@/types/transaction";
import { useEffect } from "react";

interface TransactionInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Transaction | null;
}

import * as Icons from "lucide-react";

type Step = "amount" | "type_category" | "method_memo";

export function TransactionInputModal({ isOpen, onClose, initialData }: TransactionInputModalProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amountStr, setAmountStr] = useState("0");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("1");
  const [method, setMethod] = useState<"card" | "cash">("card");
  const [memo, setMemo] = useState("");

  const { categories, addTransaction, updateTransaction } = useTransactionStore();

  useEffect(() => {
     if (isOpen && initialData) {
       setAmountStr(initialData.amount.toString());
       setType(initialData.type);
       setCategoryId(initialData.categoryId);
       setMethod(initialData.method);
       setMemo(initialData.memo || "");
       setStep("amount"); // 수정 시에도 금액부터 확인
     } else if (isOpen && !initialData) {
       setAmountStr("0");
       setType("expense");
       setCategoryId("1");
       setMethod("card");
       setMemo("");
       setStep("amount");
     }
  }, [isOpen, initialData]);

  const handleNumberClick = (num: string) => {
    setAmountStr((prev) => {
      if (prev === "0") return num;
      if (prev.length >= 10) return prev;
      return prev + num;
    });
  };

  const handleDelete = () => {
    setAmountStr((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  };

  const handleNext = () => {
    if (step === "amount") setStep("type_category");
    else if (step === "type_category") setStep("method_memo");
  };

  const handleBack = () => {
    if (step === "type_category") setStep("amount");
    else if (step === "method_memo") setStep("type_category");
  };

  const handleSave = () => {
    const data = {
      amount: parseInt(amountStr),
      type,
      categoryId,
      method,
      memo,
      date: initialData?.date || format(new Date(), "yyyy-MM-dd"),
    };

    if (initialData) {
      updateTransaction(initialData.id, data);
    } else {
      addTransaction(data);
    }

    onClose();
    // Reset
    setStep("amount");
    setAmountStr("0");
    setMemo("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm flex items-end justify-center"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-[600px] bg-white rounded-t-5xl shadow-2xl p-8 flex flex-col h-[85vh] outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={step === "amount" ? onClose : handleBack} className="p-3 bg-[#f2f4f6] text-[#8b95a1] rounded-full hover:bg-[#e5e8eb] transition-all">
              {step === "amount" ? <X size={20} /> : <ArrowLeft size={18} />}
            </button>
            <span className="text-base font-black text-[#191f28]">
              {step === "amount" ? "금액 입력" : step === "type_category" ? "유형 및 카테고리" : "결제 및 메모"}
            </span>
            <div className="w-10 h-10" /> {/* Spacer */}
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto pr-1">
            {step === "amount" && (
              <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-sm font-bold text-[#adb5bd] mb-2 uppercase tracking-widest">Amount</span>
                  <div className="text-5xl font-black text-[#191f28] flex items-baseline gap-1">
                    {parseInt(amountStr).toLocaleString()}
                    <span className="text-2xl font-bold text-[#8b95a1]">원</span>
                  </div>
                </div>

                {/* Custom Keypad */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "00", 0, "back"].map((k) => (
                    <motion.button
                      key={k}
                      whileTap={{ scale: 0.9, backgroundColor: "#f2f4f6" }}
                      onClick={() => (k === "back" ? handleDelete() : handleNumberClick(k.toString()))}
                      className="h-16 flex items-center justify-center text-xl font-extrabold text-[#4e5968] rounded-2xl bg-white border border-[#f2f4f6] active:shadow-inner"
                    >
                      {k === "back" ? <Icons.Delete size={24} /> : k}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === "type_category" && (
              <div className="flex flex-col gap-10 py-4">
                {/* Type Selection */}
                <div className="flex bg-[#f2f4f6] p-1.5 rounded-2xl gap-1">
                  <button
                    onClick={() => setType("expense")}
                    className={`flex-1 py-3.5 rounded-xl font-black text-sm transition-all ${
                      type === "expense" ? "bg-white text-expense shadow-sm" : "text-[#8b95a1]"
                    }`}
                  >
                    지출
                  </button>
                  <button
                    onClick={() => setType("income")}
                    className={`flex-1 py-3.5 rounded-xl font-black text-sm transition-all ${
                      type === "income" ? "bg-white text-income shadow-sm" : "text-[#8b95a1]"
                    }`}
                  >
                    수입
                  </button>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {categories.map((cat) => {
                    const isSelected = categoryId === cat.id;
                    // @ts-ignore
                    const IconComp = cat.icon ? (Icons[cat.icon as keyof typeof Icons] as any) : Icons.MoreHorizontal;
                    return (
                      <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCategoryId(cat.id)}
                        className={`flex flex-col items-center gap-2.5 p-4 rounded-3xl transition-all border-2 ${
                          isSelected ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-transparent bg-white hover:bg-[#f2f4f6]/50"
                        }`}
                      >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-[1.25rem] ${cat.color} ${isSelected ? 'shadow-inner' : 'opacity-80'}`}>
                          <IconComp size={24} />
                        </div>
                        <span className={`text-xs font-black ${isSelected ? "text-primary" : "text-[#4e5968]"}`}>
                          {cat.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === "method_memo" && (
              <div className="flex flex-col gap-10 py-4">
                <div className="flex flex-col gap-3">
                  <h5 className="text-sm font-black text-[#adb5bd] uppercase tracking-widest pl-2">Payment Method</h5>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setMethod("card")}
                      className={`flex-1 flex items-center justify-center gap-3 p-5 rounded-4xl border-2 transition-all ${
                        method === "card" ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10" : "border-[#f2f4f6]"
                      }`}
                    >
                      <CreditCard size={20} />
                      <span className="font-black">카드</span>
                    </button>
                    <button
                      onClick={() => setMethod("cash")}
                      className={`flex-1 flex items-center justify-center gap-3 p-5 rounded-4xl border-2 transition-all ${
                        method === "cash" ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10" : "border-[#f2f4f6]"
                      }`}
                    >
                      <Wallet size={20} />
                      <span className="font-black">현금</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h5 className="text-sm font-black text-[#adb5bd] uppercase tracking-widest pl-2">Memo</h5>
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="지메모를 입력하세요..."
                    className="w-full p-6 bg-[#f2f4f6] rounded-4xl text-base font-bold text-[#191f28] placeholder:text-[#adb5bd] border-none focus:ring-2 focus:ring-primary/20 h-32 resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="pt-6 mt-4 border-t border-[#f2f4f6]">
            {step === "method_memo" ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full py-5 bg-primary text-white rounded-4xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                <Check size={22} strokeWidth={3} />
                저장하기
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={amountStr === "0" && step === "amount"}
                onClick={handleNext}
                className="w-full py-5 bg-[#191f28] text-white rounded-4xl font-black text-lg disabled:opacity-30 flex items-center justify-center gap-3 group"
              >
                다음단계
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
