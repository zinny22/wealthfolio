"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Utensils,
  Bus,
  ShoppingBag,
  Clapperboard,
  FileText,
  Info,
  CalendarDays,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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
  onAdd: (expense: TravelExpenseFormData) => void;
  onDelete?: (id: string) => void;
  members: string[];
  currencyCode: string;
  currencySymbol: string;
  referenceDate: Date;
  exchangeRatesByDate: Record<string, ExchangeRateInfo>;
  initialData?: TravelExpenseFormData | null;
}

interface TravelExpenseFormData {
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

export default function TravelEntryBottomSheet({
  isOpen,
  onClose,
  onAdd,
  onDelete,
  members,
  currencyCode,
  currencySymbol,
  referenceDate,
  exchangeRatesByDate,
  initialData,
}: TravelEntryBottomSheetProps) {
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [category, setCategory] = useState("식비");
  const [memo, setMemo] = useState("");
  const [payer, setPayer] = useState("나");
  const [participants, setParticipants] = useState<string[]>(members);
  const [isPreTripExpense, setIsPreTripExpense] = useState(false);

  const sanitizeAmountInput = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const [integerPart = "", ...decimalParts] = cleaned.split(".");
    const decimalPart = decimalParts.join("").slice(0, 2);

    if (cleaned.startsWith(".")) {
      return decimalPart ? `0.${decimalPart}` : "0.";
    }

    if (cleaned.includes(".")) {
      return `${integerPart}.${decimalPart}`;
    }

    return integerPart;
  };

