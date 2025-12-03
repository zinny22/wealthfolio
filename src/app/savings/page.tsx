"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddSavingModal } from "@/features/assets/components/add-saving-modal";
import { useAssetStore } from "@/features/assets/store";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SavingsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { savings, removeSaving } = useAssetStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);

  return (
    <main className="space-y-6">
      <AddSavingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-between">
        <h1 className="col-span-2 text-2xl font-bold tracking-tight text-foreground md:col-span-1">
          Savings & Deposits (예적금)
        </h1>
        <div className="col-span-1 text-left md:text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total Savings (Principal)
          </p>
          <p className="text-xl font-bold text-foreground font-mono-num">
            ₩ {totalSavings.toLocaleString()}
          </p>
        </div>
        <div className="col-span-1 flex justify-end md:block">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 text-xs md:h-10 md:text-sm"
          >
            + Add Savings
          </Button>
        </div>
      </div>

      <div className="hidden md:block">
        <Card className="overflow-hidden p-0 rounded-none border-x-0 border-b-0 md:border md:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">구분</th>
                  <th className="px-4 py-3 font-medium">은행</th>
                  <th className="px-4 py-3 font-medium">가입일</th>
                  <th className="px-4 py-3 font-medium text-right">이율</th>
                  <th className="px-4 py-3 font-medium text-right">기간</th>
                  <th className="px-4 py-3 font-medium text-right">금액</th>
                  <th className="px-4 py-3 font-medium text-center">비과세</th>
                  <th className="px-4 py-3 font-medium text-center">통화</th>
                  <th className="px-4 py-3 font-medium text-right">
                    만기수령액(세전)
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    만기수령액(세후)
                  </th>
                  <th className="px-4 py-3 font-medium text-center">ID</th>
                  <th className="px-4 py-3 font-medium">만기일</th>
                  <th className="px-4 py-3 font-medium text-right">환율</th>
                  <th className="px-4 py-3 font-medium text-right">
                    만기수령액(통화)
                  </th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {savings.map((saving) => (
                  <tr
                    key={saving.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
                        {saving.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {saving.bankName}
                    </td>
                    <td className="px-4 py-3 font-mono-num text-muted-foreground">
                      {saving.joinDate}
                    </td>
                    <td className="px-4 py-3 text-right font-mono-num text-foreground">
                      {saving.interestRate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                      {saving.period}개월
                    </td>
                    <td className="px-4 py-3 text-right font-bold font-mono-num text-foreground">
                      {saving.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex h-2 w-2 rounded-full ${
                          saving.isTaxFree ? "bg-emerald-500" : "bg-secondary"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-mono-num text-muted-foreground">
                      {saving.currency}
                    </td>
                    <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                      {saving.maturityAmountPreTax.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold font-mono-num text-foreground">
                      {saving.maturityAmountPostTax.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center font-mono-num text-xs text-muted-foreground">
                      {saving.id}
                    </td>
                    <td className="px-4 py-3 font-mono-num text-muted-foreground">
                      {saving.maturityDate}
                    </td>
                    <td className="px-4 py-3 text-right font-mono-num text-muted-foreground">
                      {saving.exchangeRate.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono-num text-foreground">
                      {saving.currency === "USD" ? "$" : "₩"}{" "}
                      {saving.maturityAmountOriginal.toLocaleString()}
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
                            removeSaving(saving.id);
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
                    colSpan={5}
                    className="px-4 py-3 text-right text-foreground"
                  >
                    Total Savings (Principal)
                  </td>
                  <td className="px-4 py-3 text-right font-mono-num text-foreground">
                    {totalSavings.toLocaleString()}
                  </td>
                  <td colSpan={9} />
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card List View */}
      <div className="grid gap-4 md:hidden">
        {savings.map((saving) => (
          <Card key={saving.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {saving.type}
                  </span>
                  <h3 className="font-bold text-foreground">
                    {saving.bankName}
                  </h3>
                  {saving.isTaxFree && (
                    <span className="text-[10px] text-emerald-500 font-medium">
                      비과세
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>가입: {saving.joinDate}</span>
                  <span>•</span>
                  <span>만기: {saving.maturityDate}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this item?")) {
                    removeSaving(saving.id);
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
                  불입금액 (원금)
                </p>
                <p className="text-lg font-bold font-mono-num text-foreground">
                  ₩ {saving.amount.toLocaleString()}
                </p>
                <p className="text-xs font-mono-num text-muted-foreground mt-1">
                  {saving.interestRate}% ({saving.period}개월)
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-0.5">
                  만기예상액 (세후)
                </p>
                <p className="text-lg font-bold font-mono-num text-chart-up">
                  ₩ {saving.maturityAmountPostTax.toLocaleString()}
                </p>
                <p className="text-xs font-mono-num text-muted-foreground mt-1">
                  {saving.currency}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
