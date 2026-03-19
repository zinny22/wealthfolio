"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddInsuranceModal } from "@/features/assets/components/add-insurance-modal";
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
import { Insurance } from "@/features/assets/types";

export default function InsurancePage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 테스트용 모의 데이터를 설정합니다.
    setInsurances([
      { id: "1", company: "삼성생명", description: "실손보험", monthlyPayment: 54000, totalPayment: 3240000, payout: 0, joinDate: "2019-03-01" } as any,
      { id: "2", company: "현대해상", description: "자동차보험", monthlyPayment: 80000, totalPayment: 960000, payout: 0, joinDate: "2023-11-01" } as any,
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
      await deleteDoc(doc(db, "users", user.uid, "insurances", id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!isMounted) return null;

  const totalPaymentSum = insurances.reduce(
    (sum, ins) => sum + ins.totalPayment,
    0
  );

  return (
    <main className="space-y-8">
      <AddInsuranceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Hero Header */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#191f28]">
            보험 및 연금 현황
          </h1>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-full bg-[#3182f6] hover:bg-[#1b64da] px-6 font-bold shadow-lg shadow-[#3182f6]/20 transition-all active:scale-95"
          >
            + 추가하기
          </Button>
        </div>

        <Card className="p-8 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
           <div className="relative z-10">
              <p className="text-sm font-medium text-[#8b95a1] mb-2">총 납입액</p>
              <div className="flex items-baseline gap-2">
                 <h2 className="text-4xl font-bold text-[#191f28] tracking-tight font-mono-num">
                    ₩ {totalPaymentSum.toLocaleString()}
                 </h2>
                 <span className="text-sm text-[#8b95a1]">KRW</span>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#4caf50] to-transparent opacity-5 transition-transform group-hover:scale-110 pointer-events-none" />
        </Card>
      </section>

      {/* Insurance List Section */}
      <section className="space-y-4">
        <div className="px-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#8b95a1]">가입 내역 ({insurances.length})</h3>
        </div>

        {loading ? (
          <div className="flex justify-center p-20 text-[#8b95a1] animate-pulse font-medium">데이터를 불러오는 중...</div>
        ) : insurances.length === 0 ? (
          <Card className="p-12 text-center text-[#8b95a1] border-none shadow-none bg-white/30">
            <p className="font-medium">등록된 보험이나 연금이 없습니다.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {insurances.map((ins) => (
              <Card key={ins.id} className="p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] group relative overflow-hidden">
                <div className="flex flex-col gap-6">
                  {/* Top: Company & Description */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-xl font-bold text-[#4caf50]">
                        {ins.company.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-lg font-bold text-[#191f28] leading-tight">{ins.company}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#4caf501a] text-[#4caf50]">
                            보장형
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#8b95a1] font-medium">
                          <span>{ins.description}</span>
                          <span>•</span>
                          <span>가입: {ins.joinDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-base font-bold text-[#191f28] font-mono-num">₩ {ins.monthlyPayment.toLocaleString()}</p>
                       <p className="text-[10px] text-[#8b95a1] font-bold mt-0.5 uppercase tracking-tighter">월 납입금</p>
                    </div>
                  </div>

                  {/* Body: Totals */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#f2f4f6]">
                    <div>
                      <p className="text-[11px] font-bold text-[#8b95a1] mb-1">총 납입액</p>
                      <p className="text-xl font-bold text-[#191f28] font-mono-num">₩ {ins.totalPayment.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-[#8b95a1] mb-1">누적 수령액</p>
                      <p className="text-xl font-bold text-[#191f28] font-mono-num opacity-40">₩ {ins.payout.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-end p-2 bg-[#f9fafb] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                     <button
                        onClick={() => handleDelete(ins.id)}
                        className="p-2 text-[#8b95a1] hover:text-[#f04452] transition-all"
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
