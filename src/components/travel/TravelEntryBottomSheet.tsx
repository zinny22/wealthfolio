"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Utensils, Bus, ShoppingBag, Clapperboard, FileText, Plus, Info, Users } from "lucide-react";

const TRAVEL_CATEGORIES = [
  { name: "식비", icon: Utensils, color: "#3B82F6" },
  { name: "교통", icon: Bus, color: "#F59E0B" },
  { name: "쇼핑", icon: ShoppingBag, color: "#EC4899" },
  { name: "숙소", icon: FileText, color: "#10B981" },
  { name: "관광", icon: Clapperboard, color: "#8B5CF6" },
  { name: "기타", icon: FileText, color: "#94A3B8" },
];

interface TravelEntryBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: any) => void;
  onDelete?: (id: string) => void;
  members: string[];
  currencySymbol: string;
  initialData?: any | null;
}

export default function TravelEntryBottomSheet({
  isOpen,
  onClose,
  onAdd,
  onDelete,
  members,
  currencySymbol,
  initialData
}: TravelEntryBottomSheetProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("식비");
  const [memo, setMemo] = useState("");
  const [payer, setPayer] = useState("나");
  const [participants, setParticipants] = useState<string[]>(members);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setAmount(initialData.amount.toString());
        setCategory(initialData.category);
        setMemo(initialData.memo);
        setPayer(initialData.payer);
        setParticipants(initialData.participants);
      } else {
        setAmount("");
        setCategory("식비");
        setMemo("");
        setPayer("나");
        setParticipants(members);
      }
    }
  }, [isOpen, initialData, members]);

  const toggleParticipant = (member: string) => {
    if (participants.includes(member)) {
      setParticipants(participants.filter(m => m !== member));
    } else {
      setParticipants([...participants, member]);
    }
  };

  const handleSave = () => {
    if (!amount || participants.length === 0) return;
    
    onAdd({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      date: initialData?.date || new Date(),
      amount: parseInt(amount),
      category,
      memo: memo || category,
      payer,
      participants
    });
    onClose();
  };

  const handleDelete = () => {
    if (initialData && onDelete) {
      if (confirm("이 지출 내역을 삭제하시겠습니까?")) {
        onDelete(initialData.id);
        onClose();
      }
    }
  };

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
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-white dark:bg-slate-900 rounded-t-4xl p-8 pb-12 z-[70] shadow-2xl shadow-black/20 max-h-[92vh] overflow-y-auto"
          >
            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-8 shrink-0" />
            
            <div className="space-y-10">
              {/* Amount Input */}
              <div className="space-y-4">
                <p className="text-[12px] font-bold text-slate-400 ml-1 uppercase">지출 금액 ({currencySymbol})</p>
                <div className="flex items-center gap-2 border-b-3 border-slate-50 dark:border-slate-800 pb-3 focus-within:border-primary transition-colors">
                  <input
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    className="flex-1 bg-transparent text-4xl font-black outline-none tracking-tight"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-4">
                <p className="text-[12px] font-bold text-slate-400 ml-1 uppercase">카테고리</p>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setCategory(cat.name)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                        category === cat.name 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-slate-50 dark:bg-slate-800 text-slate-400"
                      }`}
                    >
                      <cat.icon size={16} strokeWidth={2.5} />
                      <span className="text-[13px] font-bold">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payer */}
              <div className="space-y-4">
                <p className="text-[12px] font-bold text-slate-400 ml-1 uppercase">결제자</p>
                <div className="flex flex-wrap gap-2">
                  {members.map((member) => (
                    <button
                      key={member}
                      onClick={() => setPayer(member)}
                      className={`px-5 py-2.5 rounded-full text-[13px] font-bold border-2 transition-all ${
                        payer === member 
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                        : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent"
                      }`}
                    >
                      {member}
                    </button>
                  ))}
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-4">
                <div className="flex justify-between items-center ml-1">
                  <p className="text-[12px] font-bold text-slate-400 uppercase">함께한 멤버</p>
                  <button 
                    onClick={() => setParticipants(participants.length === members.length ? [] : members)}
                    className="text-[11px] font-bold text-primary"
                  >
                    전체 {participants.length === members.length ? '해제' : '선택'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {members.map((member) => (
                    <button
                      key={member}
                      onClick={() => toggleParticipant(member)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        participants.includes(member)
                        ? "bg-primary/5 border-primary/20 text-foreground"
                        : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-300"
                      }`}
                    >
                      <span className="text-[14px] font-bold">{member}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        participants.includes(member) ? "bg-primary text-white" : "bg-white dark:bg-slate-900"
                      }`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Memo */}
              <div className="space-y-4">
                <p className="text-[12px] font-bold text-slate-400 ml-1 uppercase">메모</p>
                <input
                  type="text"
                  placeholder="지출 내용 입력"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-[15px] font-bold outline-none border-2 border-transparent focus:border-primary/20"
                />
              </div>

              <div className="flex gap-3 mt-4">
                {initialData && (
                  <button
                    onClick={handleDelete}
                    className="w-20 h-16 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                  >
                    <X size={24} strokeWidth={3} />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={!amount || participants.length === 0}
                  className="flex-1 h-16 bg-primary disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-300 rounded-2xl text-[17px] font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  {initialData ? "수정 완료" : "지출 추가하기"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