  const resolvedDateValue = expenseDate || format(referenceDate, "yyyy-MM-dd");
  const resolvedDate = new Date(`${resolvedDateValue}T12:00:00`);
  const currentExchangeRateInfo =
    exchangeRatesByDate[resolvedDateValue] ?? null;
  const activeCurrencyCode = isPreTripExpense ? "KRW" : currencyCode;
  const activeCurrencySymbol = isPreTripExpense ? "₩" : currencySymbol;
  const amountValue = amount ? Number(amount) : 0;
  const displayAmount = amountValue.toLocaleString("ko-KR");
  const convertedAmount =
    amountValue === 0
      ? null
      : isPreTripExpense
        ? amountValue
        : currentExchangeRateInfo
          ? Math.round(amountValue * currentExchangeRateInfo.rate)
          : null;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setAmount(initialData.amount.toString());
        setExpenseDate(format(initialData.date, "yyyy-MM-dd"));
        setCategory(initialData.category);
        setMemo(initialData.memo);
        setPayer(initialData.payer);
        setParticipants(initialData.participants);
        setIsPreTripExpense(initialData.isPreTrip);
      } else {
        setAmount("");
        setExpenseDate(format(referenceDate, "yyyy-MM-dd"));
        setCategory("식비");
        setMemo("");
        setPayer("나");
        setParticipants(members);
        setIsPreTripExpense(false);
      }
    }
  }, [isOpen, initialData, members]);

  const toggleParticipant = (member: string) => {
    if (participants.includes(member)) {
      setParticipants(participants.filter((m) => m !== member));
    } else {
      setParticipants([...participants, member]);
    }
  };

  const handleSave = () => {
    if (!amount || !expenseDate || participants.length === 0) return;

    const parsedAmount = Number.parseFloat(amount);
    if (Number.isNaN(parsedAmount)) return;

    onAdd({
      id: initialData?.id || Math.random().toString(36).slice(2, 11),
      date: new Date(`${expenseDate}T12:00:00`),
      amount: parsedAmount,
      category,
      memo: memo || category,
      payer,
      participants,
      isPreTrip: isPreTripExpense,
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[600px] bg-white dark:bg-slate-900 rounded-t-4xl z-70 shadow-2xl shadow-black/20 max-h-[92vh] flex flex-col overflow-x-hidden"
          >
            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto my-4 shrink-0" />

            <div className="flex-1 overflow-y-auto px-5 pb-4 no-scrollbar">
              <div className="space-y-4 py-2">
                {/* <div className="rounded-[28px] bg-linear-to-br from-indigo-500 to-violet-500 text-white p-5 shadow-lg shadow-indigo-500/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold text-white/70 uppercase">
                        {initialData ? "지출 수정" : "새 지출"}
                      </p>
                      <p className="text-[30px] font-black tracking-tight mt-2">
                        {activeCurrencySymbol} {displayAmount}
                      </p>
                      <div className="mt-2 space-y-0.5 text-[12px] font-semibold text-white/75">
                        <p>
                          {isPreTripExpense
                            ? "한국 결제 금액"
                            : `${activeCurrencyCode} 기준 입력`}
                        </p>
                        <p>
                          {isPreTripExpense
                            ? "원화 그대로 집계"
                            : `환율 ${
                                currentExchangeRateInfo
                                  ? `1 ${currentExchangeRateInfo.baseCurrency} = ${currentExchangeRateInfo.rate.toFixed(2)}원`
                                  : "정보 없음"
                              }`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right pt-1">
                      <p className="text-[11px] font-bold text-white/70">
                        원화 환산
                      </p>
                      <p className="text-[20px] font-black mt-1">
                        {convertedAmount === null
                          ? "-"
                          : `₩${convertedAmount.toLocaleString("ko-KR")}`}
                      </p>
                      <p className="text-[11px] font-semibold text-white/75 mt-1">
                        {format(resolvedDate, "M월 d일 (E)", { locale: ko })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
                    <Info size={14} className="shrink-0 text-white/90" />
                    <p className="text-[11px] font-semibold text-white/85">
                      {isPreTripExpense
                        ? "여행 전에 한국에서 쓴 비용은 원화 기준으로 바로 기록돼요."
                        : "금액은 현지 화폐로 입력하고, 원화는 해당 날짜 환율로 계산돼요."}
                    </p>
                  </div>
                </div> */}

                <div className="rounded-3xl bg-slate-50/90 dark:bg-slate-800/60 p-4 space-y-4">
                  <button
                    onClick={() => setIsPreTripExpense((prev) => !prev)}
                    className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${
                      isPreTripExpense
                        ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                        : "bg-white dark:bg-slate-900 text-slate-500"
                    }`}
                  >
                    <span className="text-[14px] font-black">여행 전 지출</span>
                    <div
                      className={`h-6 w-11 rounded-full p-1 transition-all ${
                        isPreTripExpense
                          ? "bg-primary"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition-transform ${
                          isPreTripExpense ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </button>

                  <input
                    autoFocus
                    type="text"
                    inputMode="decimal"
                    placeholder={`${activeCurrencyCode} 금액 입력`}
                    value={amount}
                    onChange={(e) => setAmount(sanitizeAmountInput(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl text-[24px] font-black outline-none border border-transparent focus:border-primary/20"
                  />

                  <input
                    type="text"
                    placeholder="항목명 또는 메모"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl text-[14px] font-bold outline-none border border-transparent focus:border-primary/20"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <label className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-3">
                      <span className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase">
                        <CalendarDays size={14} />
                        날짜
                      </span>
                      <input
                        type="date"
                        value={expenseDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                        className="mt-2 w-full bg-transparent text-[14px] font-bold outline-none"
                      />
                    </label>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-3">
                      <span className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase">
                        <Wallet size={14} />
                        결제자
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {members.map((member) => (
                          <button
                            key={member}
                            onClick={() => setPayer(member)}
                            className={`px-2.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                              payer === member
                                ? "bg-primary text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            }`}
                          >
                            {member}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50/90 dark:bg-slate-800/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[12px] font-black text-slate-400 uppercase">
                      카테고리
                    </p>
                    <p className="text-[11px] font-bold text-slate-400">
                      탭해서 선택
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {TRAVEL_CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setCategory(cat.name)}
                        className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 transition-all ${
                          category === cat.name
                            ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                            : "bg-white dark:bg-slate-900 text-slate-400"
                        }`}
                      >
                        <cat.icon size={18} strokeWidth={2.4} />
                        <span className="text-[12px] font-bold">
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50/90 dark:bg-slate-800/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[12px] font-black text-slate-400 uppercase">
                      함께한 멤버
                    </p>
                    <button
                      onClick={() =>
                        setParticipants(
                          participants.length === members.length ? [] : members,
                        )
                      }
                      className="text-[11px] font-bold text-primary"
                    >
                      전체{" "}
                      {participants.length === members.length ? "해제" : "선택"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {members.map((member) => (
                      <button
                        key={member}
                        onClick={() => toggleParticipant(member)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                          participants.includes(member)
                            ? "bg-primary text-white"
                            : "bg-white dark:bg-slate-900 text-slate-500"
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full ${
                            participants.includes(member)
                              ? "bg-white/20"
                              : "bg-slate-100 dark:bg-slate-800"
                          }`}
                        >
                          <Check
                            size={10}
                            strokeWidth={4}
                            className={
                              participants.includes(member)
                                ? "text-white"
                                : "text-slate-300"
                            }
                          />
                        </div>
                        <span className="text-[12px] font-bold">{member}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="px-5 pb-6 pt-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="h-12 px-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl text-[14px] font-bold transition-all active:scale-95"
                >
                  취소
                </button>
                {initialData && (
                  <button
                    onClick={handleDelete}
                    className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl flex items-center justify-center transition-all active:scale-95 shrink-0"
                  >
                    <X size={18} strokeWidth={3} />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={
                    !amount || !expenseDate || participants.length === 0
                  }
                  className="flex-1 h-12 bg-primary disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-300 rounded-2xl text-[15px] font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  {initialData ? "수정 완료" : "추가 완료"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
