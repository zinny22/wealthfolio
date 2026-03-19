"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetAllocationChartProps {
  stockTotal: number;
  cashTotal: number;
  savingsTotal: number;
  insuranceTotal: number;
  grandTotal: number;
}

export function AssetAllocationChart({
  stockTotal,
  cashTotal,
  savingsTotal,
  insuranceTotal,
  grandTotal,
}: AssetAllocationChartProps) {
  const data = [
    { name: "주식", value: stockTotal, color: "#10b981" }, // emerald-500
    { name: "현금", value: cashTotal, color: "#3b82f6" }, // blue-500
    { name: "예적금", value: savingsTotal, color: "#8b5cf6" }, // violet-500
    { name: "보험", value: insuranceTotal, color: "#f97316" }, // orange-500
  ].filter((item) => item.value > 0);

  if (grandTotal === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>자산 구성</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
          자산 데이터가 없습니다.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>자산 구성</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₩ ${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--foreground))",
              }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-mono-num font-medium">
                {((item.value / grandTotal) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
