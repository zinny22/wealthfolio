import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Wealthfolio | 개인 자산관리",
  description: "스마트한 자산 관리를 위한 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark h-full">
      <body className="h-full bg-background text-foreground antialiased selection:bg-primary/30">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 overflow-y-auto md:ml-64">
            <div className="container mx-auto max-w-6xl px-6 py-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
