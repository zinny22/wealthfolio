"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddStockModal } from "@/features/assets/components/add-stock-modal";
import {
  calculateStockProfitRate,
  calculateStockValuation,
} from "@/features/assets/utils";
import { Trash2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StockItem } from "@/features/assets/types";
import { useExchangeRate } from "@/hooks/use-exchange-rate";

export default function PortfolioPage() {
  const { user } = useAuth();
  const { rate: exchangeRate } = useExchangeRate();
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setStocks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "stocks"),
      orderBy("purchaseDate", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const stockItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as StockItem[];
        setStocks(stockItems);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching stocks:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "stocks", id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!isMounted) return null;

  const totalValuation = stocks.reduce(
    (sum, s) => sum + calculateStockValuation(s, exchangeRate),
    0
  );

  console.log(exchangeRate);

  return (
    <main className="space-y-6">
      <AddStockModal
        key={editingStock ? editingStock.id : "new"}
        isOpen={isAddModalOpen || !!editingStock}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStock(null);
        }}
        initialData={editingStock}
      />
      <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-between">
        <div className="col-span-2 md:flex md:items-baseline md:gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            주식 보유 내역
          </h1>
          <div className="hidden md:block">
            <span className="text-sm text-muted-foreground mr-2">
              총 평가금액 (KRW)
            </span>
            <span className="text-xl font-bold text-foreground font-mono-num">
              ₩ {totalValuation.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Mobile Only Amount Display */}
        <div className="col-span-1 text-left md:hidden">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            총 평가금액 (KRW)
          </p>
          <p className="text-xl font-bold text-foreground font-mono-num">
            ₩ {totalValuation.toLocaleString()}
          </p>
        </div>

        <div className="col-span-1 flex justify-end">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 text-xs md:h-10 md:text-sm"
          >
            + Add Stock
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-muted-foreground">
          Loading...
        </div>
      ) : stocks.length === 0 ? (
        <div className="flex justify-center p-8 border border-dashed rounded-md text-muted-foreground">
          주식 내역이 없습니다. '+ Add Stock'을 눌러 추가하세요.
        </div>
      ) : (
        <>
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
                      <th className="px-4 py-3 font-medium text-right">
                        평단가
                      </th>
                      <th className="px-4 py-3 font-medium text-right">수량</th>
                      <th className="px-4 py-3 font-medium">비고</th>
                      <th className="px-4 py-3 font-medium text-right">환율</th>
                      <th className="px-4 py-3 font-medium text-right">금액</th>
                      <th className="px-4 py-3 font-medium text-right">
                        실평단가
                      </th>
                      <th className="px-4 py-3 font-medium text-right">총액</th>
                      <th className="px-4 py-3 font-medium text-right">
                        총액(원)
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        실현손익(원)
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        평가수익률
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {stocks.map((stock) => {
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
                            {stock.exchangeRate?.toLocaleString()}
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
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingStock(stock)}
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(stock.id)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
            {stocks.map((stock) => {
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
                        <h3 className="font-bold text-foreground">
                          {stock.name}
                        </h3>
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
                      <div className="mt-1 flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingStock(stock)}
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(stock.id)}
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
                      {stock.currency === "USD" && (
                        <p className="text-[10px] font-mono-num text-muted-foreground mt-1">
                          환율: {stock.exchangeRate?.toLocaleString()} /{" "}
                          {exchangeRate.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
