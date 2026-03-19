// src/app/goals/page.tsx
import { getMockGoals } from "@/features/goals/mock";
import { GoalsSummary } from "@/features/goals/components/goals-summary";
import { GoalsTable } from "@/features/goals/components/goals-table";

export default function GoalsPage() {
  const goals = getMockGoals();

  return (
    <main className="space-y-8">
      <div className="px-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#191f28]">
          경제적 자유 목표
        </h1>
        <p className="text-sm text-[#8b95a1] mt-1 font-medium">은퇴 이후의 삶을 위한 장기 재무 계획</p>
      </div>
      <GoalsSummary goals={goals} />
      <div className="px-2">
         <h3 className="text-sm font-semibold text-[#8b95a1] mb-4">연도별 상세 예산</h3>
         <GoalsTable goals={goals} />
      </div>
    </main>
  );
}
