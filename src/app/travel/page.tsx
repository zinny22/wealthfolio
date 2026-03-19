"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddTransactionModal } from "@/features/assets/components/add-transaction-modal";
import {
  ChevronLeft,
  Globe,
  Plane,
  Bed,
  MapPin,
  Utensils,
  ShoppingBag,
  Plus,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { Trip, CashAccount } from "@/features/assets/types";

export default function TravelPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 여행 Mock 데이터
    setTrips([
      {
        id: "trip1",
        name: "오사카 식도락 여행",
        startDate: "2024-03-01",
        endDate: "2024-03-05",
        budget: 1500000,
        currency: "KRW",
        emoji: "🍱",
        status: "completed",
      } as any,
      {
        id: "trip2",
        name: "파리 한 달 살기",
        startDate: "2024-04-10",
        endDate: "2024-05-10",
        budget: 5000000,
        currency: "KRW",
        emoji: "🇫🇷",
        status: "upcoming",
      } as any,
    ]);

    setCashAccounts([
      { id: "1", bankName: "신한은행", accountName: "주거래 계좌", balance: 15600000, currency: "KRW" } as any,
    ]);

    setLoading(false);
  }, [user]);

  if (!isMounted) return null;

  return (
    <main className="space-y-8 pb-32">
      <AddTransactionModal 
        isOpen={isTransModalOpen} 
        onClose={() => setIsTransModalOpen(false)} 
        initialAccounts={cashAccounts} 
      />

      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#191f28]">여행</h1>
        <p className="text-sm font-medium text-[#8b95a1]">
          여행의 추억을 돈과 함께 기록해보세요.
        </p>
      </header>

      <div className="space-y-6">
        {!selectedTripId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                onClick={() => setSelectedTripId(trip.id)}
                className="p-6 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] cursor-pointer hover:shadow-xl transition-all group overflow-hidden relative"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{trip.emoji}</div>
                    <div>
                      <h3 className="text-lg font-bold text-[#191f28]">
                        {trip.name}
                      </h3>
                      <p className="text-xs font-medium text-[#8b95a1]">
                        {trip.startDate} ~ {trip.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        trip.status === "active"
                          ? "bg-[#3182f61a] text-[#3182f6]"
                          : trip.status === "completed"
                            ? "bg-[#f2f4f6] text-[#8b95a1]"
                            : "bg-[#4caf501a] text-[#4caf50]"
                      }`}
                    >
                      {trip.status === "active"
                        ? "여행 중"
                        : trip.status === "completed"
                          ? "종료됨"
                          : "여행 예정"}
                    </span>
                  </div>
                </div>
                <div className="mt-6 space-y-2 relative z-10">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-[#8b95a1]">예산 사용률</span>
                    <span className="text-[#191f28]">
                      {trip.budget.toLocaleString()}원 중 45% 사용
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#f2f4f6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3182f6] transition-all duration-700"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>
              </Card>
            ))}
            <button className="flex flex-col items-center justify-center p-8 bg-white/50 border-2 border-dashed border-[#e5e8eb] rounded-[32px] hover:bg-white transition-all group min-h-[160px]">
              <Globe className="h-10 w-10 text-[#adb5bd] mb-2 group-hover:text-[#3182f6] transition-colors" />
              <span className="text-sm font-bold text-[#adb5bd] group-hover:text-[#3182f6]">
                새 여행 계획하기
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => setSelectedTripId(null)}
              className="flex items-center gap-2 text-sm font-bold text-[#8b95a1] hover:text-[#191f28] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> 목록으로 돌아가기
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-8">
                {/* Trip Info Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="text-6xl">
                      {trips.find((t) => t.id === selectedTripId)?.emoji}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-[#191f28]">
                        {trips.find((t) => t.id === selectedTripId)?.name}
                      </h2>
                      <p className="text-sm font-medium text-[#8b95a1]">
                        {trips.find((t) => t.id === selectedTripId)?.startDate} ~{" "}
                        {trips.find((t) => t.id === selectedTripId)?.endDate}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setIsTransModalOpen(true)}
                    className="bg-[#3182f6] hover:bg-[#1b64da] rounded-xl h-11 px-6 font-bold"
                  >
                    내역 추가하기
                  </Button>
                </div>

                {/* Timeline */}
                <div className="space-y-10 relative before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-px before:bg-[#f2f4f6]">
                  {[
                    {
                      date: "3월 1일",
                      items: [
                        {
                          category: "항공",
                          memo: "에어서울 RS712",
                          amount: 280000,
                          icon: Plane,
                          time: "10:30",
                        },
                        {
                          category: "숙박",
                          memo: "호텔 닛코 오사카",
                          amount: 450000,
                          icon: Bed,
                          time: "15:00",
                        },
                      ],
                    },
                    {
                      date: "3월 2일",
                      items: [
                        {
                          category: "식비",
                          memo: "이치란 라멘",
                          amount: 12500,
                          icon: Utensils,
                          time: "12:10",
                        },
                        {
                          category: "관광",
                          memo: "오사카성 입장권",
                          amount: 8000,
                          icon: MapPin,
                          time: "14:30",
                        },
                        {
                          category: "쇼핑",
                          memo: "돈키호테 털이",
                          amount: 156000,
                          icon: ShoppingBag,
                          time: "20:00",
                        },
                      ],
                    },
                  ].map((day, dIdx) => (
                    <div key={day.date} className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white border-4 border-[#3182f6] flex items-center justify-center text-[11px] font-bold shadow-sm">
                          D{dIdx + 1}
                        </div>
                        <h4 className="text-lg font-bold text-[#191f28]">
                          {day.date}
                        </h4>
                      </div>
                      <div className="ml-14 space-y-4">
                        {day.items.map((item, idx) => (
                          <Card
                            key={idx}
                            className="p-5 bg-white border-none shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-3xl flex items-center justify-between hover:scale-[1.01] transition-transform"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-[#8b95a1]">
                                <item.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#191f28]">
                                  {item.memo}
                                </p>
                                <p className="text-[11px] font-medium text-[#adb5bd]">
                                  {item.time} • {item.category}
                                </p>
                              </div>
                            </div>
                            <p className="text-lg font-bold text-[#191f28]">
                              ₩ {item.amount.toLocaleString()}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-80 space-y-8">
                <Card className="p-8 bg-[#191f28] text-white border-none rounded-[32px] shadow-2xl relative overflow-hidden">
                  <h3 className="text-sm font-bold text-[#8b95a1] mb-8 relative z-10">
                    여행 예산 요약
                  </h3>
                  <div className="space-y-8 relative z-10">
                    <div>
                      <p className="text-xs text-[#8b95a1] mb-1.5">쓴 금액</p>
                      <p className="text-3xl font-bold font-mono-num">₩ 906,500</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#8b95a1] mb-1.5">남은 금액</p>
                      <p className="text-3xl font-bold text-[#3182f6] font-mono-num">
                        ₩ 593,500
                      </p>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                      <div className="flex justify-between text-[11px] font-bold mb-3">
                        <span className="text-[#8b95a1]">예산 소진율</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3182f6] transition-all duration-1000"
                          style={{ width: "60%" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#3182f6] opacity-10 rounded-full blur-3xl" />
                </Card>

                <Card className="p-8 bg-white border-none rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-base font-bold text-[#191f28] mb-6">
                    지출 카테고리
                  </h3>
                  <div className="space-y-5">
                    {[
                      { name: "숙박", val: 50, color: "#3182f6" },
                      { name: "항공/교통", val: 30, color: "#4caf50" },
                      { name: "쇼핑", val: 15, color: "#f59e0b" },
                      { name: "식비", val: 5, color: "#f04452" },
                    ].map((c) => (
                      <div key={c.name} className="flex items-center gap-4">
                        <div
                          className="w-1.5 h-4 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-sm font-bold text-[#4e5968] flex-1">
                          {c.name}
                        </span>
                        <span className="text-sm font-bold text-[#191f28]">
                          {c.val}%
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-8 bg-[#f9fafb] border-none rounded-[32px]">
                   <h3 className="text-sm font-bold text-[#191f28] mb-4">내보내기</h3>
                   <p className="text-xs text-[#8b95a1] mb-6 leading-relaxed">
                     여행의 지출 내역을 CSV 파일이나 엑셀로 내보내어 공유할 수 있습니다.
                   </p>
                   <Button variant="outline" className="w-full rounded-2xl border-[#e5e8eb] font-bold text-sm h-11">
                     파일로 저장하기
                   </Button>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button (Only on trip list) */}
      {!selectedTripId && (
        <button 
          className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-[#191f28] text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group overflow-hidden"
        >
          <Plus className="h-8 w-8 relative z-10" />
          <div className="absolute inset-0 bg-[#3182f6] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      )}
    </main>
  );
}
