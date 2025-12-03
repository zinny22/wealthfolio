"use client";

import { mockMacroData } from "@/features/macro/mock";

export default function MacroPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">거시경제 지표</h1>

      <div className="space-y-4">
        {mockMacroData.map((item) => (
          <div
            key={item.name}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{item.name}</span>
              <span className="text-gray-700 font-medium">{item.value}</span>
            </div>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
