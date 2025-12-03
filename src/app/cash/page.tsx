"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddCashModal } from "@/features/assets/components/add-cash-modal";
import { useAssetStore } from "@/features/assets/store";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function CashPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { cashAccounts, removeCashAccount } = useAssetStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const totalCash = cashAccounts.reduce((sum, c) => sum + c.balance, 0);

  return (
    <main className="space-y-6">
      <AddCashModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Cash Accounts (입출금)
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Total Cash
            </p>
            <p className="text-xl font-bold text-foreground font-mono-num">
              ₩ {totalCash.toLocaleString()}
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>+ Add Account</Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0 rounded-none border-x-0 border-b-0 md:border md:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-max text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              {/* Header Row 1: Date, Total, Account Names */}
              <tr>
                <th
                  rowSpan={3}
                  className="px-4 py-2 font-medium border-r border-border"
                >
                  Date
                </th>
                <th
                  rowSpan={3}
                  className="px-4 py-2 font-medium border-r border-border"
                >
                  Total Sum
                </th>
                {cashAccounts.map((account) => (
                  <th
                    key={account.id}
                    className="px-4 py-1 font-medium text-center border-b border-border min-w-[120px] relative group"
                  >
                    <div className="flex items-center justify-center gap-1">
                      {account.accountName}
                      <button
                        onClick={() => {
                          if (confirm("Delete this account?"))
                            removeCashAccount(account.id);
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 rounded p-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
              {/* Header Row 2: Bank Names */}
              <tr>
                {cashAccounts.map((account) => (
                  <th
                    key={`bank-${account.id}`}
                    className="px-4 py-1 font-medium text-center text-muted-foreground/70 border-b border-border"
                  >
                    {account.bankName}
                  </th>
                ))}
              </tr>
              {/* Header Row 3: Currencies */}
              <tr>
                {cashAccounts.map((account) => (
                  <th
                    key={`curr-${account.id}`}
                    className="px-4 py-1 font-medium text-center text-muted-foreground/50"
                  >
                    {account.currency}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-mono-num text-muted-foreground border-r border-border">
                  {new Date().toISOString().split("T")[0]}
                </td>
                <td className="px-4 py-3 font-bold font-mono-num text-foreground border-r border-border">
                  {totalCash.toLocaleString()}
                </td>
                {cashAccounts.map((account) => (
                  <td
                    key={account.id}
                    className="px-4 py-3 text-right font-mono-num text-foreground"
                  >
                    {account.balance.toLocaleString()}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
