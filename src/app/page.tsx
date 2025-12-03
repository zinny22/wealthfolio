// src/app/page.tsx

import { GoalsSummary } from "@/features/goals/components/goals-summary";
import { getMockGoals } from "@/features/goals/mock";
import { NetWorthSummary } from "@/features/net-worth/components/net-worth-summary";
import { getMockNetWorthSnapshots } from "@/features/net-worth/mock";

export default function DashboardPage() {
  const netWorthSnapshots = getMockNetWorthSnapshots();
  const goals = getMockGoals();

  const latest = netWorthSnapshots[netWorthSnapshots.length - 1];

  const totalGoal = goals.reduce((sum, g) => sum + g.totalNeeded, 0);
  const currentNetWorth = latest?.netWorth ?? 0;
  const goalProgress =
    totalGoal > 0 ? Math.min((currentNetWorth / totalGoal) * 100, 999) : 0;

  return (
    <main className="space-y-6">
      <section>
        <h2 className="mb-3 text-lg font-semibold">요약</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-900 p-4">
            <p className="text-xs text-slate-400">현재 순자산</p>
            <p className="mt-2 text-xl font-semibold">
              {currentNetWorth.toLocaleString()} 원
            </p>
          </div>
          <div className="rounded-lg bg-slate-900 p-4">
            <p className="text-xs text-slate-400">목표 총 필요 자산</p>
            <p className="mt-2 text-xl font-semibold">
              {totalGoal.toLocaleString()} 원
            </p>
          </div>
          <div className="rounded-lg bg-slate-900 p-4">
            <p className="text-xs text-slate-400">목표 달성률 (대략)</p>
            <p className="mt-2 text-xl font-semibold">
              {goalProgress.toFixed(1)}%
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-200">
            순자산 요약
          </h3>
          <NetWorthSummary snapshots={netWorthSnapshots} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-200">
            경제적 자유 목표 요약
          </h3>
          <GoalsSummary goals={goals} />
        </div>
      </section>
    </main>
  );
}
