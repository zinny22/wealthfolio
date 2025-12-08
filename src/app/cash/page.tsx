"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddCashModal } from "@/features/assets/components/add-cash-modal";
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
import { CashAccount } from "@/features/assets/types";

export default function CashPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setCashAccounts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "cash_accounts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const accounts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CashAccount[];
        setCashAccounts(accounts);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching accounts:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Delete this account?")) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "cash_accounts", id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!isMounted) return null;

  const totalCash = cashAccounts.reduce((sum, c) => sum + c.balance, 0);

  return (
    <main className="space-y-6">
      <AddCashModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-between">
        <div className="col-span-2 md:flex md:items-baseline md:gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Cash Accounts (입출금)
          </h1>
          <div className="hidden md:block">
            <span className="text-sm text-muted-foreground mr-2">
              Total Cash
            </span>
            <span className="text-xl font-bold text-foreground font-mono-num">
              ₩ {totalCash.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Mobile Only Amount Display */}
        <div className="col-span-1 text-left md:hidden">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total Cash
          </p>
          <p className="text-xl font-bold text-foreground font-mono-num">
            ₩ {totalCash.toLocaleString()}
          </p>
        </div>

        <div className="col-span-1 flex justify-end">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 text-xs md:h-10 md:text-sm"
          >
            + Add Account
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-muted-foreground">
          Loading...
        </div>
      ) : cashAccounts.length === 0 ? (
        <div className="flex justify-center p-8 border border-dashed rounded-md text-muted-foreground">
          계좌가 없습니다. '+ Add Account'를 눌러 계좌를 추가하세요.
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="overflow-hidden p-0 rounded-none border-x-0 border-b-0 md:border md:rounded-md">
              <div className="overflow-x-auto">
                <table className="min-w-max text-left text-sm whitespace-nowrap">
                  <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 font-medium border-r border-border">
                        Bank Name
                      </th>
                      <th className="px-4 py-2 font-medium border-r border-border">
                        Account Name
                      </th>
                      <th className="px-4 py-2 font-medium border-r border-border">
                        Currency
                      </th>
                      <th className="px-4 py-2 font-medium text-right">
                        Balance
                      </th>
                      <th className="px-4 py-2 w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cashAccounts.map((account) => (
                      <tr
                        key={account.id}
                        className="hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-3 border-r border-border">
                          {account.bankName}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground border-r border-border">
                          {account.accountName}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground border-r border-border">
                          {account.currency}
                        </td>
                        <td className="px-4 py-3 text-right font-mono-num text-foreground">
                          {account.balance.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
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
                    onClick={() => handleDelete(account.id)}
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
        </>
      )}
    </main>
  );
}
