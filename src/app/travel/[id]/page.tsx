"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MoreVertical, Plus, Info, Users, BarChart3, Receipt, ArrowRight, Wallet, Download } from "lucide-react";
import Header from "@/components/common/Header";
import { format, isSameDay, eachDayOfInterval, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { Utensils, Bus, ShoppingBag, Clapperboard, FileText } from "lucide-react";
import TravelEntryBottomSheet from "@/components/travel/TravelEntryBottomSheet";
import TripEditBottomSheet from "@/components/travel/TripEditBottomSheet";
import TripReportBottomSheet from "@/components/travel/TripReportBottomSheet";

interface TravelExpense {
  id: string;
  date: Date;
  amount: number;
  category: string;
  memo: string;
  payer: string;
  participants: string[];
}

const CATEGORY_MAP: Record<string, { icon: any, color: string }> = {
  "식비": { icon: Utensils, color: "#3B82F6" },
  "교통": { icon: Bus, color: "#F59E0B" },
  "쇼핑": { icon: ShoppingBag, color: "#EC4899" },
  "숙소": { icon: FileText, color: "#10B981" },
  "관광": { icon: Clapperboard, color: "#8B5CF6" },
  "기타": { icon: FileText, color: "#94A3B8" },
};

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id;

  const [trip, setTrip] = useState({
    id: tripId,
    title: "후쿠오카 먹방 여행",
    country: "일본",
    currency: "JPY",
    currencySymbol: "¥",
    startDate: new Date("2024-03-25"),
    endDate: new Date("2024-03-28"),
    totalBudget: 800000,
    members: ["나", "철수", "영희"],
  });

  const [expenses, setExpenses] = useState<TravelExpense[]>([
    { id: "e1", date: new Date("2024-03-25"), amount: 5500, category: "식비", memo: "이치란 라멘", payer: "나", participants: ["나", "철수", "영희"] },
    { id: "e2", date: new Date("2024-03-25"), amount: 1200, category: "교통", memo: "지하철 패스", payer: "철수", participants: ["나", "철수", "영희"] },
    { id: "e3", date: new Date("2024-03-26"), amount: 8000, category: "숙소", memo: "에어비앤비 추가금", payer: "영희", participants: ["나", "철수", "영희"] },
  ]);

  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<TravelExpense | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleOpenEntry = (expense?: TravelExpense) => {
    setEditingExpense(expense || null);
    setIsEntryOpen(true);
  };

  const handleSaveExpense = (newExpense: TravelExpense) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.id === newExpense.id ? newExpense : e));
    } else {
      setExpenses(prev => [newExpense, ...prev]);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const exportToCSV = () => {
    const headers = "날짜,카테고리,메모,금액,결제자,참여멤버\n";
    const rows = expenses.map(ex => {
      const dateStr = format(ex.date, "yyyy-MM-dd");
      return `${dateStr},${ex.category},${ex.memo},${ex.amount},${ex.payer},"${ex.participants.join(", ")}"`;
    }).join("\n");
    const csvContent = "\uFEFF" + headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `wealthfolio_travel_${trip.title}_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tripDays = eachDayOfInterval({
    start: trip.startDate,
    end: trip.endDate
  });

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = trip.totalBudget - totalSpent;

  return (
    <main className="flex-1 flex flex-col bg-app-bg min-h-screen">
      <Header 
        title={trip.title} 
        showBack 
        onBack={() => router.push("/travel")}
        rightAction={
          <div className="flex items-center gap-1">
            <button 
              onClick={exportToCSV}
              className="p-2 text-slate-400 hover:text-primary transition-colors"
              title="CSV 내보내기"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => setIsReportOpen(true)} 
              className="p-2 text-slate-400 hover:text-primary transition-colors"
            >
              <BarChart3 size={20} />
            </button>
            <button 
              onClick={() => setIsEditOpen(true)} 
              className="p-2 text-slate-400 hover:text-primary transition-colors"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto px-7 py-6">
        {/* Summary Dashboard */}
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-5 shadow-sm border border-slate-50 dark:border-slate-800 mb-6 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all" />
          
          <div className="flex flex-col gap-4 relative z-10">
            {selectedDate ? (
              // Daily Dashboard (2-row)
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-0.5">
                    {Math.floor((selectedDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1}일차 지출
                  </p>
                  <h3 className="text-[16px] font-black text-foreground">{format(selectedDate, "M.d (E)", { locale: ko })}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">오늘 쓴 금액</p>
                  <p className="text-[20px] font-black text-foreground tracking-tight">
                    <span className="text-primary mr-0.5">{trip.currencySymbol}</span>
                    {expenses.filter(e => isSameDay(e.date, selectedDate)).reduce((s, e) => s + e.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              // All Trip Dashboard (2-row)
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-md uppercase">
                      {trip.country} • {trip.currency}
                    </span>
                    <p className="text-[12px] font-bold text-slate-500">
                      {format(trip.startDate, "M.dd")} - {format(trip.endDate, "M.dd")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                    <span>예산 {trip.currencySymbol}{trip.totalBudget.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-bold text-slate-600">남은 예산</p>
                    <h2 className="text-[26px] font-black tracking-tighter text-foreground">
                      <span className="text-primary mr-1">{trip.currencySymbol}</span>
                      {remainingBudget.toLocaleString()}
                    </h2>
                  </div>
                  <div className="text-right pb-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">총 지출</p>
                    <p className="text-[14px] font-extrabold text-slate-700 dark:text-slate-400">
                      {trip.currencySymbol}{totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-4 mb-2 -mx-7 px-7 no-scrollbar">
          <button
            onClick={() => setSelectedDate(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${
              selectedDate === null
              ? "bg-foreground text-background shadow-md"
              : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-50 dark:border-slate-800"
            }`}
          >
            전체
          </button>
          {tripDays.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all text-center min-w-[55px] ${
                selectedDate && isSameDay(selectedDate, day)
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-50 dark:border-slate-800"
              }`}
            >
              <p className="text-[9px] opacity-60 mb-0">{idx + 1}일차</p>
              {format(day, "M.d")}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-1 mb-6 mt-4">
          <h3 className="text-[15px] font-extrabold text-foreground opacity-90">
            {selectedDate ? format(selectedDate, "M월 d일 (E)", { locale: ko }) : "전체 지출 내역"}
          </h3>
          <span className="text-[12px] font-bold text-slate-300">
            합계 {expenses.filter(e => !selectedDate || isSameDay(e.date, selectedDate)).reduce((s,e)=>s+e.amount, 0).toLocaleString()}{trip.currencySymbol}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden mb-20">
          {(() => {
            const filtered = expenses.filter(ex => !selectedDate || isSameDay(ex.date, selectedDate))
              .sort((a, b) => b.date.getTime() - a.date.getTime());

            if (filtered.length === 0) {
              return <div className="py-16 text-center text-[13px] font-bold text-slate-300">내역이 없습니다.</div>;
            }

            // Group by date if "All" is selected
            if (!selectedDate) {
              const groups: Record<string, TravelExpense[]> = {};
              filtered.forEach(ex => {
                const d = format(ex.date, "yyyy-MM-dd");
                if (!groups[d]) groups[d] = [];
                groups[d].push(ex);
              });

              return Object.entries(groups).map(([dateStr, items], groupIdx) => (
                <div key={dateStr} className={groupIdx !== 0 ? "mt-2" : ""}>
                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/30 flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      {format(new Date(dateStr), "M월 d일 (E)", { locale: ko })}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                      {items.reduce((s, i) => s + i.amount, 0).toLocaleString()}{trip.currencySymbol}
                    </span>
                  </div>
                  {items.map((ex, idx, arr) => {
                    const catInfo = CATEGORY_MAP[ex.category] || CATEGORY_MAP["기타"];
                    const Icon = catInfo.icon;
                    return (
                      <button 
                        key={ex.id} 
                        onClick={() => handleOpenEntry(ex)}
                        className={`w-full flex justify-between items-center group text-left outline-none p-5 active:bg-slate-50 dark:active:bg-slate-800/50 transition-all ${
                          idx !== arr.length - 1 ? "border-b border-slate-50 dark:border-slate-800/50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all outline-none"
                            style={{ backgroundColor: `${catInfo.color}15`, color: catInfo.color }}
                          >
                            <Icon size={18} strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="text-[14px] font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors line-clamp-1">{ex.memo}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400">{ex.payer}</span>
                              <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                              <span className="text-[10px] font-bold text-slate-300">{ex.participants.length}명</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[16px] font-black text-foreground tracking-tight">{ex.amount.toLocaleString()}{trip.currencySymbol}</p>
                          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{ex.category}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ));
            }

            // Single day view
            return filtered.map((ex, idx, arr) => {
              const catInfo = CATEGORY_MAP[ex.category] || CATEGORY_MAP["기타"];
              const Icon = catInfo.icon;
              return (
                <button 
                  key={ex.id} 
                  onClick={() => handleOpenEntry(ex)}
                  className={`w-full flex justify-between items-center group text-left outline-none p-5 active:bg-slate-50 dark:active:bg-slate-800/50 transition-all ${
                    idx !== arr.length - 1 ? "border-b border-slate-50 dark:border-slate-800/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all outline-none"
                      style={{ backgroundColor: `${catInfo.color}15`, color: catInfo.color }}
                    >
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors line-clamp-1">{ex.memo}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">{ex.payer}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-300">{ex.participants.length}명</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-black text-foreground tracking-tight">{ex.amount.toLocaleString()}{trip.currencySymbol}</p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{ex.category}</p>
                  </div>
                </button>
              );
            });
          })()}
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[600px] pointer-events-none z-40">
        <div className="relative w-full h-full">
          <button
            onClick={() => handleOpenEntry()}
            className="absolute right-6 bottom-0 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>
      </div>

      <TravelEntryBottomSheet 
        isOpen={isEntryOpen}
        onClose={() => setIsEntryOpen(false)}
        members={trip.members}
        currencySymbol={trip.currencySymbol}
        initialData={editingExpense}
        onAdd={handleSaveExpense}
        onDelete={handleDeleteExpense}
      />

      <TripEditBottomSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        trip={trip}
        onSave={(updatedTrip) => setTrip(prev => ({ ...prev, ...updatedTrip }))}
      />

      <TripReportBottomSheet
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        trip={trip}
        expenses={expenses}
      />

    </main>
  );
}
