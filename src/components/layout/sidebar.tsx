"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/context/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  ShieldCheck,
  Menu,
  LogOut,
  User as UserIcon,
  Plane,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "홈", href: "/", icon: LayoutDashboard },
  { label: "소비", href: "/cash", icon: Wallet },
  { label: "여행", href: "/travel", icon: Plane },
  { label: "예적금", href: "/savings", icon: PiggyBank },
  { label: "보험", href: "/insurance", icon: ShieldCheck },
];

function NavContent({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 px-4 py-6">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onLinkClick}
                className={`group flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#3182f61a] text-[#3182f6]"
                    : "text-[#4e5968] hover:bg-[#f2f4f6] hover:text-[#191f28]"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-[#3182f6]" : "text-[#8b95a1]"}`} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
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

  if (loading) return <div className="p-4 text-xs text-center italic text-muted-foreground animate-pulse">로딩 중...</div>;

  if (!user) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <Button
          size="sm"
          variant="default"
          className="w-full"
          onClick={() => router.push("/login")}
        >
          로그인
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => router.push("/signup")}
        >
          회원가입
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-6">
      <div className="flex items-center gap-3 px-2 py-3 bg-[#f9fafb] rounded-2xl border border-[#e5e8eb]/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-[#e5e8eb]">
          <UserIcon className="h-5 w-5 text-[#8b95a1]" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-bold text-[#191f28] truncate">
            {user.displayName || "사용자"}
          </span>
          <span className="text-[11px] text-[#8b95a1] truncate">
            {user.email}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-[#8b95a1] hover:text-[#191f28] hover:bg-[#f2f4f6]"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        로그아웃
      </Button>
    </div>
  );
}

export function Sidebar() {
  return null; 
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[600px] bg-white/70 backdrop-blur-2xl border-t border-[#f2f4f6] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-20 px-2 lg:px-6">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1.5 w-full h-full transition-all duration-300 ${
                isActive ? "text-[#3182f6]" : "text-[#adb5bd]"
              }`}
            >
              <item.icon className={`h-6 w-6 ${isActive ? "scale-110" : "scale-100"} transition-transform`} />
              <span className={`text-[10px] font-bold ${isActive ? "text-[#3182f6]" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        {/* 전체 메뉴 버튼 (Sheet 활용 가능) */}
        <button className="flex flex-col items-center justify-center gap-1.5 w-full h-full text-[#adb5bd] hover:text-[#191f28] transition-colors">
          <Menu className="h-6 w-6" />
          <span className="text-[10px] font-bold">전체</span>
        </button>
      </div>
    </nav>
  );
}

export function MobileHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 bg-white/60 backdrop-blur-md border-b border-[#f2f4f6]/50">
      <span className="font-bold text-lg text-[#191f28]">
        {NAV_ITEMS.find((item) => item.href === pathname)?.label || "Wealthfolio"}
      </span>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full text-[#adb5bd] hover:bg-[#f2f4f6]">
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
