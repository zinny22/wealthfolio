// src/app/net-worth/page.tsx
import { getMockNetWorthSnapshots } from "@/features/net-worth/mock";
import { NetWorthSummary } from "@/features/net-worth/components/net-worth-summary";
import { NetWorthTable } from "@/features/net-worth/components/net-worth-table";

export default function NetWorthPage() {
  const snapshots = getMockNetWorthSnapshots();

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        순자산 추이 (Mock Data)
      </h1>
      <NetWorthSummary snapshots={snapshots} />
      <NetWorthTable snapshots={snapshots} />
    </main>
  );
}
