"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardValue,
} from "@/components/ui/card";
import { AssetAllocationChart } from "@/features/assets/components/asset-allocation-chart";
import { calculateTotalAssets } from "@/features/assets/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  StockHolding,
  CashAccount,
  SavingDeposit,
  Insurance,
} from "@/features/assets/types";
import { useExchangeRate } from "@/hooks/use-exchange-rate";

export default function DashboardPage() {
  const { user } = useAuth();
  const { rate: exchangeRate } = useExchangeRate();
  const [isMounted, setIsMounted] = useState(false);
  const [stocks, setStocks] = useState<StockHolding[]>([]);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [savings, setSavings] = useState<SavingDeposit[]>([]);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 임시 테스트 데이터를 설정합니다.
    setStocks([
      { id: "1", name: "Apple", code: "AAPL", currentPrice: 175.43, unitPrice: 150.0, quantity: 10, currency: "USD", totalAmountKrw: 2450000, tradeType: "매수", market: "NASDAQ" } as any,
      { id: "2", name: "Samsung Electronics", code: "005930", currentPrice: 72000, unitPrice: 65000, quantity: 50, currency: "KRW", totalAmountKrw: 3600000, tradeType: "매수", market: "KOSPI" } as any
    ]);
    setCashAccounts([
      { id: "1", bankName: "Shinhan", accountName: "Main", balance: 5000000, currency: "KRW" } as any
    ]);
    setSavings([
      { id: "1", bankName: "KB", amount: 10000000, interestRate: 4.5, period: 12, type: "적금" } as any
    ]);
    setInsurances([
      { id: "1", company: "Samsung Fire", totalPayment: 1200000, monthlyPayment: 100000 } as any
    ]);
    
    setLoading(false);

    /* Firebase 구독 부분 주석 처리
    if (!user) { ... }
    const unsubStocks = onSnapshot(...)
    ...
    return () => { ... };
    */
  }, [user]);

  if (!isMounted) {
    return null;
  }

  const { stockTotal, cashTotal, savingsTotal, insuranceTotal, grandTotal } =
    calculateTotalAssets(
      stocks,
      cashAccounts,
      savings,
      insurances,
      exchangeRate
    );

  // Calculate percentages for the bar chart
  const stockPct = grandTotal > 0 ? (stockTotal / grandTotal) * 100 : 0;
  const cashPct = grandTotal > 0 ? (cashTotal / grandTotal) * 100 : 0;
  const savingsPct = grandTotal > 0 ? (savingsTotal / grandTotal) * 100 : 0;
  const insurancePct = grandTotal > 0 ? (insuranceTotal / grandTotal) * 100 : 0;

  return (
    <main className="space-y-12">
      {/* Hero Section - Total Assets */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-semibold text-[#8b95a1]">전체 자산</h2>
          <span className="text-xs text-[#8b95a1] font-mono-num bg-white/50 px-3 py-1 rounded-full border border-[#e5e8eb]/50">
            {new Date().toLocaleDateString()} • USD/KRW: {exchangeRate.toLocaleString()}원
          </span>
        </div>
        <Card className="p-8 md:p-12 overflow-hidden relative">
           <div className="relative z-10">
              <p className="text-sm font-medium text-[#4e5968] mb-2">내 자산 총합</p>
              <div className="flex items-baseline gap-1">
                 <h1 className="text-4xl md:text-5xl font-bold text-[#191f28] tracking-tight">
                    ₩ {grandTotal.toLocaleString()}
                 </h1>
              </div>
              <div className="mt-8 flex gap-3 h-3 w-full max-w-md rounded-full bg-[#f2f4f6] overflow-hidden">
                <div className="bg-[#3182f6] h-full" style={{ width: `${stockPct}%` }} />
                <div className="bg-[#4caf50] h-full" style={{ width: `${(cashPct + savingsPct)}%` }} />
                <div className="bg-[#ff9800] h-full" style={{ width: `${insurancePct}%` }} />
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#8b95a1] font-medium">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3182f6]" /> 주식 {stockPct.toFixed(1)}%</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#4caf50]" /> 현금/예적금 {(cashPct + savingsPct).toFixed(1)}%</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ff9800]" /> 보험 {insurancePct.toFixed(1)}%</div>
              </div>
           </div>
           {/* Decorative Gradient Background */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-[#3182f6]/5 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        </Card>
      </section>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Main Content Areas */}
        <div className="lg:col-span-2 space-y-6">
           <div className="px-2 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#191f28]">보유 자산 내역</h3>
           </div>
           <div className="grid gap-4 md:grid-cols-2">
              <AssetSummaryCard 
                title="주식" 
                amount={stockTotal} 
                percentage={stockPct} 
                count={`${stocks.length}개 종목`} 
                color="#3182f6" 
              />
              <AssetSummaryCard 
                title="현금" 
                amount={cashTotal} 
                percentage={cashPct} 
                count={`${cashAccounts.length}개 계좌`} 
                color="#2196f3" 
              />
              <AssetSummaryCard 
                title="예적금" 
                amount={savingsTotal} 
                percentage={savingsPct} 
                count={`${savings.length}개 상품`} 
                color="#673ab7" 
              />
              <AssetSummaryCard 
                title="보험" 
                amount={insuranceTotal} 
                percentage={insurancePct} 
                count={`${insurances.length}건`} 
                color="#f44336" 
              />
           </div>
        </div>

        {/* Chart Sidebar */}
        <div className="space-y-6">
           <div className="px-2 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#191f28]">자산 비중</h3>
           </div>
           <AssetAllocationChart
              stockTotal={stockTotal}
              cashTotal={cashTotal}
              savingsTotal={savingsTotal}
              insuranceTotal={insuranceTotal}
              grandTotal={grandTotal}
            />
        </div>
      </div>
    </main>
  );
}

function AssetSummaryCard({ title, amount, percentage, count, color }: { title: string, amount: number, percentage: number, count: string, color: string }) {
  return (
    <Card className="p-6 group cursor-pointer hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-[#4e5968]">{title}</span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#f2f4f6] text-[#8b95a1] group-hover:bg-[#3182f6]/10 group-hover:text-[#3182f6] transition-colors">
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div>
          <p className="text-xl font-bold text-[#191f28] mb-1">
            ₩ {amount.toLocaleString()}
          </p>
          <p className="text-xs text-[#8b95a1] font-medium">{count}</p>
        </div>
      </div>
    </Card>
  );
}
