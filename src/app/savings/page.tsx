"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddSavingModal } from "@/features/assets/components/add-saving-modal";
import { Trash2 } from "lucide-react";
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
import { SavingDeposit } from "@/features/assets/types";

export default function SavingsPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [savings, setSavings] = useState<SavingDeposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 테스트용 모의 데이터를 설정합니다.
    setSavings([
      { id: "1", bankName: "신한은행", type: "적금", amount: 5000000, interestRate: 4.2, period: 24, joinDate: "2023-01-01", maturityDate: "2025-01-01", currency: "KRW" } as any,
      { id: "2", bankName: "국민은행", type: "예금", amount: 20000000, interestRate: 3.8, period: 12, joinDate: "2023-06-01", maturityDate: "2024-06-01", currency: "KRW" } as any,
    ]);
    setLoading(false);

    /* Firebase 구독 부분 주석 처리
    if (!user) { ... }
    const q = query(...)
    ...
    return () => unsubscribe();
    */
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user || !confirm("이 항목을 정말 삭제하시겠습니까?")) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "savings", id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!isMounted) return null;

  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);

  return (
    <main className="space-y-8">
      <AddSavingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Hero Header */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#191f28]">
            예적금 현황
          </h1>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-full bg-[#3182f6] hover:bg-[#1b64da] px-6 font-bold shadow-lg shadow-[#3182f6]/20 transition-all active:scale-95"
          >
            + 예적금 추가
          </Button>
        </div>

        <Card className="p-8 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
           <div className="relative z-10">
              <p className="text-sm font-medium text-[#8b95a1] mb-2">총 불입액 (원금)</p>
              <div className="flex items-baseline gap-2">
                 <h2 className="text-4xl font-bold text-[#191f28] tracking-tight font-mono-num">
                    ₩ {totalSavings.toLocaleString()}
                 </h2>
                 <span className="text-sm text-[#8b95a1]">KRW</span>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#3182f6] to-transparent opacity-5 transition-transform group-hover:scale-110 pointer-events-none" />
        </Card>
      </section>

      {/* Savings List Section */}
      <section className="space-y-4">
        <div className="px-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#8b95a1]">가입 상품 ({savings.length})</h3>
        </div>

        {loading ? (
          <div className="flex justify-center p-20 text-[#8b95a1] animate-pulse font-medium">로딩 중...</div>
        ) : savings.length === 0 ? (
          <Card className="p-12 text-center text-[#8b95a1] border-none shadow-none bg-white/30">
            <p className="font-medium">등록된 예적금이 없습니다.</p>
            <p className="text-xs mt-1">상단의 '+ 예적금 추가'를 눌러 자산을 등록해보세요.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {savings.map((saving) => (
              <Card key={saving.id} className="p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] group relative overflow-hidden">
                <div className="flex flex-col gap-6">
                  {/* Top: Bank & Type */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-xl font-bold text-[#3182f6]">
                        {saving.bankName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-lg font-bold text-[#191f28] leading-tight">{saving.bankName}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${saving.type === '적금' ? 'bg-[#3182f61a] text-[#3182f6]' : 'bg-[#4caf501a] text-[#4caf50]'}`}>
                            {saving.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#8b95a1] font-medium">
                          <span>가입: {saving.joinDate}</span>
                          <span>•</span>
                          <span>만기: {saving.maturityDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-base font-bold text-[#191f28] font-mono-num">{saving.interestRate.toFixed(2)}%</p>
                       <p className="text-[10px] text-[#8b95a1] font-bold mt-0.5 uppercase tracking-tighter">{saving.period}개월</p>
                    </div>
                  </div>

                  {/* Body: Amount */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#f2f4f6]">
                    <div>
                      <p className="text-[11px] font-bold text-[#8b95a1] mb-1">불입 원금</p>
                      <p className="text-xl font-bold text-[#191f28] font-mono-num">₩ {saving.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-[#8b95a1] mb-1">만기 예상 (세후)</p>
                      <p className="text-xl font-bold text-[#3182f6] font-mono-num">₩ {saving.maturityAmountPostTax.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-2xl">
                     <div className="flex gap-4 text-xs font-medium text-[#8b95a1]">
                        {saving.isTaxFree && <span className="text-[#4caf50] font-bold">비과세 적용됨</span>}
                        <span>수령액(세전): ₩{saving.maturityAmountPreTax.toLocaleString()}</span>
                     </div>
                     <button
                        onClick={() => handleDelete(saving.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-[#8b95a1] hover:text-[#f04452] transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
