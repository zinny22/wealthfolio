"use client";

import React, { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  subDays,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: "income" | "expense";
}

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  transactions: Transaction[];
  onDateClick?: (date: Date) => void;
  viewMode: "month" | "week";
  onViewModeChange: (mode: "month" | "week") => void;
}

import SegmentedControl from "@/components/common/SegmentedControl";

export default function Calendar({
  currentDate,
  setCurrentDate,
  transactions,
  onDateClick,
  viewMode,
  onViewModeChange,
}: CalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  const calendarDays = useMemo(() => {
    if (viewMode === "month") {
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      return eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      const startDate = startOfWeek(currentDate);
      const endDate = endOfWeek(currentDate);
      return eachDayOfInterval({ start: startDate, end: endDate });
    }
  }, [currentDate, monthStart, monthEnd, viewMode]);

  const getDayTransactions = (day: Date) => {
    return transactions.filter((tx) => isSameDay(tx.date, day));
  };

  const nextRange = () => {
    if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 7));
  };
  
  const prevRange = () => {
    if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 7));
  };

  return (
    <section className="px-7 py-4 flex flex-col bg-background">
      {/* Range Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-extrabold tracking-tight text-foreground">
          {viewMode === "month" 
            ? format(currentDate, "yyyy년 M월", { locale: ko })
            : `${format(startOfWeek(currentDate, { locale: ko }), "M.d")} ~ ${format(endOfWeek(currentDate, { locale: ko }), "M.d")}`
          }
        </h3>
        <div className="flex gap-1">
          <button onClick={prevRange} className="p-2 text-slate-300 hover:text-primary transition-colors active:scale-90">
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button onClick={nextRange} className="p-2 text-slate-300 hover:text-primary transition-colors active:scale-90">
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-3">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
          <div
            key={day}
            className={`text-center text-[11px] font-bold ${
              i === 0 ? "text-rose-400/80" : i === 6 ? "text-primary/70" : "text-slate-300"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day) => {
          const dayTransactions = getDayTransactions(day);
          const totalExpense = dayTransactions
            .filter((tx) => tx.type === "expense")
            .reduce((sum, tx) => sum + tx.amount, 0);
          const totalIncome = dayTransactions
            .filter((tx) => tx.type === "income")
            .reduce((sum, tx) => sum + tx.amount, 0);
          
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, currentDate);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick?.(day)}
              className={`min-h-[64px] pt-2 flex flex-col items-center cursor-pointer transition-all rounded-xl ${
                isSelected ? "bg-slate-50 dark:bg-slate-800/30" : "hover:bg-slate-50/50"
              } ${viewMode === "month" && !isSameMonth(day, monthStart) ? "opacity-0 pointer-events-none" : ""}`}
            >
              <div
                className={`text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all ${
                  isToday
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : isSelected
                    ? "text-primary"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {format(day, "d")}
              </div>
              
              {/* Amounts Display */}
              <div className="flex flex-col items-center gap-0.5 mt-2 overflow-hidden w-full px-1">
                {totalIncome > 0 && (
                  <span className="text-[9px] font-extrabold text-primary truncate">
                    {totalIncome.toLocaleString()}
                  </span>
                )}
                {totalExpense > 0 && (
                  <span className="text-[9px] font-extrabold text-slate-300 truncate">
                    {totalExpense.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
