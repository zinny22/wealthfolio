"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Plane, Menu } from "lucide-react";

const tabs = [
  { id: "home", label: "홈", icon: Home, path: "/" },
  { id: "log", label: "머니로그", icon: Wallet, path: "/log" },
  { id: "travel", label: "여행", icon: Plane, path: "/travel" },
  { id: "all", label: "전체", icon: Menu, path: "/all" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-t border-slate-100/50 dark:border-slate-800/50 px-2 pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex justify-around items-center h-[72px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;

          return (
            <Link
              key={tab.id}
              href={tab.path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all group active:scale-95"
            >
              <div
                className={`transition-all duration-300 transform ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-slate-300 dark:text-slate-600 group-hover:text-slate-400"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.1 : 2} />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
