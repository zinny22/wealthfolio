"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAssetStore } from "@/features/assets/store";
import { AddStockModal } from "@/features/assets/components/add-stock-modal";
import {
  calculateStockProfitRate,
  calculateStockValuation,
} from "@/features/assets/utils";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function PortfolioPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { stocks, exchangeRate, removeStock } = useAssetStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Sort stocks by purchase date (desc)
  const sortedStocks = [...stocks].sort((a, b) => {
    return (
      new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );
  });

  const totalValuation = sortedStocks.reduce(
    (sum, s) => sum + calculateStockValuation(s, exchangeRate.rate),
    0
  );

  return (
    <main className="space-y-6">
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-between">
        <h1 className="col-span-2 text-2xl font-bold tracking-tight text-foreground md:col-span-1">
          주식 보유 내역
        </h1>
        <div className="col-span-1 text-left md:text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            총 평가금액 (KRW)
          </p>
          <p className="text-xl font-bold text-foreground font-mono-num">
            ₩ {totalValuation.toLocaleString()}
          </p>
        </div>
        <div className="col-span-1 flex justify-end md:block">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 text-xs md:h-10 md:text-sm"
          >
            + Add Stock
          </Button>
        </div>
      </div>

      <div className="hidden md:block">
        <Card className="overflow-hidden p-0 rounded-none border-x-0 border-b-0 md:border md:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">구매일</th>
                  <th className="px-4 py-3 font-medium">증권사</th>
                  <th className="px-4 py-3 font-medium">매매구분</th>
                  <th className="px-4 py-3 font-medium">종목명</th>
                  <th className="px-4 py-3 font-medium">종목코드</th>
                  <th className="px-4 py-3 font-medium">시장구분</th>
                  <th className="px-4 py-3 font-medium">섹터</th>
                  <th className="px-4 py-3 font-medium text-right">평단가</th>
                  <th className="px-4 py-3 font-medium text-right">수량</th>
                  <th className="px-4 py-3 font-medium">비고</th>
                  <th className="px-4 py-3 font-medium text-right">환율</th>
                  <th className="px-4 py-3 font-medium text-right">금액</th>
                  <th className="px-4 py-3 font-medium text-right">실평단가</th>
                  <th className="px-4 py-3 font-medium text-right">총액</th>
                  <th className="px-4 py-3 font-medium text-right">총액(원)</th>
                  <th className="px-4 py-3 font-medium text-right">
                    실현손익(원)
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    평가수익률
                  </th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedStocks.map((stock) => {
                  const profitRate = calculateStockProfitRate(stock);
                  const isProfit = profitRate >= 0;

                  return (
                    <tr
                      key={stock.id}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono-num text-muted-foreground">
                        {stock.purchaseDate}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {stock.broker}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            stock.tradeType === "매수"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {stock.tradeType}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {stock.name}
                      </td>
                      <td className="px-4 py-3 font-mono-num text-muted-foreground">
                        {stock.code}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {stock.market}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs uppercase">
                        {stock.sector}
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-foreground">
                        {stock.currency === "USD" ? "$" : "₩"}{" "}
                        {stock.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-foreground">
                        {stock.quantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs truncate max-w-[100px]">
                        {stock.note}
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                        {stock.exchangeRate.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                        {stock.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                        {stock.adjustedAvgPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-foreground">
                        {stock.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-foreground font-bold">
                        {stock.totalAmountKrw.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                        {stock.realizedGain.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-mono-num font-medium ${
                            isProfit ? "text-chart-up" : "text-chart-down"
                          }`}
                        >
                          {isProfit ? "+" : ""}
                          {profitRate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this item?"
                              )
                            ) {
                              removeStock(stock.id);
                            }
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card List View */}
      <div className="grid gap-4 md:hidden">
        {sortedStocks.map((stock) => {
          const profitRate = calculateStockProfitRate(stock);
          const isProfit = profitRate >= 0;

          return (
            <Card key={stock.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium border ${
                        stock.tradeType === "매수"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      }`}
                    >
                      {stock.tradeType}
                    </span>
                    <h3 className="font-bold text-foreground">{stock.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {stock.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{stock.purchaseDate}</span>
                    <span>•</span>
                    <span>{stock.broker}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono-num font-bold text-sm ${
                      isProfit ? "text-chart-up" : "text-chart-down"
                    }`}
                  >
                    {isProfit ? "+" : ""}
                    {profitRate.toFixed(2)}%
                  </span>
                  <div className="mt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this item?")
                        ) {
                          removeStock(stock.id);
                        }
                      }}
                      className="h-6 w-6 -mr-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    평가금액 (KRW)
                  </p>
                  <p className="text-lg font-bold font-mono-num text-foreground">
                    ₩ {stock.totalAmountKrw.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    수량 / 평단가
                  </p>
                  <p className="text-sm font-medium font-mono-num text-foreground">
                    {stock.quantity.toLocaleString()} 주
                  </p>
                  <p className="text-xs font-mono-num text-muted-foreground">
                    @ {stock.currency === "USD" ? "$" : "₩"}{" "}
                    {stock.unitPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
