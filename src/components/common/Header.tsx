"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string | React.ReactNode;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export default function Header({
  title,
  showBack = false,
  rightAction,
  transparent = false,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={`flex justify-between items-center py-4 px-7 sticky top-0 z-30 transition-all
      ${transparent ? "bg-transparent" : "bg-white dark:bg-slate-900 shadow-sm"}
    `}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors active:scale-90"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
        )}
        <div className="text-xl font-extrabold tracking-tight text-foreground">
          {title}
        </div>
      </div>
      <div className="flex items-center">{rightAction}</div>
    </header>
  );
}
