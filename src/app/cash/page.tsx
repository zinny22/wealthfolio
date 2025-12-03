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
      <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-between">
        <h1 className="col-span-2 text-2xl font-bold tracking-tight text-foreground md:col-span-1">
          Cash Accounts (입출금)
        </h1>
        <div className="col-span-1 text-left md:text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total Cash
          </p>
          <p className="text-xl font-bold text-foreground font-mono-num">
            ₩ {totalCash.toLocaleString()}
          </p>
        </div>
        <div className="col-span-1 flex justify-end md:block">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 text-xs md:h-10 md:text-sm"
          >
            + Add Account
          </Button>
        </div>
      </div>

      <div className="hidden md:block">
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
      </div>

      {/* Mobile Card List View */}
      <div className="grid gap-4 md:hidden">
        {cashAccounts.map((account) => (
          <Card key={account.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground">
                    {account.accountName}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {account.currency}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {account.bankName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (confirm("Delete this account?"))
                    removeCashAccount(account.id);
                }}
                className="h-6 w-6 -mr-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-0.5">
                잔액 (Balance)
              </p>
              <p className="text-xl font-bold font-mono-num text-foreground">
                {account.currency === "USD" ? "$" : "₩"}{" "}
                {account.balance.toLocaleString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
