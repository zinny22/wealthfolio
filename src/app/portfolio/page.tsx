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
    // 테스트용 모의 데이터를 설정합니다.
    setStocks([
      {
        id: "1",
        purchaseDate: "2024-01-15",
        broker: "키움증권",
        tradeType: "매수",
        name: "애플",
        code: "AAPL",
        market: "나스닥",
        sector: "TECH",
        unitPrice: 180.5,
        currentPrice: 192.3,
        quantity: 10,
        currency: "USD",
        exchangeRate: 1350,
        amount: 1805,
        adjustedAvgPrice: 180.5,
        totalAmount: 1923,
        totalAmountKrw: 2596050,
        realizedGain: 0,
        note: "장기 보유",
      },
      {
        id: "2",
        purchaseDate: "2024-02-10",
        broker: "미래에셋",
        tradeType: "매수",
        name: "삼성전자",
        code: "005930",
        market: "코스피",
        sector: "SEMICON",
        unitPrice: 72000,
        currentPrice: 75000,
        quantity: 100,
        currency: "KRW",
        exchangeRate: 1,
        amount: 7200000,
        adjustedAvgPrice: 72000,
        totalAmount: 7500000,
        totalAmountKrw: 7500000,
        realizedGain: 0,
        note: "배당수익 기대",
      },
    ] as any);
    setLoading(false);

    /* Firebase 구독 부분 주석 처리
    if (!user) { ... }
    const q = query(...)
    const unsubscribe = onSnapshot(...)
    return () => unsubscribe();
    */
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user || !confirm("이 항목을 정말 삭제하시겠습니까?")) return;

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
    <main className="space-y-8">
      <AddStockModal
        key={editingStock ? editingStock.id : "new"}
        isOpen={isAddModalOpen || !!editingStock}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStock(null);
        }}
        initialData={editingStock}
      />

      {/* Hero Header */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#191f28]">
            주식 보유 내역
          </h1>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-full bg-[#3182f6] hover:bg-[#1b64da] px-6 font-bold shadow-lg shadow-[#3182f6]/20 transition-all active:scale-95"
          >
            + 종목 추가
          </Button>
        </div>

        <Card className="p-8 bg-white overflow-hidden relative border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
           <div className="relative z-10">
              <p className="text-sm font-medium text-[#8b95a1] mb-2">총 평가금액</p>
              <div className="flex items-baseline gap-2">
                 <h2 className="text-4xl font-bold text-[#191f28] tracking-tight font-mono-num">
                    ₩ {totalValuation.toLocaleString()}
                 </h2>
                 <span className="text-sm text-[#8b95a1]">KRW</span>
              </div>
              <p className="mt-4 text-xs text-[#8b95a1] font-medium">
                 현재 환율: <span className="text-[#191f28]">1 USD = {exchangeRate.toLocaleString()}원</span>
              </p>
           </div>
        </Card>
      </section>

      {/* Stock List Section */}
      <section className="space-y-4">
        <div className="px-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#8b95a1]">보유 종목 ({stocks.length})</h3>
        </div>

        {loading ? (
          <div className="flex justify-center p-20 text-[#8b95a1] animate-pulse font-medium">
            데이터를 불러오는 중...
          </div>
        ) : stocks.length === 0 ? (
          <Card className="p-12 text-center text-[#8b95a1] border-none shadow-none bg-white/50">
            <p className="font-medium">보유하신 주식 종목이 없습니다.</p>
            <p className="text-xs mt-1">상단의 '+ 종목 추가' 버튼을 눌러 자산을 등록해보세요.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {stocks.map((stock) => {
              const profitRate = calculateStockProfitRate(stock);
              const isProfit = profitRate >= 0;
              const valuation = calculateStockValuation(stock, exchangeRate);

              return (
                <Card 
                  key={stock.id} 
                  className="p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] group"
                >
                  <div className="flex flex-col gap-6">
                    {/* Top Row: Name and Profit */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-xl font-bold text-[#3182f6]">
                           {stock.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-lg font-bold text-[#191f28] leading-tight">
                              {stock.name}
                            </h3>
                            <span className="text-[11px] font-bold text-[#8b95a1] bg-[#f2f4f6] px-2 py-0.5 rounded-md">
                              {stock.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#8b95a1] font-medium">
                            <span>{stock.market}</span>
                            <span>•</span>
                            <span>{stock.broker}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-base font-bold font-mono-num ${
                            isProfit ? "text-[#f04452]" : "text-[#3182f6]"
                          }`}
                        >
                          {isProfit ? "+" : ""}
                          {profitRate.toFixed(2)}%
                        </span>
                        <p className="text-[10px] text-[#8b95a1] font-medium mt-0.5 font-mono-num">
                           {stock.purchaseDate}
                        </p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#f2f4f6]">
                       <div>
                          <p className="text-[11px] font-semibold text-[#8b95a1] mb-1">현재가 총액</p>
                          <p className="text-xl font-bold text-[#191f28] font-mono-num">
                             ₩ {valuation.toLocaleString()}
                          </p>
                       </div>
                       <div className="text-right">
                          <p className="text-[11px] font-semibold text-[#8b95a1] mb-1">보유 수량</p>
                          <p className="text-lg font-bold text-[#4e5968] font-mono-num">
                             {stock.quantity.toLocaleString()} 주
                          </p>
                       </div>
                    </div>

                    {/* Detail Stats Section */}
                    <div className="flex items-center justify-between text-xs text-[#8b95a1] font-medium bg-[#f9fafb] p-3 rounded-2xl">
                       <div className="flex gap-4">
                          <div>평단 <span className="text-[#4e5968] ml-1">{stock.currency === "USD" ? "$" : "₩"}{stock.unitPrice.toLocaleString()}</span></div>
                          <div>환율 <span className="text-[#4e5968] ml-1">{stock.exchangeRate?.toLocaleString()}</span></div>
                       </div>
                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingStock(stock)}
                            className="h-8 w-8 text-[#8b95a1] hover:text-[#3182f6] hover:bg-[#3182f6]/10 rounded-full"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(stock.id)}
                            className="h-8 w-8 text-[#8b95a1] hover:text-[#f04452] hover:bg-[#f04452]/10 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
