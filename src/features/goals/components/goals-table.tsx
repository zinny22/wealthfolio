// src/features/goals/components/goals-table.tsx
"use client";

import { Card } from "@/components/ui/card";
import { GoalYearRow } from "../types";

interface GoalsTableProps {
  goals: GoalYearRow[];
}

export function GoalsTable({ goals }: GoalsTableProps) {
  if (!goals || goals.length === 0) return null;

  return (
    <Card className="overflow-hidden p-0 rounded-none border-x-0 border-b-0 md:border md:rounded-md">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium text-right">Housing</th>
              <th className="px-4 py-3 font-medium text-right">Vehicle</th>
              <th className="px-4 py-3 font-medium text-right">Education</th>
              <th className="px-4 py-3 font-medium text-right">Family</th>
              <th className="px-4 py-3 font-medium text-right">Others</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {goals.map((g) => (
              <tr
                key={g.id}
                className="hover:bg-secondary/30 transition-colors"
              >
                <td className="px-4 py-3 font-mono-num text-muted-foreground">
                  {g.year}
                </td>
                <td className="px-4 py-3 font-mono-num text-muted-foreground">
                  {g.age}
                </td>
                <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                  {g.house.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                  {g.car.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                  {g.education.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                  {g.familyExpense.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                  {g.etc.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-bold font-mono-num text-foreground">
                  {g.totalNeeded.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
