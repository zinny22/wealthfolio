"use client";

import React, { useState } from "react";
import { format, isSameDay, isSameMonth, isSameWeek } from "date-fns";
import { ko } from "date-fns/locale";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/common/Header";
import SegmentedControl from "@/components/common/SegmentedControl";
import BudgetCard from "@/components/household/BudgetCard";
import Calendar from "@/components/household/Calendar";
import EntryBottomSheet from "@/components/household/EntryBottomSheet";
import { PieChart, Utensils, Bus, ShoppingBag, Clapperboard, HeartPulse, GraduationCap, Phone, Home as HomeIcon, Coffee, Gift, Palette, FileText, CreditCard, Wallet } from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  "식비": Utensils,
  "교통": Bus,
  "교통비": Bus,
  "쇼핑": ShoppingBag,
  "문화생활": Clapperboard,
  "의료/건강": HeartPulse,
  "교육": GraduationCap,
  "통신": Phone,
  "주거/통신": HomeIcon,
  "카페": Coffee,
  "선물": Gift,
  "월급": Gift,
  "기타": FileText
};

const CATEGORY_COLORS: Record<string, string> = {
  "식비": "#3B82F6",
  "교통": "#F59E0B",
  "교통비": "#F59E0B",
  "쇼핑": "#EC4899",
  "문화생활": "#8B5CF6",
  "의료/건강": "#EF4444",
  "교육": "#10B981",
  "월급": "#10B981",
};

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: "income" | "expense";
  category: string;
  memo: string;
  paymentMethod: "card" | "cash";
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [budget, setBudget] = useState(1000000);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", date: new Date(), amount: 5000, type: "expense", category: "식비", memo: "점심 쌀국수", paymentMethod: "card" },
    { id: "2", date: new Date(), amount: 12000, type: "expense", category: "교통", memo: "택시비", paymentMethod: "card" },
    { id: "3", date: new Date(), amount: 2500000, type: "income", category: "월급", memo: "3월 월급", paymentMethod: "cash" },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = (amount: number, type: "income" | "expense", category: string, memo: string, paymentMethod: "card" | "cash") => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      amount,
      type,
      category,
      memo,
      paymentMethod,
    };
    setTransactions((prev) => [...prev, newTx]);
  };

  const handleUpdateTransaction = (amount: number, type: "income" | "expense", category: string, memo: string, paymentMethod: "card" | "cash") => {
    if (!editingTransaction) return;
    setTransactions((prev) => prev.map((tx) => 
      tx.id === editingTransaction.id ? { ...tx, amount, type, category, memo, paymentMethod } : tx
    ));
    setIsEditOpen(false);
    setEditingTransaction(null);
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsEditOpen(true);
  };

  const currentSpent = transactions
    .filter((tx) => {
      if (tx.type !== "expense") return false;
      if (viewMode === "month") return isSameMonth(tx.date, currentDate);
      return isSameWeek(tx.date, currentDate, { locale: ko });
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentIncome = transactions
    .filter((tx) => {
      if (tx.type !== "income") return false;
      if (viewMode === "month") return isSameMonth(tx.date, currentDate);
      return isSameWeek(tx.date, currentDate, { locale: ko });
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const selectedDateTransactions = transactions.filter((tx) => isSameDay(tx.date, selectedDate));

  return (
    <main className="flex-1 flex flex-col bg-app-bg min-h-screen">
      <Header 
        title={format(currentDate, "M월", { locale: ko })}
        transparent
        rightAction={
          <button
            onClick={() => alert("통계 페이지로 이동합니다.")}
            className="p-2 text-slate-400 hover:text-primary transition-colors active:scale-90"
          >
            <PieChart size={24} strokeWidth={2.5} />
          </button>
        }
      />

      <div className="px-7 pt-2 flex justify-center">
        <SegmentedControl
          options={[
            { label: "월간", value: "month" },
            { label: "주간", value: "week" },
          ]}
          value={viewMode}
          onChange={(val) => setViewMode(val)}
          className="w-full max-w-[320px]"
        />
      </div>

      <div className="flex-1 flex flex-col pb-36">
        <BudgetCard 
          budget={budget} 
          spent={currentSpent} 
          income={currentIncome}
          currentDate={currentDate}
          isMonthMode={viewMode === "month"}
        />

        <div className="mt-2 flex flex-col">
          <Calendar 
            currentDate={currentDate} 
            setCurrentDate={setCurrentDate} 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            transactions={transactions}
            onDateClick={(date) => {
              setCurrentDate(date);
              setSelectedDate(date);
            }}
          />
        </div>

        <section className="mt-8 px-7">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[17px] font-bold text-foreground opacity-80">
              {format(selectedDate, "M월 d일", { locale: ko })}
            </h4>
            <span className="text-[13px] font-bold text-slate-300">
              {selectedDateTransactions.length}건
            </span>
          </div>

          {selectedDateTransactions.length > 0 ? (
            <div className="flex flex-col gap-5">
              {selectedDateTransactions.map((tx) => {
                const Icon = CATEGORY_ICONS[tx.category] || FileText;
                const iconColor = CATEGORY_COLORS[tx.category] || (tx.type === 'income' ? '#3B82F6' : '#94A3B8');

                return (
                  <button 
                    key={tx.id} 
                    onClick={() => handleEditClick(tx)}
                    className="flex justify-between items-center group text-left w-full outline-none py-1"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-active:scale-95"
                        style={{ backgroundColor: `${iconColor}15`, color: iconColor }}
                      >
                        <Icon size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-[16px] font-bold text-foreground leading-none">{tx.category}</p>
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-400">
                            {tx.paymentMethod === 'card' ? '카드' : '현금'}
                          </span>
                        </div>
                        <p className="text-[13px] font-medium text-slate-300 opacity-80 truncate max-w-[150px]">
                          {tx.memo || "오후 2:30"}
                        </p>
                      </div>
                    </div>
                    <p className={`text-[17px] font-extrabold ${tx.type === 'income' ? 'text-primary' : 'text-foreground'}`}>
                      {tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString()}원
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl opacity-40">
                📊
              </div>
              <p className="text-[16px] font-bold text-slate-300">
                기타 내역이 없어요
              </p>
            </div>
          )}
        </section>
      </div>

      <EntryBottomSheet onAddTransaction={handleAddTransaction} />

      {isEditOpen && editingTransaction && (
        <EntryBottomSheet 
          mode="edit"
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          initialAmount={editingTransaction.amount}
          initialType={editingTransaction.type}
          initialCategory={editingTransaction.category}
          initialMemo={editingTransaction.memo}
          initialPaymentMethod={editingTransaction.paymentMethod}
          onAddTransaction={handleUpdateTransaction}
        />
      )}

      <BottomNav />
    </main>
  );
}
