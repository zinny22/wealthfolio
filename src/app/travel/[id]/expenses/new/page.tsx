"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Check, Users, User, CreditCard, Utensils, Bus, ShoppingBag, Clapperboard, FileText } from "lucide-react";
import Header from "@/components/common/Header";

const TRAVEL_CATEGORIES = [
  { name: "식비", icon: Utensils, color: "#3B82F6" },
  { name: "교통", icon: Bus, color: "#F59E0B" },
  { name: "쇼핑", icon: ShoppingBag, color: "#EC4899" },
  { name: "숙소", icon: FileText, color: "#10B981" },
  { name: "관광", icon: Clapperboard, color: "#8B5CF6" },
  { name: "기타", icon: FileText, color: "#94A3B8" },
];

export default function NewTravelExpensePage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id;

  // Mock members (These would come from the trip data)
  const MEMBERS = ["나", "철수", "영희"];

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("식비");
  const [memo, setMemo] = useState("");
  const [payer, setPayer] = useState("나");
  const [participants, setParticipants] = useState<string[]>(MEMBERS);

  const toggleParticipant = (member: string) => {
    if (participants.includes(member)) {
      setParticipants(participants.filter(m => m !== member));
    } else {
      setParticipants([...participants, member]);
    }
  };

  const handleSave = () => {
    alert("지출이 기록되었습니다! (정산 리포트에 반영됩니다)");
    router.back();
  };

  return (
    <main className="flex-1 flex flex-col bg-app-bg min-h-screen">
      <Header title="지출 기록" showBack />

      <div className="flex-1 px-7 py-8 space-y-10 overflow-y-auto pb-24">
        {/* 1. Amount Input */}
        <div className="space-y-4">
          <p className="text-[12px] font-bold text-slate-400 ml-1 uppercase">지출 금액 (¥)</p>
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

        {/* 2. Category Selector */}
        <div className="space-y-4">
          <p className="text-[12px] font-bold text-slate-400 ml-1 uppercase">카테고리</p>
          <div className="grid grid-cols-3 gap-3">
            {TRAVEL_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  category === cat.name 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-slate-50 dark:bg-slate-900 text-slate-400"
                }`}
              >
                <cat.icon size={20} strokeWidth={2.5} />
                <span className="text-[13px] font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Payer Selector */}
        <div className="space-y-4">
          <p className="text-[12px] font-bold text-slate-400 ml-1 uppercase">누가 결제했나요?</p>
          <div className="flex flex-wrap gap-2">
            {MEMBERS.map((member) => (
              <button
                key={member}
                onClick={() => setPayer(member)}
                className={`px-6 py-3 rounded-full text-[14px] font-bold border-2 transition-all ${
                  payer === member 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-white dark:bg-slate-900 text-slate-400 border-slate-50 dark:border-slate-800"
                }`}
              >
                {member}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Participants Selector */}
        <div className="space-y-4">
          <div className="flex justify-between items-center ml-1">
            <p className="text-[12px] font-bold text-slate-400 uppercase">함께한 멤버</p>
            <button 
              onClick={() => setParticipants(participants.length === MEMBERS.length ? [] : MEMBERS)}
              className="text-[12px] font-bold text-primary"
            >
              전체 {participants.length === MEMBERS.length ? '해제' : '선택'}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {MEMBERS.map((member) => (
              <button
                key={member}
                onClick={() => toggleParticipant(member)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                  participants.includes(member)
                  ? "bg-primary/5 border-primary/20 text-foreground"
                  : "bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-300"
                }`}
              >
                <span className="text-[15px] font-bold">{member}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  participants.includes(member) ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800"
                }`}>
                  <Check size={14} strokeWidth={4} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Memo Input */}
        <div className="space-y-4">
          <p className="text-[12px] font-bold text-slate-400 ml-1 uppercase">메모</p>
          <input
            type="text"
            placeholder="예: 편의점 야식"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 p-5 rounded-2xl text-[16px] font-bold outline-none border-2 border-slate-50 dark:border-slate-800 focus:border-primary/20"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
        <button
          onClick={handleSave}
          disabled={!amount || participants.length === 0}
          className="w-full h-16 bg-primary disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-300 rounded-2xl text-[17px] font-extrabold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          기록 완료
        </button>
      </div>
    </main>
  );
}
