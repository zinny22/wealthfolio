"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard,
  Wallet,
  Plane,
  ChevronRight,
  Filter,
  Menu,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { FilterDrawer } from "@/components/shared/FilterDrawer";
import { Button } from "@/components/ui/button";
import { useTransactionStore } from "@/store/useTransactionStore";
import { motion, AnimatePresence } from "framer-motion";
import { ModernBottomSheet } from "@/components/shared/ModernBottomSheet";

const NAV_ITEMS = [
  { label: "홈", href: "/", icon: LayoutDashboard, color: "bg-blue-50 text-blue-600" },
  { label: "예산", href: "/budget", icon: Wallet, color: "bg-teal-50 text-teal-600" },
  { label: "여행", href: "/travel", icon: Plane, color: "bg-purple-50 text-purple-600" },
];

function NavGrid({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={`flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all group ${
              isActive 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "border-transparent bg-[#f9fafb] hover:bg-white hover:border-[#f2f4f6] hover:shadow-md"
            }`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : item.color}`}>
              <item.icon size={22} />
            </div>
            <span className={`text-[15px] font-black ${isActive ? 'text-[#191f28]' : 'text-[#4e5968]'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function UserProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-5 bg-[#f9fafb] border border-[#f2f4f6] rounded-[2rem] group transition-all hover:bg-white hover:shadow-md">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-[#e5e8eb] shadow-sm group-hover:scale-105 transition-transform">
          <UserIcon className="text-[#8b95a1]" size={24} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[17px] font-black text-[#191f28]">{user.displayName || "테스트 사용자"}</span>
          <span className="text-[12px] font-bold text-[#adb5bd] truncate">{user.email}</span>
        </div>
      </div>
      
      <button 
        onClick={handleLogout}
        className="w-full flex items-center gap-3 p-4 px-6 text-[#adb5bd] font-black text-[14px] hover:text-expense transition-colors"
      >
        <LogOut size={16} /> 로그아웃
      </button>
    </div>
  );
}

function CategorySettingsLink({ onLinkClick }: { onLinkClick: () => void }) {
  const router = useRouter();
  const { categories } = useTransactionStore();

  return (
    <button 
      onClick={() => {
        onLinkClick();
        router.push("/settings/categories");
      }}
      className="w-full flex items-center justify-between p-5 bg-white border border-[#f2f4f6] rounded-[2rem] hover:bg-[#f9fafb] hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
           <Filter size={22} />
        </div>
        <div className="flex flex-col text-left">
           <span className="text-[16px] font-black text-[#191f28]">카테고리 설정</span>
           <span className="text-[11px] font-bold text-[#adb5bd]">현재 {categories.length}개의 카테고리 관리</span>
        </div>
      </div>
      <ChevronRight size={20} className="text-[#adb5bd] group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

export function Sidebar() { return null; }

export function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  if (!user || pathname === "/analysis" || (pathname === "/travel" && searchParams.get("tripId"))) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[700px] bg-white/95 backdrop-blur-2xl border-t border-[#f2f4f6] pb-safe shadow-[0_-10px_50px_rgba(0,0,0,0.05)] sm:rounded-t-[32px]">
      <div className="flex justify-around items-center h-20 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-1 w-full h-full text-[10px] font-black transition-all ${isActive ? "text-primary scale-110" : "text-[#adb5bd]"}`}>
              <item.icon size={24} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button onClick={() => setOpen(true)} className="flex flex-col items-center justify-center gap-1 w-full h-full text-[#adb5bd] hover:text-[#191f28] transition-all font-black text-[10px]">
          <Menu size={24} />
          <span>전체</span>
        </button>

        <ModernBottomSheet
          isOpen={open}
          onClose={() => setOpen(false)}
          title="전체 서비스"
          description="자산 관리를 위한 주요 메뉴와 설정입니다."
          maxWidth="700px"
        >
          <div className="space-y-10 pt-6 pb-20">
            <section className="space-y-4">
              <h5 className="text-[13px] font-black text-[#191f28] ml-2 tracking-tight">메인 메뉴</h5>
              <NavGrid pathname={pathname} onLinkClick={() => setOpen(false)} />
            </section>

            <section className="space-y-4">
              <h5 className="text-[13px] font-black text-[#191f28] ml-2 tracking-tight">환경 설정</h5>
              <CategorySettingsLink onLinkClick={() => setOpen(false)} />
            </section>

            <section className="space-y-4">
              <h5 className="text-[13px] font-black text-[#191f28] ml-2 tracking-tight">나의 프로필</h5>
              <UserProfile />
            </section>
          </div>
        </ModernBottomSheet>
      </div>
    </nav>
  );
}

export function MobileHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  if (pathname === "/analysis" || (pathname === "/travel" && searchParams.get("tripId"))) return null;

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 bg-white/60 backdrop-blur-md border-b border-[#f2f4f6]/50">
        <span className="font-bold text-lg text-[#191f28]">
          {NAV_ITEMS.find((item) => item.href === pathname)?.label || "Wealthfolio"}
        </span>
        <div className="flex items-center gap-2">
           {pathname === "/" && (
              <Button variant="ghost" size="icon" className="rounded-full text-[#adb5bd] hover:bg-[#f2f4f6]" onClick={() => router.push("/analysis")}><PieChart className="h-5 w-5" /></Button> // Error check: PieChart not imported? 
           )}
        </div>
      </header>
      <FilterDrawer isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </>
  );
}

function PieChart({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>; }
