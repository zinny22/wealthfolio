import { useState, useMemo } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  getDay,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  subDays
} from "date-fns";
import { ko } from "date-fns/locale";
import { useTransactionStore } from "@/store/useTransactionStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarViewProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
  viewMode: "month" | "week" | "day";
}

const WEEKS = ["일", "월", "화", "수", "목", "금", "토"];

export function CalendarView({ onDateSelect, selectedDate, viewMode }: CalendarViewProps) {
  const [currentReferenceDate, setCurrentReferenceDate] = useState(new Date());
  const { transactions, selectedCategoryIds } = useTransactionStore();

  const days = useMemo(() => {
    const ref = selectedDate || currentReferenceDate;
    if (viewMode === "month") {
      const start = startOfMonth(ref);
      const end = endOfMonth(ref);
      return eachDayOfInterval({ start, end });
    } else if (viewMode === "week") {
      const start = startOfWeek(ref);
      const end = endOfWeek(ref);
      return eachDayOfInterval({ start, end });
    } else {
      return [ref];
    }
  }, [currentReferenceDate, selectedDate, viewMode]);

  const prefixDaysCount = useMemo(() => {
    if (viewMode !== "month") return 0;
    return getDay(startOfMonth(selectedDate || currentReferenceDate));
  }, [selectedDate, currentReferenceDate, viewMode]);

  const handlePrev = () => {
    if (viewMode === "month") setCurrentReferenceDate(subMonths(currentReferenceDate, 1));
    else if (viewMode === "week") setCurrentReferenceDate(subWeeks(currentReferenceDate, 1));
    else setCurrentReferenceDate(subDays(currentReferenceDate, 1));
  };

  const handleNext = () => {
    if (viewMode === "month") setCurrentReferenceDate(addMonths(currentReferenceDate, 1));
    else if (viewMode === "week") setCurrentReferenceDate(addWeeks(currentReferenceDate, 1));
    else setCurrentReferenceDate(addDays(currentReferenceDate, 1));
  };

  const getDailyExpense = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return transactions
      .filter((t) => t.date === dateStr && t.type === "expense" && (selectedCategoryIds.length === 0 || selectedCategoryIds.includes(t.categoryId)))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const title = useMemo(() => {
    const ref = selectedDate || currentReferenceDate;
    if (viewMode === "month") return format(ref, "yyyy년 M월", { locale: ko });
    if (viewMode === "week") return `${format(startOfWeek(ref), "M.d")} ~ ${format(endOfWeek(ref), "M.d")}`;
    return format(ref, "M월 d일 (E)", { locale: ko });
  }, [currentReferenceDate, selectedDate, viewMode]);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#f2f4f6]">
      <div className="flex items-center justify-between mb-5 px-1">
        <h3 className="text-lg font-black text-[#191f28]">
          {title}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={handlePrev}
            className="p-2 text-[#adb5bd] hover:bg-[#f2f4f6] rounded-full transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 text-[#adb5bd] hover:bg-[#f2f4f6] rounded-full transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className={`grid ${viewMode === 'day' ? 'grid-cols-1' : 'grid-cols-7'} gap-y-4 text-center`}>
        {viewMode !== 'day' && WEEKS.map((week) => (
          <span key={week} className="text-[12px] font-bold text-[#adb5bd]">
            {week}
          </span>
        ))}
        {Array.from({ length: prefixDaysCount }).map((_, i) => (
          <div key={`empty-${i}`} className="h-12" />
        ))}
        {days.map((day) => {
          const expense = getDailyExpense(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.div
              key={day.toISOString()}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(day)}
              className="flex flex-col items-center justify-start gap-1 cursor-pointer h-12 relative"
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-black transition-all ${
                  isSelected
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                    : isToday
                      ? "bg-[#3182f61a] text-primary"
                      : "text-[#4e5968]"
                }`}
              >
                {format(day, "d")}
              </div>
              {expense > 0 && !isSelected && (
                <span className="text-[8px] font-black text-expense tracking-tighter leading-none bg-rose-50 px-1 rounded-[2px]">
                  {expense.toLocaleString()}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
