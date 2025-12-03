"use client";

import { mockMacroData } from "@/features/macro/mock";
import { Card } from "@/components/ui/card";

export default function MacroPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        거시경제 지표
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockMacroData.map((item) => (
          <Card key={item.name} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {item.name}
                </h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {item.value}
              </p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
