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

export default function DashboardPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [stocks, setStocks] = useState<StockHolding[]>([]);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [savings, setSavings] = useState<SavingDeposit[]>([]);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(1400);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setStocks([]);
      setCashAccounts([]);
      setSavings([]);
      setInsurances([]);
      setLoading(false);
      return;
    }

    const unsubStocks = onSnapshot(
      collection(db, "users", user.uid, "stocks"),
      (snap) => {
        setStocks(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as StockHolding))
        );
      }
    );

    const unsubCash = onSnapshot(
      collection(db, "users", user.uid, "cash_accounts"),
      (snap) => {
        setCashAccounts(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as CashAccount))
        );
      }
    );

    const unsubSavings = onSnapshot(
      collection(db, "users", user.uid, "savings"),
      (snap) => {
        setSavings(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavingDeposit))
        );
      }
    );

    const unsubInsurances = onSnapshot(
      collection(db, "users", user.uid, "insurances"),
      (snap) => {
        setInsurances(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as Insurance))
        );
      }
    );

    setLoading(false);

    return () => {
      unsubStocks();
      unsubCash();
      unsubSavings();
      unsubInsurances();
    };
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
            Dashboard Overview
          </h2>
          <span className="text-xs text-muted-foreground font-mono-num">
            {new Date().toLocaleDateString()} • USD/KRW:{" "}
            {exchangeRate.toLocaleString()}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardValue>₩ {grandTotal.toLocaleString()}</CardValue>
              <div className="mt-3 text-xs text-muted-foreground">
                Stocks + Cash + Savings + Insurance
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Stock Holdings
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
                Cash & Savings
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
                Insurance & Pension
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
            Asset Breakdown
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Stocks Breakdown */}
            <Card>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Stocks
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
                <p className="mt-2 text-xs text-muted-foreground">
                  {stocks.length} Holdings
                </p>
              </CardContent>
            </Card>

            {/* Cash Breakdown */}
            <Card>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Cash
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
                <p className="mt-2 text-xs text-muted-foreground">
                  {cashAccounts.length} Accounts
                </p>
              </CardContent>
            </Card>

            {/* Savings Breakdown */}
            <Card>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Savings
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
                <p className="mt-2 text-xs text-muted-foreground">
                  {savings.length} Products
                </p>
              </CardContent>
            </Card>

            {/* Insurance Breakdown */}
            <Card>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Insurance
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
                <p className="mt-2 text-xs text-muted-foreground">
                  {insurances.length} Policies
                </p>
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
