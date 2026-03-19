"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Target, Globe, Plane, Check } from "lucide-react";
import { TravelCurrency, TravelTrip } from "@/types/travel";
import { COUNTRIES, CountryInfo } from "@/types/countries";
import { Button } from "@/components/ui/button";
import { useTravelStore } from "@/store/useTravelStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTripModal({ isOpen, onClose }: Props) {
  const { addTrip } = useTravelStore();

  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [budget, setBudget] = useState("1000000");

  const handleCreate = () => {
    if (!name) return;

    addTrip({
      name,
      startDate,
      endDate,
      budget: parseInt(budget),
      baseCurrency: selectedCountry.currency,
      emoji: selectedCountry.emoji,
      status: "upcoming",
      members: [{ id: 'm1', name: '나', color: 'bg-primary' }] // 일단 자기 자신만 추가
    });

    // Reset & Close
    setName("");
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
          <h3 className="text-xl font-black text-[#191f28]">새 여행 만들기</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#f2f4f6] rounded-full text-[#adb5bd] transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 여행 장소 및 통화 자동 설정 */}
          <div className="space-y-4">
             <span className="text-sm font-bold text-[#8b95a1] flex items-center gap-2">
               <Globe size={16} /> 어디로 떠나시나요?
             </span>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COUNTRIES.map(country => (
                  <button 
                    key={country.name}
                    onClick={() => setSelectedCountry(country)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 ${selectedCountry.name === country.name ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-[#f2f4f6] text-[#adb5bd]'}`}
                  >
                    <span className="text-2xl">{country.emoji}</span>
                    <span className="text-[13px] font-bold">{country.name}</span>
                    {selectedCountry.name === country.name && (
                       <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full mt-1">
                         {country.currency} 자동설정
                       </span>
                    )}
                  </button>
                ))}
             </div>
          </div>

          {/* 여행 제목 입력 */}
          <div className="space-y-3">
             <span className="text-sm font-bold text-[#8b95a1]">여행 제목</span>
             <div className="bg-[#f9fafb] rounded-2xl p-4">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 오사카 벚꽃 여행, 하와이 신혼여행"
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-bold text-[#191f28] placeholder:text-[#adb5bd]"
                />
             </div>
          </div>

          {/* 일정 및 예산 */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-3">
               <span className="text-sm font-bold text-[#8b95a1] flex items-center gap-2">
                 <Calendar size={16} /> 시작일
               </span>
               <div className="bg-[#f9fafb] rounded-2xl p-4">
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-[14px] font-bold text-[#191f28]"
                  />
               </div>
             </div>
             <div className="space-y-3">
               <span className="text-sm font-bold text-[#8b95a1] flex items-center gap-2">
                 <Calendar size={16} /> 종료일
               </span>
               <div className="bg-[#f9fafb] rounded-2xl p-4">
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-[14px] font-bold text-[#191f28]"
                  />
               </div>
             </div>
          </div>

          <div className="space-y-3">
             <span className="text-sm font-bold text-[#8b95a1] flex items-center gap-2">
               <Target size={16} /> 총 예상 예산 (KRW)
             </span>
             <div className="bg-[#f9fafb] rounded-2xl p-4">
                <input 
                  type="number" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-bold text-[#191f28]"
                />
             </div>
          </div>
        </div>

        <div className="p-6 pt-2">
           <Button 
             onClick={handleCreate}
             disabled={!name}
             className="w-full h-14 bg-primary hover:bg-[#1b64da] rounded-2xl text-[16px] font-bold shadow-xl shadow-primary/20 transition-all active:scale-95"
           >
             여행 만들기
           </Button>
        </div>
      </motion.div>
    </div>
  );
}
