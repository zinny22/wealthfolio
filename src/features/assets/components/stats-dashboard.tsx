"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/features/assets/types";

interface StatsDashboardProps {
  transactions: Transaction[];
}

const COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#6366f1", // indigo
  "#14b8a6", // teal
];

export function StatsDashboard({ transactions }: StatsDashboardProps) {
  const expenseData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "지출");
    const categoryMap = new Map<string, number>();

    expenses.forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExpense = expenseData.reduce((sum, item) => sum + item.value, 0);

  if (expenseData.length === 0) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center text-muted-foreground border-dashed">
        <p className="text-sm">
          이번 달 지출 내역이 없어 통계를 표시할 수 없습니다.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 flex flex-col items-center">
        <h3 className="text-sm font-semibold mb-4 self-start">
          카테고리별 지출 비중
        </h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₩${value.toLocaleString()}`}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">
          지출 상세 (상위 {Math.min(5, expenseData.length)}개)
        </h3>
        <div className="space-y-4">
          {expenseData.slice(0, 5).map((item, index) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-muted-foreground">
                  {((item.value / totalExpense) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex-1 h-2 bg-secondary rounded-full mr-4 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / totalExpense) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
                <span className="text-xs font-mono-num font-semibold">
                  ₩{item.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          {expenseData.length > 5 && (
            <p className="text-[10px] text-center text-muted-foreground pt-2">
              외 {expenseData.length - 5}개의 카테고리가 더 있습니다.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
