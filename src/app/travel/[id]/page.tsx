"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  MoreVertical,
  Plus,
  Info,
  Users,
  BarChart3,
  Receipt,
  ArrowRight,
  Wallet,
  MoreHorizontal,
} from "lucide-react";
import Header from "@/components/common/Header";
import { format, isSameDay, eachDayOfInterval, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Utensils,
  Bus,
  ShoppingBag,
  Clapperboard,
  FileText,
} from "lucide-react";
import TravelEntryBottomSheet from "@/components/travel/TravelEntryBottomSheet";
import TripEditBottomSheet from "@/components/travel/TripEditBottomSheet";
import TripReportBottomSheet from "@/components/travel/TripReportBottomSheet";
import DetailHeader from "@/components/common/DetailHeader";

interface TravelExpense {
  id: string;
  date: Date;
  amount: number;
  category: string;
  memo: string;
  payer: string;
  participants: string[];
  isPreTrip: boolean;
}

interface ExchangeRateInfo {
  rate: number;
  baseCurrency: string;
  quoteCurrency: string;
  announcedAt: string;
}

type ExpenseViewMode = "all" | "preTrip" | "trip";

const CATEGORY_MAP: Record<string, { icon: any; color: string }> = {
  식비: { icon: Utensils, color: "#3B82F6" },
  교통: { icon: Bus, color: "#F59E0B" },
  쇼핑: { icon: ShoppingBag, color: "#EC4899" },
  숙소: { icon: FileText, color: "#10B981" },
  관광: { icon: Clapperboard, color: "#8B5CF6" },
  기타: { icon: FileText, color: "#94A3B8" },
};

