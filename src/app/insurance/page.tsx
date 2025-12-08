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
    if (!user) {
      setInsurances([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "insurances"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const insuranceItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Insurance[];
        setInsurances(insuranceItems);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching insurances:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Are you sure you want to delete this item?")) return;

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
    <main className="space-y-6">
      <AddInsuranceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-between">
        <div className="col-span-2 md:flex md:items-baseline md:gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Insurance & Pension (보험/연금)
          </h1>
          <div className="hidden md:block">
            <span className="text-sm text-muted-foreground mr-2">
              Total Payments
            </span>
            <span className="text-xl font-bold text-foreground font-mono-num">
              ₩ {totalPaymentSum.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Mobile Only Amount Display */}
        <div className="col-span-1 text-left md:hidden">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total Payments
          </p>
          <p className="text-xl font-bold text-foreground font-mono-num">
            ₩ {totalPaymentSum.toLocaleString()}
          </p>
        </div>

        <div className="col-span-1 flex justify-end">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 text-xs md:h-10 md:text-sm"
          >
            + Add Insurance
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-muted-foreground">
          Loading...
        </div>
      ) : insurances.length === 0 ? (
        <div className="flex justify-center p-8 border border-dashed rounded-md text-muted-foreground">
          보험/연금 내역이 없습니다. '+ Add Insurance'를 눌러 추가하세요.
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="overflow-hidden p-0 rounded-none border-x-0 border-b-0 md:border md:rounded-md">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">보험사</th>
                      <th className="px-4 py-3 font-medium">설명</th>
                      <th className="px-4 py-3 font-medium">가입일</th>
                      <th className="px-4 py-3 font-medium">종료일</th>
                      <th className="px-4 py-3 font-medium text-right">
                        월 납입금액
                      </th>
                      <th className="px-4 py-3 font-medium text-right">수령</th>
                      <th className="px-4 py-3 font-medium text-right">
                        총 납입액
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {insurances.map((ins) => (
                      <tr
                        key={ins.id}
                        className="hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {ins.company}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {ins.description}
                        </td>
                        <td className="px-4 py-3 font-mono-num text-muted-foreground">
                          {ins.joinDate}
                        </td>
                        <td className="px-4 py-3 font-mono-num text-muted-foreground">
                          {ins.endDate || "-"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono-num text-foreground">
                          {ins.monthlyPayment.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                          {ins.payout > 0 ? ins.payout.toLocaleString() : "-"}
                        </td>
                        <td className="px-4 py-3 text-right font-bold font-mono-num text-foreground">
                          {ins.totalPayment.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(ins.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-secondary/20 font-bold">
                      <td
                        colSpan={6}
                        className="px-4 py-3 text-right text-foreground"
                      >
                        Grand Total
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-foreground">
                        {totalPaymentSum.toLocaleString()}
                      </td>
                      <td colSpan={1} />
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Card List View */}
          <div className="grid gap-4 md:hidden">
            {insurances.map((ins) => (
              <Card key={ins.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{ins.company}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ins.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>가입: {ins.joinDate}</span>
                      {ins.endDate && (
                        <>
                          <span>•</span>
                          <span>종료: {ins.endDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(ins.id)}
                    className="h-6 w-6 -mr-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      총 납입액
                    </p>
                    <p className="text-lg font-bold font-mono-num text-foreground">
                      ₩ {ins.totalPayment.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      월 납입 / 수령
                    </p>
                    <p className="text-sm font-medium font-mono-num text-foreground">
                      ₩ {ins.monthlyPayment.toLocaleString()}
                    </p>
                    {ins.payout > 0 && (
                      <p className="text-xs font-mono-num text-chart-up mt-1">
                        수령: ₩ {ins.payout.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
