"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/context/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  ShieldCheck,
  Plane,
  Settings2,
  Filter,
  Menu,
  LogOut,
  User as UserIcon,
  PieChart,
} from "lucide-react";
import { FilterDrawer } from "@/components/shared/FilterDrawer";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "홈", href: "/", icon: LayoutDashboard },
  { label: "예산", href: "/budget", icon: Wallet },
  { label: "여행", href: "/travel", icon: Plane },
];

function NavContent({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 px-4 py-6 text-left">
      <ul className="space-y-1 text-left">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="text-left">
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
    <div className="flex flex-col gap-2 p-6 text-left">
      <div className="flex items-center gap-3 px-2 py-3 bg-[#f9fafb] rounded-2xl border border-[#e5e8eb]/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-[#e5e8eb]">
          <UserIcon className="h-5 w-5 text-[#8b95a1]" />
        </div>
        <div className="flex flex-col overflow-hidden text-left">
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
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  const isTravelDetail = pathname === "/travel" && searchParams.get("tripId");
  const isAnalysis = pathname === "/analysis";
  
  if (!user || isTravelDetail || isAnalysis) return null;

  const bottomItems = NAV_ITEMS;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[600px] bg-white/80 backdrop-blur-2xl border-t border-[#f2f4f6] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)] outline-none">
      <div className="flex justify-around items-center h-20 px-4">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-300 ${
                isActive ? "text-primary" : "text-[#adb5bd]"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isActive ? "active" : "inactive"}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <item.icon className="h-6 w-6" />
                </motion.div>
              </AnimatePresence>
              <span className={`text-[10px] font-bold ${isActive ? "text-primary" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-px h-[2px] w-12 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
        
        {/* 전체 메뉴 버튼 (Sheet 활용) */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-1.5 w-full h-full text-[#adb5bd] hover:text-[#191f28] transition-colors outline-none focus:outline-none focus:ring-0">
              <Menu className="h-6 w-6" />
              <span className="text-[10px] font-bold">전체</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[32px] p-0 h-[auto] max-h-[85vh] overflow-hidden border-none shadow-2xl bg-white outline-none focus:outline-none focus:visible:ring-0">
            <div className="mx-auto w-12 h-1.5 bg-[#e5e8eb] rounded-full mt-4 mb-2" />
            <SheetHeader className="px-8 pt-6 pb-2 text-left">
              <SheetTitle className="text-xl font-bold text-[#191f28]">전체 서비스</SheetTitle>
            </SheetHeader>
            <div className="pb-16 text-left">
              <NavContent 
                pathname={pathname} 
                onLinkClick={() => setOpen(false)} 
              />
              <div className="px-6 mt-4">
                <UserProfile />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export function MobileHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [filterOpen, setFilterOpen] = useState(false);

  const isTravelDetail = pathname === "/travel" && searchParams.get("tripId");
  const isAnalysisDetail = pathname === "/analysis";
  if (isTravelDetail || isAnalysisDetail) return null;

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 bg-white/60 backdrop-blur-md border-b border-[#f2f4f6]/50">
        <span className="font-bold text-lg text-[#191f28]">
          {NAV_ITEMS.find((item) => item.href === pathname)?.label || "Wealthfolio"}
        </span>
        <div className="flex items-center gap-2">
          {pathname === "/" && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-[#adb5bd] hover:bg-[#f2f4f6]"
              onClick={() => router.push("/analysis")}
            >
              <PieChart className="h-5 w-5" />
            </Button>
          )}
          {["/", "/analysis"].includes(pathname) && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-[#adb5bd] hover:bg-[#f2f4f6]"
              onClick={() => setFilterOpen(true)}
            >
              <Filter className="h-5 w-5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="rounded-full text-[#adb5bd] hover:bg-[#f2f4f6]">
            <Settings2 className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <FilterDrawer 
        isOpen={filterOpen} 
        onClose={() => setFilterOpen(false)} 
      />
    </>
  );
}
