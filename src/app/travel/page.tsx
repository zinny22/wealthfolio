"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, 
  MapPin, 
  Utensils, 
  ShoppingBag, 
  Bed, 
  Plus, 
  Target, 
  ChevronRight,
  TrendingDown,
  Globe,
  Users,
  HandCoins,
  ArrowRight,
  ChevronLeft,
  Settings2,
  Trash2,
  Share2,
  PlusCircle
} from "lucide-react";
import * as Icons from "lucide-react";
import { useTravelStore } from "@/store/useTravelStore";
import { TravelTrip, TravelSpending, TravelMember } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { calculateSettlement } from "@/lib/settlement";
import { TravelSpendingModal } from "@/components/travel/TravelSpendingModal";
import { CreateTripModal } from "@/components/travel/CreateTripModal";
import { useRouter, useSearchParams } from "next/navigation";

export default function TravelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTripId = searchParams.get("tripId");
  
  const { trips, spendings, addTrip, updateTrip, deleteTrip, initializeMockTravelData } = useTravelStore();
  const [activeTab, setActiveTab] = useState<"spending" | "settlement">("spending");
  const [isSpendingModalOpen, setIsSpendingModalOpen] = useState(false);
  const [selectedSpending, setSelectedSpending] = useState<TravelSpending | null>(null);
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);

  useEffect(() => {
    if (trips.length === 0) {
      initializeMockTravelData();
    }
  }, [trips.length, initializeMockTravelData]);

  const selectedTrip = useMemo(() => 
    trips.find(t => t.id === selectedTripId) || null,
  [trips, selectedTripId]);

  const handleTripSelect = (id: string) => {
    router.push(`/travel?tripId=${id}`);
  };

  const handleBack = () => {
    router.push("/travel");
  };

  const tripSpendings = useMemo(() => 
    spendings.filter(s => s.tripId === selectedTripId),
  [spendings, selectedTripId]);

  const totalSpent = useMemo(() => 
    tripSpendings.reduce((sum, s) => sum + s.amountKrw, 0),
  [tripSpendings]);

  // 정산 결과 계산
  const settlementResults = useMemo(() => {
    if (!selectedTrip) return [];
    return calculateSettlement(selectedTrip.members, tripSpendings);
  }, [selectedTrip, tripSpendings]);

  const groupedSpendings = useMemo(() => {
    const groups: Record<string, TravelSpending[]> = {};
    tripSpendings.forEach(s => {
      if (!groups[s.date]) groups[s.date] = [];
      groups[s.date].push(s);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [tripSpendings]);

  if (!selectedTripId) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-32">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-2xl font-black text-[#191f28]">여행 목록</h2>
           <button 
             onClick={() => setIsCreateTripModalOpen(true)}
             className="p-2 bg-[#f2f4f6] rounded-full text-[#4e5968] hover:bg-[#e5e8eb] transition-all"
           >
             <Plus size={20} />
           </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {trips.map((trip) => (
            <motion.div
              key={trip.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTripSelect(trip.id)}
              className="bg-white p-5 rounded-3xl shadow-sm border border-[#f2f4f6] flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl bg-[#f2f4f6] w-14 h-14 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                  {trip.emoji}
                </div>
                <div className="flex flex-col">
                  <span className="text-[17px] font-bold text-[#191f28]">{trip.name}</span>
                  <span className="text-[12px] font-medium text-[#adb5bd]">
                    {trip.startDate} ~ {trip.endDate} • {trip.members.length}명 참여
                  </span>
                </div>
              </div>
              <ChevronRight className="text-[#adb5bd] group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
          
          <button 
            onClick={() => setIsCreateTripModalOpen(true)}
            className="flex flex-col items-center justify-center p-8 bg-white/50 border-2 border-dashed border-[#e5e8eb] rounded-3xl hover:bg-white transition-all group min-h-[140px]"
          >
             <Plane className="h-8 w-8 text-[#adb5bd] mb-2 group-hover:text-primary transition-colors" />
             <span className="text-sm font-bold text-[#adb5bd] group-hover:text-primary">새 여행 계획하기</span>
          </button>
        </div>
        
        <CreateTripModal 
           isOpen={isCreateTripModalOpen}
           onClose={() => setIsCreateTripModalOpen(false)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-32 -mt-6">
      {/* Detail Header (Replaces global header) */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 bg-white/90 backdrop-blur-md border-b border-[#f2f4f6] -mx-5 mb-6">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-[#f2f4f6] rounded-full text-[#191f28] transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-[16px] text-[#191f28] absolute left-1/2 -translate-x-1/2 truncate max-w-[180px]">
          {selectedTrip?.name}
        </span>
        <button className="p-2 hover:bg-[#f2f4f6] rounded-full text-[#adb5bd] transition-all">
          <Settings2 size={20} />
        </button>
      </header>

      <div className="space-y-6">

      {/* Trip Dashboard */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#f2f4f6] relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
           <div className="flex flex-col gap-0.5">
             <span className="text-[11px] font-bold text-[#adb5bd]">총 예산</span>
             <span className="text-2xl font-black text-[#191f28]">{selectedTrip?.budget.toLocaleString()}원</span>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="text-2xl">{selectedTrip?.emoji}</span>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#f2f4f6]">
           <div className="flex flex-col gap-0.5">
             <span className="text-[10px] font-bold text-[#adb5bd]">총 지출액</span>
             <span className="text-[15px] font-black text-expense">{totalSpent.toLocaleString()}원</span>
           </div>
           <div className="flex flex-col gap-0.5">
             <span className="text-[10px] font-bold text-[#adb5bd]">남은 예산</span>
             <span className="text-[15px] font-black text-primary">{(selectedTrip!.budget - totalSpent).toLocaleString()}원</span>
           </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex justify-between items-end text-[10px] font-bold text-[#adb5bd]">
            <span>예산 사용률</span>
            <span className="text-primary">{((totalSpent / selectedTrip!.budget) * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full bg-[#f2f4f6] rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${(totalSpent / selectedTrip!.budget) * 100}%` }}
               className="h-full bg-primary rounded-full transition-all duration-700"
             />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#f2f4f6] p-1 rounded-2xl">
         <button 
           onClick={() => setActiveTab("spending")}
           className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeTab === 'spending' ? 'bg-white text-[#191f28] shadow-sm' : 'text-[#8b95a1]'}`}
         >
           지출 내역
         </button>
         <button 
           onClick={() => setActiveTab("settlement")}
           className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeTab === 'settlement' ? 'bg-white text-[#191f28] shadow-sm' : 'text-[#8b95a1]'}`}
         >
           정산 리포트
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "spending" ? (
          <motion.div key="spending" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
            {groupedSpendings.map(([date, items]) => (
              <div key={date} className="space-y-2">
                <h4 className="text-[12px] font-bold text-[#adb5bd] px-2">{format(new Date(date), "M월 d일 (E)", { locale: ko })}</h4>
                <div className="bg-white rounded-3xl border border-[#f2f4f6] overflow-hidden divide-y divide-[#f9fafb]">
                  {items.map((s) => {
                    const payer = selectedTrip?.members.find(m => m.id === s.payerId);
                    return (
                      <motion.div 
                        key={s.id} 
                        whileTap={{ backgroundColor: "#f9fafb" }}
                        onClick={() => {
                          setSelectedSpending(s);
                          setIsSpendingModalOpen(true);
                        }}
                        className="p-4 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] flex items-center justify-center text-lg shadow-inner">
                            {s.category === '식비' ? '🍜' : s.category === '숙박' ? '🏨' : s.category === '교통' ? '🚌' : '🎒'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-[#191f28]">{s.memo}</span>
                            <span className="text-[11px] font-medium text-[#adb5bd] flex items-center gap-1.5">
                              {payer?.name} 결제 • {s.localCurrency} {s.amountLocal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[15px] font-black text-[#191f28]">{s.amountKrw.toLocaleString()}원</span>
                           {s.isExcludedFromSettlement && (
                             <span className="text-[9px] font-bold text-expense bg-expense/10 px-1.5 py-0.5 rounded-md mt-1">정산 제외</span>
                           )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setIsSpendingModalOpen(true)}
              className="w-full py-4 bg-white rounded-2xl border border-[#f2f4f6] text-[#adb5bd] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#f9fafb] transition-all"
            >
               <Plus size={16} /> 추가 지출 기록하기
            </button>
          </motion.div>
        ) : (
          <motion.div key="settlement" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
             {/* 멤버별 지출 요약 */}
             <div className="grid grid-cols-1 gap-3">
                <h4 className="text-[13px] font-bold text-[#191f28] px-2">멤버별 실제 지출액</h4>
                {selectedTrip?.members.map(m => {
                  const paid = tripSpendings.filter(s => s.payerId === m.id).reduce((sum, s) => sum + s.amountKrw, 0);
                  const progress = (paid / (totalSpent || 1)) * 100;
                  return (
                    <div key={m.id} className="bg-white p-4 rounded-2xl border border-[#f2f4f6] flex flex-col gap-2">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${m.color}`} />
                             <span className="text-[13px] font-bold text-[#4e5968]">{m.name}</span>
                          </div>
                          <span className="text-[13px] font-black text-[#191f28]">{paid.toLocaleString()}원</span>
                       </div>
                       <div className="h-1.5 w-full bg-[#f2f4f6] rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full ${m.color}`} />
                       </div>
                    </div>
                  );
                })}
             </div>

             {/* 송금 최적화 경로 */}
             <div className="bg-[#191f28] p-6 rounded-4xl text-white space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <div className="flex items-center justify-between relative z-10">
                   <h4 className="text-sm font-bold flex items-center gap-2">
                     <HandCoins className="w-4 h-4 text-primary" /> 정산 최적화 추천
                   </h4>
                   <Button variant="ghost" size="sm" className="h-7 text-[11px] text-[#adb5bd] px-2">
                     <Share2 className="w-3.5 h-3.5" /> 결과 공유
                   </Button>
                </div>
                
                <div className="space-y-4 relative z-10">
                  {settlementResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
                       <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                         <MapPin className="text-[#8b95a1]" />
                       </div>
                       <p className="text-[12px] text-[#8b95a1]">이미 모든 정산이 완료되었거나<br/>내역이 없습니다.</p>
                    </div>
                  ) : (
                    settlementResults.map((res, idx) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <span className="text-[13px] font-bold text-[#adb5bd]">{selectedTrip?.members.find(m => m.id === res.from)?.name}</span>
                            <ArrowRight className="w-3 h-3 text-primary" />
                            <span className="text-[13px] font-bold text-white">{selectedTrip?.members.find(m => m.id === res.to)?.name}</span>
                         </div>
                         <div className="text-[15px] font-black text-primary">
                            {res.amount.toLocaleString()}원
                         </div>
                      </div>
                    ))
                  )}
                </div>
                
                {settlementResults.length > 0 && (
                  <p className="text-[10px] text-[#8b95a1] leading-relaxed relative z-10 text-center">
                    송금 횟수를 최소화하기 위해 계산된 결과입니다.<br/>송금 후 상대방과 확인해 보세요!
                  </p>
                )}
             </div>

             <Button className="w-full h-12 bg-primary hover:bg-[#1b64da] rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
                여행 종료 및 최종 정산 확정
             </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 여행 전용 지출 입력 모달 */}
      <AnimatePresence>
        {isSpendingModalOpen && selectedTrip && (
          <TravelSpendingModal
            isOpen={isSpendingModalOpen}
            onClose={() => {
              setIsSpendingModalOpen(false);
              setSelectedSpending(null);
            }}
            trip={selectedTrip}
            initialData={selectedSpending}
          />
        )}
      </AnimatePresence>
    </div>
  </motion.div>
  );
}
