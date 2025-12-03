// src/features/goals/components/goals-summary.tsx
"use client";

import { Card } from "@/components/ui/card";
import { GoalYearRow } from "../types";

interface GoalsSummaryProps {
  goals: GoalYearRow[];
}

export function GoalsSummary({ goals }: GoalsSummaryProps) {
  if (!goals || goals.length === 0) {
    return (
      <Card className="text-sm text-muted-foreground">
        목표 데이터가 없습니다.
      </Card>
    );
  }

  const total = goals.reduce((sum, g) => sum + g.totalNeeded, 0);
  const firstYear = goals[0].year;
  const lastYear = goals[goals.length - 1].year;

  const maxRow = goals.reduce((max, g) =>
    g.totalNeeded > max.totalNeeded ? g : max
  );

  return (
    <Card className="space-y-4 text-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-muted-foreground font-medium uppercase tracking-wide text-xs">
          Period
        </span>
        <span className="font-medium text-foreground font-mono-num">
          {firstYear} ~ {lastYear}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Required</span>
          <span className="font-bold text-foreground text-lg font-mono-num">
            {total.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Peak Spending Year</span>
          <div className="text-right">
            <span className="text-foreground font-mono-num block">
              {maxRow.year} ({maxRow.age}yo)
            </span>
            <span className="text-xs text-muted-foreground font-mono-num">
              {maxRow.totalNeeded.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
