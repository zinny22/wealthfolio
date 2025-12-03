"use client";

import { Card, CardTitle, CardValue } from "@/components/ui/card";
import { useAssetStore } from "@/features/assets/store";
import { calculateTotalAssets } from "@/features/assets/utils";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  // Hydration fix for persist middleware
  const [isMounted, setIsMounted] = useState(false);
  const { stocks, cashAccounts, savings, insurances, exchangeRate } =
    useAssetStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  const { stockTotal, cashTotal, savingsTotal, insuranceTotal, grandTotal } =
    calculateTotalAssets(
      stocks,
      cashAccounts,
      savings,
      insurances,
      exchangeRate.rate
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
            Dashboard Overview
          </h2>
          <span className="text-xs text-muted-foreground font-mono-num">
            {new Date().toLocaleDateString()} • USD/KRW:{" "}
            {exchangeRate.rate.toLocaleString()}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardTitle>Total Assets</CardTitle>
            <CardValue>₩ {grandTotal.toLocaleString()}</CardValue>
            <div className="mt-3 text-xs text-muted-foreground">
              Stocks + Cash + Savings + Insurance
            </div>
          </Card>
          <Card>
            <CardTitle>Stock Holdings</CardTitle>
            <CardValue>₩ {stockTotal.toLocaleString()}</CardValue>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              {stockPct.toFixed(1)}%
            </div>
          </Card>
          <Card>
            <CardTitle>Cash & Savings</CardTitle>
            <CardValue>
              ₩ {(cashTotal + savingsTotal).toLocaleString()}
            </CardValue>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              {(cashPct + savingsPct).toFixed(1)}%
            </div>
          </Card>
          <Card>
            <CardTitle>Insurance & Pension</CardTitle>
            <CardValue>₩ {insuranceTotal.toLocaleString()}</CardValue>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              {insurancePct.toFixed(1)}%
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase text-foreground">
          Asset Breakdown
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Stocks Breakdown */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Stocks
              </span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {stockPct.toFixed(1)}%
              </span>
            </div>
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
            <p className="mt-2 text-xs text-muted-foreground">
              {stocks.length} Holdings
            </p>
          </Card>

          {/* Cash Breakdown */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Cash
              </span>
              <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                {cashPct.toFixed(1)}%
              </span>
            </div>
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
            <p className="mt-2 text-xs text-muted-foreground">
              {cashAccounts.length} Accounts
            </p>
          </Card>

          {/* Savings Breakdown */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Savings
              </span>
              <span className="text-xs font-bold text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">
                {savingsPct.toFixed(1)}%
              </span>
            </div>
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
            <p className="mt-2 text-xs text-muted-foreground">
              {savings.length} Products
            </p>
          </Card>

          {/* Insurance Breakdown */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Insurance
              </span>
              <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                {insurancePct.toFixed(1)}%
              </span>
            </div>
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
            <p className="mt-2 text-xs text-muted-foreground">
              {insurances.length} Policies
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}
