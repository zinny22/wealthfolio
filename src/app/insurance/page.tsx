"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddInsuranceModal } from "@/features/assets/components/add-insurance-modal";
import { useAssetStore } from "@/features/assets/store";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function InsurancePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { insurances, removeInsurance } = useAssetStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        <h1 className="col-span-2 text-2xl font-bold tracking-tight text-foreground md:col-span-1">
          Insurance & Pension (보험/연금)
        </h1>
        <div className="col-span-1 text-left md:text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total Payments
          </p>
          <p className="text-xl font-bold text-foreground font-mono-num">
            ₩ {totalPaymentSum.toLocaleString()}
          </p>
        </div>
        <div className="col-span-1 flex justify-end md:block">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 text-xs md:h-10 md:text-sm"
          >
            + Add Insurance
          </Button>
        </div>
      </div>

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
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
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
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this item?"
                            )
                          ) {
                            removeInsurance(ins.id);
                          }
                        }}
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
                onClick={() => {
                  if (confirm("Are you sure you want to delete this item?")) {
                    removeInsurance(ins.id);
                  }
                }}
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
    </main>
  );
}
