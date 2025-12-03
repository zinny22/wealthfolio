// src/app/goals/page.tsx
import { getMockGoals } from "@/features/goals/mock";
import { GoalsSummary } from "@/features/goals/components/goals-summary";
import { GoalsTable } from "@/features/goals/components/goals-table";

export default function GoalsPage() {
  const goals = getMockGoals();

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        경제적 자유 목표 (Mock Data)
      </h1>
      <GoalsSummary goals={goals} />
      <GoalsTable goals={goals} />
    </main>
  );
}
