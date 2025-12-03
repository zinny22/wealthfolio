import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, MobileHeader } from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="ko" className="dark h-full" suppressHydrationWarning>
      <body className="h-full bg-background text-foreground antialiased selection:bg-primary/30">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full flex-col md:flex-row">
            <Sidebar />
            <div className="flex flex-1 flex-col md:ml-60">
              <MobileHeader />
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto max-w-6xl px-6 py-10">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
