"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface DetailHeaderProps {
  title: string | React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function DetailHeader({
  title,
  showBack = false,
  onBack,
  rightAction,
}: DetailHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center py-4 px-4 sticky top-0 z-30 transition-all bg-white dark:bg-gray-900 ">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => (onBack ? onBack() : router.back())}
            className=" text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
        )}
        <div className="text-md font-bold tracking-tight text-foreground">
          {title}
        </div>
      </div>
      <div className="flex items-center">{rightAction}</div>
    </header>
  );
}
