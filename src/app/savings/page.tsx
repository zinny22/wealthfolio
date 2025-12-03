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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Savings & Deposits (예적금)
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Total Savings (Principal)
            </p>
            <p className="text-xl font-bold text-foreground font-mono-num">
              ₩ {totalSavings.toLocaleString()}
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>+ Add Savings</Button>
        </div>
      </div>

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
                          confirm("Are you sure you want to delete this item?")
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
    </main>
  );
}
