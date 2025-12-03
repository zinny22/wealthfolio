import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matt 자산관리 대시보드",
  description: "엑셀 기반 개인 자산관리 웹 버전 (Mock Data)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              Matt 자산관리 대시보드 (Mock)
            </h1>
            <nav className="flex gap-4 text-sm text-slate-300">
              <a href="/" className="hover:text-white">
                대시보드
              </a>
              <a href="/net-worth" className="hover:text-white">
                순자산 추이
              </a>
              <a href="/goals" className="hover:text-white">
                목표 자산
              </a>
              <a href="/portfolio" className="hover:text-white">
                포트폴리오
              </a>
              <a href="/macro" className="hover:text-white">
                거시경제
              </a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