const MOCK_EXCHANGE_RATES: Record<string, ExchangeRateInfo> = {
  "2024-03-25": {
    rate: 8.92,
    baseCurrency: "JPY",
    quoteCurrency: "KRW",
    announcedAt: "2024-03-25",
  },
  "2024-03-26": {
    rate: 8.97,
    baseCurrency: "JPY",
    quoteCurrency: "KRW",
    announcedAt: "2024-03-26",
  },
  "2024-03-27": {
    rate: 9.01,
    baseCurrency: "JPY",
    quoteCurrency: "KRW",
    announcedAt: "2024-03-27",
  },
  "2024-03-28": {
    rate: 9.05,
    baseCurrency: "JPY",
    quoteCurrency: "KRW",
    announcedAt: "2024-03-28",
  },
};

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = params.id;

  const [trip, setTrip] = useState({
    id: tripId,
    title: searchParams.get("title") || "후쿠오카 먹방 여행",
    country: searchParams.get("country") || "일본",
    currency: searchParams.get("currency") || "JPY",
    currencySymbol: searchParams.get("currencySymbol") || "¥",
    startDate: new Date(searchParams.get("startDate") || "2024-03-25"),
    endDate: new Date(searchParams.get("endDate") || "2024-03-28"),
    totalBudget: Number(searchParams.get("totalBudget") || "800000"),
    members: ["나", "철수", "영희"],
  });

  const [expenses, setExpenses] = useState<TravelExpense[]>([
    {
      id: "e1",
      date: new Date("2024-03-25"),
      amount: 5500,
      category: "식비",
      memo: "이치란 라멘",
      payer: "나",
      participants: ["나", "철수", "영희"],
      isPreTrip: false,
    },
    {
      id: "e2",
      date: new Date("2024-03-25"),
      amount: 1200,
      category: "교통",
      memo: "지하철 패스",
      payer: "철수",
      participants: ["나", "철수", "영희"],
      isPreTrip: false,
    },
    {
      id: "e3",
      date: new Date("2024-03-26"),
      amount: 8000,
      category: "숙소",
      memo: "에어비앤비 추가금",
      payer: "영희",
      participants: ["나", "철수", "영희"],
      isPreTrip: false,
    },
    {
      id: "e4",
      date: new Date("2024-03-20"),
      amount: 28600,
      category: "기타",
      memo: "여행자 보험",
      payer: "나",
      participants: ["나", "철수", "영희"],
      isPreTrip: true,
    },
  ]);

  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<TravelExpense | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expenseViewMode, setExpenseViewMode] =
    useState<ExpenseViewMode>("all");

  const handleOpenEntry = (expense?: TravelExpense) => {
    setEditingExpense(expense || null);
    setIsEntryOpen(true);
  };

  const handleSaveExpense = (newExpense: TravelExpense) => {
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === newExpense.id ? newExpense : e)),
      );
    } else {
      setExpenses((prev) => [newExpense, ...prev]);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleOpenTripEditPage = () => {
    const nextParams = new URLSearchParams({
      title: trip.title,
      country: trip.country,
      currency: trip.currency,
      currencySymbol: trip.currencySymbol,
      startDate: format(trip.startDate, "yyyy-MM-dd"),
      endDate: format(trip.endDate, "yyyy-MM-dd"),
      totalBudget: String(trip.totalBudget),
    });

    setIsEditOpen(false);
    router.push(`/travel/${tripId}/edit?${nextParams.toString()}`);
  };

  const handlePendingExport = (fileType: string) => {
    setIsEditOpen(false);
    window.alert(`${fileType} 내보내기는 준비 중이에요.`);
  };

  const handleDeleteTrip = () => {
    const shouldDelete = window.confirm("이 여행을 삭제하시겠습니까?");
    if (!shouldDelete) return;

    setIsEditOpen(false);
    window.alert("여행이 삭제되었다고 가정하고 목록으로 이동할게요.");
    router.push("/travel");
  };

  const exportToCSV = () => {
    const headers =
      "날짜,구분,카테고리,메모,금액,통화,원화금액,결제자,참여멤버\n";
    const rows = expenses
      .map((ex) => {
        const dateStr = format(ex.date, "yyyy-MM-dd");
        const krwAmount = ex.isPreTrip
          ? ex.amount
          : convertToKrw(ex.amount, ex.date, false);
        return `${dateStr},${ex.isPreTrip ? "여행 전" : "여행 중"},${ex.category},${ex.memo},${ex.amount},${ex.isPreTrip ? "KRW" : trip.currency},${krwAmount ?? ""},${ex.payer},"${ex.participants.join(", ")}"`;
      })
      .join("\n");
    const csvContent = "\uFEFF" + headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `wealthfolio_travel_${trip.title}_${format(new Date(), "yyyyMMdd")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tripDays = eachDayOfInterval({
    start: trip.startDate,
    end: trip.endDate,
  });

  const tripExpenses = expenses.filter((expense) => !expense.isPreTrip);
  const preTripExpenses = expenses.filter((expense) => expense.isPreTrip);
  const totalSpent = tripExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = trip.totalBudget - totalSpent;
  const modeFilteredExpenses = expenses.filter((expense) => {
    if (expenseViewMode === "preTrip") return expense.isPreTrip;
    if (expenseViewMode === "trip") return !expense.isPreTrip;
    return true;
  });
  const visibleExpenses = modeFilteredExpenses.filter(
    (e) =>
      expenseViewMode === "preTrip" ||
      !selectedDate ||
      isSameDay(e.date, selectedDate),
  );
  const visibleSpent = visibleExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getExchangeRateForDate = (date: Date) =>
    MOCK_EXCHANGE_RATES[format(date, "yyyy-MM-dd")] ?? null;

  const convertToKrw = (amount: number, date: Date, isPreTrip = false) => {
    if (isPreTrip) return amount;
    const exchangeRate = getExchangeRateForDate(date);
    if (!exchangeRate) return null;
    return Math.round(amount * exchangeRate.rate);
  };

  const sumAmountInKrw = (items: TravelExpense[]) => {
    let hasMissingRate = false;

    const total = items.reduce((sum, expense) => {
      const krwAmount = convertToKrw(
        expense.amount,
        expense.date,
        expense.isPreTrip,
      );
      if (krwAmount === null) {
        hasMissingRate = true;
        return sum;
      }
      return sum + krwAmount;
    }, 0);

    return hasMissingRate ? null : total;
  };

  const formatAmount = (amount: number, locale = "ko-KR") =>
    amount.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const formatKrw = (amount: number | null) =>
    amount === null ? "환율 정보 없음" : `₩${formatAmount(amount, "ko-KR")}`;

  const formatExchangeRateLabel = (date: Date) => {
    const exchangeRate = getExchangeRateForDate(date);
    if (!exchangeRate) return "해당 일자의 환율 정보가 없어요.";
    return `1 ${exchangeRate.baseCurrency} = ${exchangeRate.rate.toFixed(2)}원`;
  };

  const formatExpensePrimaryAmount = (expense: TravelExpense) =>
    expense.isPreTrip
      ? `₩${formatAmount(expense.amount, "ko-KR")}`
      : `${trip.currencySymbol}${formatAmount(expense.amount)}`;

  const formatExpenseSecondaryAmount = (expense: TravelExpense) =>
    expense.isPreTrip
      ? "한국 결제"
      : formatKrw(convertToKrw(expense.amount, expense.date, false));

  const formatGroupPrimaryAmount = (items: TravelExpense[]) => {
    if (items.every((expense) => expense.isPreTrip)) {
      return `₩${formatAmount(
        items.reduce((sum, item) => sum + item.amount, 0),
        "ko-KR",
      )}`;
    }

    if (items.every((expense) => !expense.isPreTrip)) {
      return `${trip.currencySymbol}${formatAmount(
        items.reduce((sum, item) => sum + item.amount, 0),
      )}`;
    }

    return formatKrw(sumAmountInKrw(items));
  };

  const formatGroupSecondaryAmount = (items: TravelExpense[]) => {
    if (items.every((expense) => expense.isPreTrip)) {
      return "여행 전 지출";
    }

    if (items.every((expense) => !expense.isPreTrip)) {
      return formatKrw(sumAmountInKrw(items));
    }

    return "여행 전/중 합산";
  };

  const totalSpentKrw = sumAmountInKrw(tripExpenses);
  const preTripSpentKrw = sumAmountInKrw(preTripExpenses);
  const visibleSpentKrw = sumAmountInKrw(visibleExpenses);
  const entryReferenceDate = editingExpense?.date || selectedDate || new Date();
  const isPreTripOnlyView = expenseViewMode === "preTrip";

  const viewTitle =
    expenseViewMode === "preTrip"
      ? "여행 전 지출"
      : expenseViewMode === "trip"
        ? selectedDate
          ? format(selectedDate, "M월 d일 (E)", { locale: ko })
          : "여행 중 지출"
        : selectedDate
          ? format(selectedDate, "M월 d일 (E)", { locale: ko })
          : "전체 지출 내역";

  return (
    <main className="flex-1 flex flex-col bg-app-bg min-h-screen">
      <DetailHeader
        title={trip.title}
        showBack
        onBack={() => router.push("/travel")}
        rightAction={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsReportOpen(true)}
              className="p-2 text-slate-400 hover:text-primary transition-colors"
            >
              <BarChart3 size={20} />
            </button>
            <button
              onClick={() => setIsEditOpen(true)}
              className="p-1 text-gray-600"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Summary Dashboard */}
        <div className="bg-white dark:bg-slate-900 rounded-b-4xl p-5 shadow-sm border-b border-slate-50 dark:border-slate-800 mb-6 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all" />

          <div className="flex flex-col gap-4 relative z-10">
            {selectedDate ? (
              // Daily Dashboard (2-row)
              <>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-0.5">
                      {Math.floor(
                        (selectedDate.getTime() - trip.startDate.getTime()) /
                          (1000 * 60 * 60 * 24),
                      ) + 1}
                      일차 지출
                    </p>
                    <h3 className="text-[16px] font-black text-foreground">
                      {format(selectedDate, "M.d (E)", { locale: ko })}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      오늘 쓴 금액
                    </p>
                    <p className="text-[20px] font-black text-foreground tracking-tight">
                      <span className="text-primary mr-0.5">
                        {trip.currencySymbol}
                      </span>
                      {formatAmount(visibleSpent)}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1">
                      {formatKrw(visibleSpentKrw)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-300">
                    <Info size={14} className="text-primary" />
                    <span>지출일 환율 기준 원화 환산</span>
                  </div>
                  <p className="text-[11px] font-black text-slate-600 dark:text-slate-200">
                    {formatExchangeRateLabel(selectedDate)}
                  </p>
                </div>
              </>
            ) : (
              // All Trip Dashboard (2-row)
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-md uppercase">
                      {trip.country} • {trip.currency}
                    </span>
                    <p className="text-[12px] font-bold text-slate-500">
                      {format(trip.startDate, "M.dd")} -{" "}
                      {format(trip.endDate, "M.dd")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                    <span>
                      예산 {trip.currencySymbol}
                      {formatAmount(trip.totalBudget)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-bold text-slate-600">
                      여행 중 지출
                    </p>
                    <h2 className="text-[26px] font-black tracking-tighter text-foreground">
                      <span className="text-primary mr-1">
                        {trip.currencySymbol}
                      </span>
                      {formatAmount(totalSpent)}
                    </h2>
                    <p className="text-[12px] font-bold text-slate-400">
                      {formatKrw(totalSpentKrw)}
                    </p>
                  </div>
                  <div className="text-right pb-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      남은 예산
                    </p>
                    <p className="text-[14px] font-extrabold text-slate-700 dark:text-slate-400">
                      {formatAmount(remainingBudget)}
                    </p>
                  </div>
                </div>

                {/* <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      여행 전 지출
                    </p>
                    <p className="text-[18px] font-black text-foreground mt-1">
                      {formatKrw(preTripSpentKrw)}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1">
                      한국에서 쓴 준비 비용
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      현지 지출 원화 환산
                    </p>
                    <p className="text-[18px] font-black text-foreground mt-1">
                      {formatKrw(totalSpentKrw)}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1">
                      지출일 환율 기준
                    </p>
                  </div>
                </div> */}

                {/* <div className="flex items-center gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
                  <Info size={14} className="text-primary shrink-0" />
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-300">
                    여행 전 지출은 원화로, 현지 지출은 각 지출일 환율 기준 원화로 정리돼요.
                  </p>
                </div> */}
              </>
            )}
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-6 px-7 no-scrollbar">
          <button
            onClick={() => {
              setExpenseViewMode("all");
              setSelectedDate(null);
            }}
            className={`shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${
              expenseViewMode === "all" && selectedDate === null
                ? "bg-foreground text-background shadow-md"
                : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-50 dark:border-slate-800"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => {
              setExpenseViewMode("preTrip");
              setSelectedDate(null);
            }}
            className={`shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${
              expenseViewMode === "preTrip"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-50 dark:border-slate-800"
            }`}
          >
            여행 전
          </button>
          {tripDays.map((day, idx) => (
            <button
              key={idx}
              onClick={() => {
                setExpenseViewMode("trip");
                setSelectedDate(day);
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all text-center min-w-[55px] ${
                expenseViewMode === "trip" &&
                selectedDate &&
                isSameDay(selectedDate, day)
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-50 dark:border-slate-800"
              }`}
            >
              <p className="text-[9px] opacity-60 mb-0">{idx + 1}일차</p>
              {format(day, "M.d")}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-[15px] font-extrabold text-foreground opacity-90">
            {viewTitle}
          </h3>
          <div className="text-right">
            <p className="text-[12px] font-bold text-gray-500">
              합계 {formatKrw(visibleSpentKrw)}
            </p>
            <p className="text-[10px] font-bold text-gray-500 mt-0.5">
              {visibleExpenses.every((expense) => expense.isPreTrip)
                ? `원화 ${formatAmount(visibleSpent, "ko-KR")}원`
                : `${trip.currency} ${formatAmount(visibleSpent)}`}
            </p>
          </div>
        </div>

        <div className=" shadow-sm overflow-hidden mb-20 px-4">
          {(() => {
            const filtered = visibleExpenses.sort(
              (a, b) => b.date.getTime() - a.date.getTime(),
            );

            if (filtered.length === 0) {
              return (
                <div className="py-16 text-center text-[13px] font-bold text-slate-300">
                  내역이 없습니다.
                </div>
              );
            }

            // Group by date if "All" is selected
            if (!selectedDate || isPreTripOnlyView) {
              const groups: Record<string, TravelExpense[]> = {};
              filtered.forEach((ex) => {
                const d = format(ex.date, "yyyy-MM-dd");
                if (!groups[d]) groups[d] = [];
                groups[d].push(ex);
              });

              return Object.entries(groups).map(
                ([dateStr, items], groupIdx) => (
                  <div key={dateStr} className={groupIdx !== 0 ? "mt-2" : ""}>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        {format(new Date(dateStr), "M월 d일 (E)", {
                          locale: ko,
                        })}
                      </span>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-300 uppercase">
                          {formatGroupPrimaryAmount(items)}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {formatGroupSecondaryAmount(items)}
                        </p>
                      </div>
                    </div>
                    {items.map((ex, idx, arr) => {
                      const catInfo =
                        CATEGORY_MAP[ex.category] || CATEGORY_MAP["기타"];
                      const Icon = catInfo.icon;
                      return (
                        <button
                          key={ex.id}
                          onClick={() => handleOpenEntry(ex)}
                          className={`w-full flex justify-between items-center group text-left outline-none p-5 active:bg-slate-50 dark:active:bg-slate-800/50 transition-all ${
                            idx !== arr.length - 1
                              ? "border-b border-slate-50 dark:border-slate-800/50"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all outline-none"
                              style={{
                                backgroundColor: `${catInfo.color}15`,
                                color: catInfo.color,
                              }}
                            >
                              <Icon size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                              <h4 className="text-[14px] font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors line-clamp-1">
                                {ex.memo}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400">
                                  {ex.payer}
                                </span>
                                {ex.isPreTrip && (
                                  <>
                                    <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                                    <span className="text-[10px] font-black text-primary">
                                      여행 전
                                    </span>
                                  </>
                                )}
                                <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                                <span className="text-[10px] font-bold text-slate-300">
                                  {ex.participants.length}명
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[16px] font-black text-foreground tracking-tight">
                              {formatExpensePrimaryAmount(ex)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                              {formatExpenseSecondaryAmount(ex)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                              {ex.category}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ),
              );
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
                    idx !== arr.length - 1
                      ? "border-b border-slate-50 dark:border-slate-800/50"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all outline-none"
                      style={{
                        backgroundColor: `${catInfo.color}15`,
                        color: catInfo.color,
                      }}
                    >
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors line-clamp-1">
                        {ex.memo}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">
                          {ex.payer}
                        </span>
                        {ex.isPreTrip && (
                          <>
                            <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-black text-primary">
                              여행 전
                            </span>
                          </>
                        )}
                        <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-300">
                          {ex.participants.length}명
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-black text-foreground tracking-tight">
                      {formatExpensePrimaryAmount(ex)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                      {formatExpenseSecondaryAmount(ex)}
                    </p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                      {ex.category}
                    </p>
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
            className="absolute right-6 bottom-0 w-12 h-12 bg-primary text-white rounded-full shadow-xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      <TravelEntryBottomSheet
        isOpen={isEntryOpen}
        onClose={() => setIsEntryOpen(false)}
        members={trip.members}
        currencyCode={trip.currency}
        currencySymbol={trip.currencySymbol}
        referenceDate={entryReferenceDate}
        exchangeRatesByDate={MOCK_EXCHANGE_RATES}
        initialData={editingExpense}
        onAdd={handleSaveExpense}
        onDelete={handleDeleteExpense}
      />

      <TripEditBottomSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onEditTrip={handleOpenTripEditPage}
        onExportPDF={() => handlePendingExport("PDF")}
        onExportExcel={() => handlePendingExport("Excel")}
        onExportCSV={() => {
          setIsEditOpen(false);
          exportToCSV();
        }}
        onDeleteTrip={handleDeleteTrip}
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
