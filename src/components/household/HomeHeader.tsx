"use client";

import { PieChart } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface HomeHeaderProps {
  currentDate: Date;
  onStatsClick?: () => void;
}

export default function HomeHeader({ currentDate, onStatsClick }: HomeHeaderProps) {
  return (
    <header className="flex justify-between items-center py-3 px-7 bg-transparent">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {format(currentDate, "M월", { locale: ko })}
      </h1>
      <div className="flex items-center">
        <button
          onClick={onStatsClick}
          className="p-2 text-slate-400 hover:text-primary transition-colors active:scale-90"
          aria-label="통계 보기"
        >
          <PieChart size={26} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
