"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
}

export function DonutChart({ data }: DonutChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-[#adb5bd] font-bold">
        분석할 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={6}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: '800' }}
            formatter={(value: number) => `${value.toLocaleString()}원`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
