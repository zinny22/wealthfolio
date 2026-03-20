import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wealthfolio",
  description: "스마트한 나의 자산 관리 리포트",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wealthfolio",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex justify-center selection:bg-teal-100 dark:selection:bg-teal-900 overflow-x-hidden">
        {/* PC 중앙 정렬을 위한 600px 컨테이너 */}
        <div className="w-full max-w-[600px] min-h-screen bg-background shadow-2xl relative border-x border-slate-200/50 dark:border-slate-800/50 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
