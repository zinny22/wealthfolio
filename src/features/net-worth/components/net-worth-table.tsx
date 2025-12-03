// src/features/net-worth/components/net-worth-table.tsx
"use client";

import { Card } from "@/components/ui/card";
import { NetWorthSnapshot } from "../types";

interface NetWorthTableProps {
  snapshots: NetWorthSnapshot[];
}

export function NetWorthTable({ snapshots }: NetWorthTableProps) {
  if (!snapshots || snapshots.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden p-0 rounded-none border-x-0 border-b-0 md:border md:rounded-md">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Assets</th>
              <th className="px-4 py-3 font-medium text-right">Liabilities</th>
              <th className="px-4 py-3 font-medium text-right">Net Worth</th>
              <th className="px-4 py-3 font-medium text-right">MoM Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {snapshots.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-secondary/30 transition-colors"
              >
                <td className="px-4 py-3 font-mono-num text-muted-foreground">
                  {s.date}
                </td>
                <td className="px-4 py-3 text-right font-mono-num text-foreground">
                  {s.totalAssets.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono-num text-foreground">
                  {s.totalLiabilities.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-bold font-mono-num text-foreground">
                  {s.netWorth.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-mono-num font-medium ${
                      s.momChangeAmount >= 0
                        ? "text-chart-up"
                        : "text-chart-down"
                    }`}
                  >
                    {s.momChangeAmount >= 0 ? "+" : ""}
                    {s.momChangeAmount.toLocaleString()}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground font-mono-num">
                    ({s.momChangeRate > 0 ? "+" : ""}
                    {s.momChangeRate.toFixed(2)}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
