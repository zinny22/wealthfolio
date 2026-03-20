"use client";

import Link from "next/link";
import {
  ChevronRight,
  Settings,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  Tag,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/common/Header";

const menuGroups = [
  {
    title: "자산 관리",
        items: [
          {
            id: "categories",
            label: "카테고리 관리",
            icon: Tag,
            path: "/all/categories",
          },
          {
            id: "travel-categories",
            label: "여행 카테고리 관리",
            icon: Tag,
            path: "/all/travel-categories",
          },
          { id: "cards", label: "카드 관리", icon: CreditCard, path: "/all/cards" },
        ],
  },
  {
    title: "설정 및 기타",
    items: [
      { id: "notice", label: "공지사항", icon: Bell, path: "/all/notice" },
      {
        id: "security",
        label: "보안설정",
        icon: Shield,
        path: "/all/security",
      },
      {
        id: "settings",
        label: "전체 설정",
        icon: Settings,
        path: "/all/settings",
      },
      { id: "help", label: "고객센터", icon: HelpCircle, path: "/all/help" },
    ],
  },
];

export default function AllPage() {
  return (
    <main className="flex-1 flex flex-col bg-app-bg min-h-screen pb-32 transition-colors">
      <Header title="전체" />

      <div className="px-7 flex flex-col gap-10 mt-8">
        {menuGroups.map((group) => (
          <section key={group.title} className="space-y-4">
            <h2 className="text-[13px] font-bold text-slate-400 px-1 tracking-tight uppercase opacity-60">
              {group.title}
            </h2>
            <div className="flex flex-col gap-1.5">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className="flex items-center justify-between p-3.5 hover:bg-white dark:hover:bg-slate-800 rounded-2xl active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                      <item.icon size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-[16px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-200 group-hover:text-primary transition-colors"
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}
