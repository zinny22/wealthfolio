"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  PiggyBank,
  ShieldCheck,
  Menu,
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
  { label: "대시보드", href: "/", icon: LayoutDashboard },
  { label: "포트폴리오", href: "/portfolio", icon: LineChart },
  { label: "입출금", href: "/cash", icon: Wallet },
  { label: "예적금", href: "/savings", icon: PiggyBank },
  { label: "보험/연금", href: "/insurance", icon: ShieldCheck },
];

function NavContent({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 px-4 py-4">
      <ul className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onLinkClick}
                className={`group flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-border bg-background md:flex">
      <div className="flex h-14 items-center px-6 border-b border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <div className="h-6 w-6 rounded-full bg-primary" />
          Wealthfolio
        </Link>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
      <NavContent pathname={pathname} />
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-6 w-6 rounded-full bg-secondary border border-border" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">Matt</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Pro
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-border bg-background px-6 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="px-6 py-4 border-b border-border text-left">
            <SheetTitle className="text-left">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold tracking-tight"
                onClick={() => setOpen(false)}
              >
                <div className="h-6 w-6 rounded-full bg-primary" />
                Wealthfolio
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full pb-4">
            <NavContent
              pathname={pathname}
              onLinkClick={() => setOpen(false)}
            />
            <div className="mt-auto px-6 py-4 border-t border-border flex justify-between items-center">
              <span className="text-sm font-medium">테마 설정</span>
              <ModeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex flex-1 items-center justify-between">
        <span className="font-semibold text-lg">
          {NAV_ITEMS.find((item) => item.href === pathname)?.label ||
            "Wealthfolio"}
        </span>
        <div className="md:hidden">
          {/* Right side of mobile header if needed */}
        </div>
      </div>
    </header>
  );
}
