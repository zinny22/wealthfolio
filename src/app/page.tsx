// src/app/page.tsx

import { GoalsSummary } from "@/features/goals/components/goals-summary";
import { getMockGoals } from "@/features/goals/mock";
import { NetWorthSummary } from "@/features/net-worth/components/net-worth-summary";
import { getMockNetWorthSnapshots } from "@/features/net-worth/mock";
import { Card, CardTitle, CardValue } from "@/components/ui/card";

export default function DashboardPage() {
  const netWorthSnapshots = getMockNetWorthSnapshots();
  const goals = getMockGoals();

  const latest = netWorthSnapshots[netWorthSnapshots.length - 1];

  const totalGoal = goals.reduce((sum, g) => sum + g.totalNeeded, 0);
  const currentNetWorth = latest?.netWorth ?? 0;
  const goalProgress =
    totalGoal > 0 ? Math.min((currentNetWorth / totalGoal) * 100, 999) : 0;

  return (
    <main className="space-y-10">
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight uppercase text-foreground">
            Dashboard Overview
          </h2>
          <span className="text-xs text-muted-foreground font-mono-num">
            {new Date().toLocaleDateString()}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardTitle>Total Net Worth</CardTitle>
            <CardValue>{currentNetWorth.toLocaleString()}</CardValue>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">vs Last Month</span>
              <span
                className={`font-mono-num font-medium ${
                  latest.momChangeAmount >= 0
                    ? "text-chart-up"
                    : "text-chart-down"
                }`}
              >
                {latest.momChangeAmount > 0 ? "+" : ""}
                {latest.momChangeRate.toFixed(1)}%
              </span>
            </div>
          </Card>
          <Card>
            <CardTitle>FIRE Goal Target</CardTitle>
            <CardValue>{totalGoal.toLocaleString()}</CardValue>
            <div className="mt-3 text-xs text-muted-foreground">
              Estimated requirement
            </div>
          </Card>
          <Card>
            <CardTitle>Goal Progress</CardTitle>
            <CardValue>{goalProgress.toFixed(1)}%</CardValue>
            <div className="mt-4 h-1 w-full bg-secondary">
              <div
                className="h-1 bg-primary transition-all"
                style={{ width: `${Math.min(goalProgress, 100)}%` }}
              />
            </div>
          </Card>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-bold uppercase text-foreground">
              Net Worth Summary
            </h3>
            <a
              href="/net-worth"
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              VIEW ALL &rarr;
            </a>
          </div>
          <NetWorthSummary snapshots={netWorthSnapshots} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-bold uppercase text-foreground">
              FIRE Goals
            </h3>
            <a
              href="/goals"
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              VIEW ALL &rarr;
            </a>
          </div>
          <GoalsSummary goals={goals} />
        </section>
      </div>
    </main>
  );
}
