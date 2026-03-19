"use client";

import { useState, useEffect } from "react";
import { SummaryCard } from "@/components/home/SummaryCard";
import { CalendarView } from "@/components/calendar/CalendarView";
import { DailyDetailList } from "@/components/home/DailyDetailList";
import { FloatingActionButton } from "@/components/shared/FloatingActionButton";
import { TransactionInputModal } from "@/components/shared/TransactionInputModal";
import { useTransactionStore } from "@/store/useTransactionStore";
import { motion } from "framer-motion";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const { initializeMockData, transactions } = useTransactionStore();

  useEffect(() => {
    // 초기 데이터가 없을 경우에만 목 데이터 생성
    if (transactions.length === 0) {
      initializeMockData();
    }
  }, []);

  const handleAddClick = () => {
    setIsInputModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      {/* 뷰 전환 토글 */}
      <div className="flex bg-[#f2f4f6] p-1 rounded-2xl gap-1 self-center w-full max-w-[240px]">
        {([
          ["month", "월"],
          ["week", "주"],
          ["day", "일"],
        ] as const).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
              viewMode === mode
                ? "bg-white text-primary shadow-sm"
                : "text-[#8b95a1] hover:text-[#4e5968]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 상단 요약 카드 */}
      <SummaryCard />

      {/* 중앙 캘린더 */}
      <CalendarView 
        selectedDate={selectedDate} 
        onDateSelect={setSelectedDate} 
        viewMode={viewMode}
      />

      {/* 하단 상세 내역 */}
      <DailyDetailList date={selectedDate} />

      {/* 플로팅 버튼 */}
      <FloatingActionButton onClick={handleAddClick} />

      {/* 입력 모달 */}
      <TransactionInputModal 
        isOpen={isInputModalOpen} 
        onClose={() => setIsInputModalOpen(false)} 
      />
    </motion.div>
  );
}
