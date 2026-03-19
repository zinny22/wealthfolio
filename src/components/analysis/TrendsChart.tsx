"use client";

import { BarChart as RBChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface TrendsChartProps {
  data: { name: string; amount: number }[];
}

export function TrendsChart({ data }: TrendsChartProps) {
  if (data.length === 0) return null;

  return (
    <div className="h-[200px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <RBChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
          <CartesianGrid vertical={false} stroke="#f2f4f6" strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#adb5bd", fontSize: 11, fontWeight: '700' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#adb5bd", fontSize: 11 }} 
            dx={-10}
          />
          <Tooltip 
            cursor={{ fill: '#3182f60a' }}
            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: '800' }}
            formatter={(value: number) => `${value.toLocaleString()}원`}
          />
          <Bar 
            dataKey="amount" 
            radius={[4, 4, 0, 0]} 
            barSize={16}
            animationBegin={500}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`bar-${index}`} 
                fill={index === data.length - 1 ? "#3182f6" : "#e5e8eb"} 
              />
            ))}
          </Bar>
        </RBChart>
      </ResponsiveContainer>
    </div>
  );
}
