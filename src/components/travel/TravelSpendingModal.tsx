"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Calculator, User, Users, Globe } from "lucide-react";
import { TravelTrip, TravelMember, TravelCurrency, TravelSpending } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { useTravelStore } from "@/store/useTravelStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trip: TravelTrip;
}

const CURRENCIES: { label: string; value: TravelCurrency; symbol: string; rate: number }[] = [
  { label: "원화", value: "KRW", symbol: "₩", rate: 1 },
  { label: "엔화", value: "JPY", symbol: "¥", rate: 8.9 }, // 100엔당 원화 (간이 계산용)
  { label: "달러", value: "USD", symbol: "$", rate: 1330 },
  { label: "유로", value: "EUR", symbol: "€", rate: 1450 },
  { label: "동", value: "VND", symbol: "₫", rate: 0.054 },
];

export function TravelSpendingModal({ isOpen, onClose, trip }: Props) {
  const { addSpending } = useTravelStore();
  
  const [amountLocal, setAmountLocal] = useState("");
  const [localCurrency, setLocalCurrency] = useState<TravelCurrency>("KRW");
  const [payerId, setPayerId] = useState(trip.members[0]?.id || "");
  const [splitMemberIds, setSplitMemberIds] = useState<string[]>(trip.members.map(m => m.id));
  const [memo, setMemo] = useState("");
  const [category, setCategory] = useState("식비");
  const [isExcluded, setIsExcluded] = useState(false);

  const exchangeRate = useMemo(() => 
    CURRENCIES.find(c => c.value === localCurrency)?.rate || 1,
  [localCurrency]);

  const amountKrw = useMemo(() => {
    const val = parseFloat(amountLocal) || 0;
    if (localCurrency === "JPY") return Math.round((val / 100) * 8.9 * 100) / 100; // JPY 특수
    return Math.round(val * exchangeRate);
  }, [amountLocal, localCurrency, exchangeRate]);

  const handleSave = () => {
    if (!amountLocal) return;
    
    addSpending({
      tripId: trip.id,
      date: new Date().toISOString().split('T')[0],
      amountKrw,
      amountLocal: parseFloat(amountLocal),
      localCurrency,
      exchangeRate,
      payerId,
      category,
      memo: memo || category,
      splitMemberIds,
      isExcludedFromSettlement: isExcluded
    });
    
    // Reset & Close
    setAmountLocal("");
    setMemo("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center sm:items-center p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
      />
      
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="relative w-full max-w-[500px] bg-white rounded-t-[2.5rem] sm:rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 pb-2 flex items-center justify-between">
          <h3 className="text-xl font-black text-[#191f28]">지출 기록하기</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#f2f4f6] rounded-full text-[#adb5bd] transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 금액 입력 */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#8b95a1]">금액 입력</span>
                <div className="flex bg-[#f2f4f6] p-1 rounded-xl">
                   {CURRENCIES.map(c => (
                     <button 
                       key={c.value}
                       onClick={() => setLocalCurrency(c.value)}
                       className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${localCurrency === c.value ? 'bg-white text-primary shadow-sm' : 'text-[#8b95a1]'}`}
                     >
                       {c.value}
                     </button>
                   ))}
                </div>
             </div>
             <div className="relative">
                <input 
                  type="number" 
                  value={amountLocal}
                  onChange={(e) => setAmountLocal(e.target.value)}
                  placeholder="0"
                  className="w-full text-4xl font-black text-[#191f28] border-none focus:ring-0 p-0 placeholder:text-[#e5e8eb]"
                />
                <span className="absolute right-0 bottom-1 text-2xl font-bold text-[#adb5bd]">
                  {CURRENCIES.find(c => c.value === localCurrency)?.symbol}
                </span>
             </div>
             {localCurrency !== 'KRW' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-primary font-bold">
                  <Calculator size={14} />
                  <span className="text-[14px]">약 {amountKrw.toLocaleString()}원</span>
                  <span className="text-[10px] text-[#adb5bd] font-medium">(환율 {exchangeRate})</span>
               </motion.div>
             )}
          </div>

          {/* 결제자 선택 */}
          <div className="space-y-3">
             <span className="text-sm font-bold text-[#8b95a1] flex items-center gap-2">
               <User size={16} /> 누가 결제했나요?
             </span>
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {trip.members.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setPayerId(m.id)}
                    className={`shrink-0 px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 ${payerId === m.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-[#f2f4f6] text-[#4e5968]'}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${payerId === m.id ? 'bg-white' : m.color}`} />
                    <span className="text-[13px] font-bold">{m.name}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* 함께 한 사람 (N분의 1) */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#8b95a1] flex items-center gap-2">
                  <Users size={16} /> 정산 멤버 ({splitMemberIds.length}명)
                </span>
                <button 
                  onClick={() => setIsExcluded(!isExcluded)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${isExcluded ? 'bg-expense text-white border-expense' : 'bg-white text-[#adb5bd] border-[#e5e8eb]'}`}
                >
                  개인 지출 (정산 제외)
                </button>
             </div>
             <div className="grid grid-cols-2 gap-2">
                {!isExcluded && trip.members.map(m => {
                  const isSelected = splitMemberIds.includes(m.id);
                  return (
                    <button 
                      key={m.id}
                      onClick={() => {
                        if (isSelected) setSplitMemberIds(splitMemberIds.filter(id => id !== m.id));
                        else setSplitMemberIds([...splitMemberIds, m.id]);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isSelected ? 'bg-primary/5 border-primary text-primary' : 'bg-[#f9fafb] border-transparent text-[#adb5bd]'}`}
                    >
                      <span className="text-[13px] font-bold">{m.name}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-[#e5e8eb]'}`}>
                         {isSelected && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
             </div>
          </div>

          {/* 카테고리 & 메모 */}
          <div className="space-y-4">
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['식비', '교통', '숙박', '항공', '쇼핑', '관광'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${category === cat ? 'bg-[#191f28] text-white shadow-md' : 'bg-[#f2f4f6] text-[#8b95a1]'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
             <div className="bg-[#f9fafb] rounded-2xl p-4">
                <input 
                  type="text" 
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="메모를 입력하세요 (장소, 메뉴 등)"
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-[14px] font-medium text-[#191f28] placeholder:text-[#adb5bd]"
                />
             </div>
          </div>
        </div>

        <div className="p-6 pt-2">
           <Button 
             onClick={handleSave}
             disabled={!amountLocal}
             className="w-full h-14 bg-primary hover:bg-[#1b64da] rounded-2xl text-[16px] font-bold shadow-xl shadow-primary/20 transition-all active:scale-95"
           >
             지출 저장하기
           </Button>
        </div>
      </motion.div>
    </div>
  );
}
