"use client";

import { mockMacroData } from "@/features/macro/mock";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default function MacroPage() {
  return (
    <main className="space-y-8">
      <div className="px-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#191f28]">
          거시경제 지표
        </h1>
        <p className="text-sm text-[#8b95a1] mt-1 font-medium">글로벌 경제 흐름과 시장 지표를 확인하세요</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockMacroData.map((item) => (
          <Card key={item.name} className="p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[24px] relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] flex items-center justify-center text-[#8b95a1] group-hover:text-[#3182f6] group-hover:bg-[#3182f61a] transition-all">
                    <Globe className="h-5 w-5" />
                 </div>
                 <span className="text-[10px] font-bold text-[#8b95a1] uppercase tracking-wider bg-[#f2f4f6] px-2 py-0.5 rounded-md">시장 지표</span>
              </div>
              <h3 className="text-sm font-bold text-[#8b95a1] mb-1">
                {item.name}
              </h3>
              <p className="text-3xl font-bold text-[#191f28] tracking-tight font-mono-num mb-6">
                {item.value}
              </p>
              <div className="p-3 bg-[#f9fafb] rounded-2xl">
                 <p className="text-xs font-semibold text-[#4e5968] leading-relaxed">
                   {item.description}
                 </p>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#3182f6] opacity-[0.02] rounded-full blur-2xl group-hover:opacity-[0.05] transition-opacity" />
          </Card>
        ))}
      </div>
    </main>
  );
}
