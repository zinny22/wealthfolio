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
    <main className="space-y-10">
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight uppercase text-foreground">
            대시보드 개요
          </h2>
          <span className="text-xs text-muted-foreground font-mono-num">
            {new Date().toLocaleDateString()} • USD/KRW:{" "}
            {exchangeRate.toLocaleString()}원
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                총 자산
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardValue>₩ {grandTotal.toLocaleString()}</CardValue>
              <div className="mt-3 text-xs text-muted-foreground">
                주식 + 현금 + 예적금 + 보험
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                주식 보유액
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardValue>₩ {stockTotal.toLocaleString()}</CardValue>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                {stockPct.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                현금 및 예적금
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardValue>
                ₩ {(cashTotal + savingsTotal).toLocaleString()}
              </CardValue>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                {(cashPct + savingsPct).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                보험 및 연금
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardValue>₩ {insuranceTotal.toLocaleString()}</CardValue>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                {insurancePct.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase text-foreground">
            자산별 내역
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Stocks Breakdown */}
            <Card>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    주식
                  </span>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {stockPct.toFixed(1)}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono-num text-foreground">
                    ₩ {stockTotal.toLocaleString()}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${stockPct}%` }}
                  />
                </div>
                  {stocks.length}개 종목
              </CardContent>
            </Card>

            {/* Cash Breakdown */}
            <Card>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    현금
                  </span>
                  <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    {cashPct.toFixed(1)}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono-num text-foreground">
                    ₩ {cashTotal.toLocaleString()}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${cashPct}%` }}
                  />
                </div>
                  {cashAccounts.length}개 계좌
              </CardContent>
            </Card>

            {/* Savings Breakdown */}
            <Card>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    예적금
                  </span>
                  <span className="text-xs font-bold text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">
                    {savingsPct.toFixed(1)}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono-num text-foreground">
                    ₩ {savingsTotal.toLocaleString()}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                    style={{ width: `${savingsPct}%` }}
                  />
                </div>
                  {savings.length}개 상품
              </CardContent>
            </Card>

            {/* Insurance Breakdown */}
            <Card>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    보험
                  </span>
                  <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                    {insurancePct.toFixed(1)}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono-num text-foreground">
                    ₩ {insuranceTotal.toLocaleString()}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all duration-500"
                    style={{ width: `${insurancePct}%` }}
                  />
                </div>
                  {insurances.length}건
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="h-full">
          <div className="h-full pt-9">
            <AssetAllocationChart
              stockTotal={stockTotal}
              cashTotal={cashTotal}
              savingsTotal={savingsTotal}
              insuranceTotal={insuranceTotal}
              grandTotal={grandTotal}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
