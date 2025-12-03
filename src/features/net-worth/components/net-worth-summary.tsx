// src/features/net-worth/components/net-worth-summary.tsx
"use client";

import { Card } from "@/components/ui/card";
import { NetWorthSnapshot } from "../types";

interface NetWorthSummaryProps {
  snapshots: NetWorthSnapshot[];
}

export function NetWorthSummary({ snapshots }: NetWorthSummaryProps) {
  if (!snapshots || snapshots.length === 0) {
    return (
      <Card className="text-sm text-muted-foreground">
        데이터가 없습니다. (나중에 DB 연결 예정)
      </Card>
    );
  }

  const latest = snapshots[snapshots.length - 1];
  const prev = snapshots[snapshots.length - 2];

  const direction =
    latest.momChangeAmount > 0
      ? "up"
      : latest.momChangeAmount < 0
      ? "down"
      : "flat";

  return (
    <Card className="space-y-4 text-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-muted-foreground font-medium uppercase tracking-wide text-xs">
          Date
        </span>
        <span className="font-medium text-foreground font-mono-num">
          {latest.date}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Assets / Liabilities</span>
          <span className="text-foreground font-mono-num">
            {latest.totalAssets.toLocaleString()} /{" "}
            {latest.totalLiabilities.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground font-medium">Net Worth</span>
          <span className="font-bold text-foreground text-lg font-mono-num">
            {latest.netWorth.toLocaleString()}
          </span>
        </div>
        {prev && (
          <div className="flex justify-between items-center pt-2 border-t border-dashed border-border">
            <span className="text-muted-foreground text-xs uppercase tracking-wide">
              MoM Change
            </span>
            <span
              className={`font-mono-num font-medium ${
                direction === "up"
                  ? "text-chart-up"
                  : direction === "down"
                  ? "text-chart-down"
                  : "text-muted-foreground"
              }`}
            >
              {latest.momChangeAmount >= 0 ? "+" : ""}
              {latest.momChangeAmount.toLocaleString()} (
              {latest.momChangeRate > 0 ? "+" : ""}
              {latest.momChangeRate.toFixed(2)}%)
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
