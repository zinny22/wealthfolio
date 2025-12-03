"use client";

import { mockPortfolio } from "@/features/portfolio/mock";
import { Card, CardTitle, CardValue } from "@/components/ui/card";

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        포트폴리오 현황
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockPortfolio.map((item) => (
          <Card key={item.asset}>
            <CardTitle>{item.asset}</CardTitle>
            <CardValue>{item.amount.toLocaleString()} 원</CardValue>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">비중</span>
              <span className="text-sm font-medium text-foreground">
                {item.weight}%
              </span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${item.weight}%` }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
