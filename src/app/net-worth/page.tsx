// src/app/net-worth/page.tsx
import { getMockNetWorthSnapshots } from "@/features/net-worth/mock";
import { NetWorthSummary } from "@/features/net-worth/components/net-worth-summary";
import { NetWorthTable } from "@/features/net-worth/components/net-worth-table";

export default function NetWorthPage() {
  const snapshots = getMockNetWorthSnapshots();

  return (
    <main className="space-y-8">
      <div className="px-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#191f28]">
          순자산 추이
        </h1>
        <p className="text-sm text-[#8b95a1] mt-1 font-medium">자산과 부채의 변화를 한눈에 확인하세요</p>
      </div>
      <NetWorthSummary snapshots={snapshots} />
      <div className="px-2">
         <h3 className="text-sm font-semibold text-[#8b95a1] mb-4">월별 상세 내역</h3>
         <NetWorthTable snapshots={snapshots} />
      </div>
    </main>
  );
}
