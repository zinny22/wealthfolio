"use client";

import { mockPortfolio } from "@/features/portfolio/mock";

export default function PortfolioPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">포트폴리오 현황</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockPortfolio.map((item) => (
          <div
            key={item.asset}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <h2 className="text-lg font-semibold">{item.asset}</h2>
            <p className="text-gray-600">비중: {item.weight}%</p>
            <p className="text-gray-600">
              평가금액: {item.amount.toLocaleString()}원
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
