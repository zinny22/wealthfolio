"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "□" },
  { label: "Portfolio", href: "/portfolio", icon: "○" },
  { label: "Cash", href: "/cash", icon: "△" },
  { label: "Savings", href: "/savings", icon: "◇" },
  { label: "Insurance", href: "/insurance", icon: "🛡️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-border bg-background md:flex">
      <div className="flex h-14 items-center px-6 border-b border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-foreground"
        >
          <span>Wealthfolio</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-6">
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
                  <span
                    className={`text-xs transition-opacity ${
                      isActive
                        ? "opacity-100 text-primary"
                        : "opacity-50 group-hover:opacity-100"
                    }`}
                  >
                    {item.icon}
                  </span>
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
