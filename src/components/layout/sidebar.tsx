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
} from "lucide-react";

const NAV_ITEMS = [
  { label: "대시보드", href: "/", icon: LayoutDashboard },
  { label: "포트폴리오", href: "/portfolio", icon: LineChart },
  { label: "입출금", href: "/cash", icon: Wallet },
  { label: "예적금", href: "/savings", icon: PiggyBank },
  { label: "보험/연금", href: "/insurance", icon: ShieldCheck },
];

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
      <nav className="flex-1 space-y-1 px-4 py-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
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
