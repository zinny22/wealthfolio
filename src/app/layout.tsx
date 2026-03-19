import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, MobileHeader, MobileBottomNav } from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";

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
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <body className="h-full bg-[#f2f4f6] text-foreground antialiased selection:bg-primary/30">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light" // 앱 느낌을 위해 기본 테마를 라이트로 고정하거나 설정에 따름
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-full justify-center bg-[#f2f4f6]">
              {/* 메인 앱 컨테이너 */}
              <div className="relative flex w-full max-w-[600px] flex-col bg-white shadow-[0_0_100px_rgba(0,0,0,0.05)] md:my-0 min-h-screen">
                <Sidebar />
                <MobileHeader />
                <main className="flex-1 pb-32">
                  <div className="px-5 pt-2">
                    {children}
                  </div>
                </main>
                <MobileBottomNav />
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
