// src/app/net-worth/page.tsx
import { getMockNetWorthSnapshots } from "@/features/net-worth/mock";
import { NetWorthSummary } from "@/features/net-worth/components/net-worth-summary";
import { NetWorthTable } from "@/features/net-worth/components/net-worth-table";

export default function NetWorthPage() {
  const snapshots = getMockNetWorthSnapshots();

  return (
    <main className="space-y-4">
      <h2 className="text-lg font-semibold">순자산 추이 (Mock Data)</h2>
      <NetWorthSummary snapshots={snapshots} />
      <NetWorthTable snapshots={snapshots} />
    </main>
  );
}
