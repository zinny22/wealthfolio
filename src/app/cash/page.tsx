"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddCashModal } from "@/features/assets/components/add-cash-modal";
import { AddTransactionModal } from "@/features/assets/components/add-transaction-modal";
import { ManageCategoriesModal } from "@/features/assets/components/manage-categories-modal";
import { StatsDashboard } from "@/features/assets/components/stats-dashboard";
import {
  Trash2,
  PlusCircle,
  History,
  Settings2,
  Search,
  ChevronLeft,
  ChevronRight,
  PieChart as ChartIcon,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  runTransaction,
  increment,
  limit,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CashAccount, Transaction, Budget } from "@/features/assets/types";
import { Input } from "@/components/ui/input";

export default function CashPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"accounts" | "history" | "stats">(
    "accounts",
  );

  // Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setCashAccounts([]);
      setTransactions([]);
      setBudget(null);
      setLoading(false);
      return;
    }

    // Accounts Subscription
    const qAccounts = query(
      collection(db, "users", user.uid, "cash_accounts"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribeAccounts = onSnapshot(
      qAccounts,
      (snapshot) => {
        const accounts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CashAccount[];
        setCashAccounts(accounts);
      },
      (error) => {
        console.error("Error fetching accounts:", error);
      },
    );

    // Budget Subscription for Selected Month
    const unsubscribeBudget = onSnapshot(
      doc(db, "users", user.uid, "budgets", selectedMonth),
      (docSnap) => {
        if (docSnap.exists()) {
          const bData = { id: docSnap.id, ...docSnap.data() } as Budget;
          setBudget(bData);
          setTempBudget(bData.amount);
        } else {
          setBudget(null);
          setTempBudget(0);
        }
      },
    );

    // Transactions Subscription (All for client-side filtering)
    const qTrans = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("date", "desc"),
      orderBy("createdAt", "desc"),
      limit(200), // Increased limit for better filtering
    );

    const unsubscribeTrans = onSnapshot(
      qTrans,
      (snapshot) => {
        const trans = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Transaction[];
        setTransactions(trans);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      },
    );

    return () => {
      unsubscribeAccounts();
      unsubscribeTrans();
      unsubscribeBudget();
    };
  }, [user, selectedMonth]);

  // Combined Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchMonth = t.date.startsWith(selectedMonth);
      const matchSearch =
        t.memo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase());

      return matchMonth && matchSearch;
    });
  }, [transactions, selectedMonth, searchTerm]);

  // Statistics for filtered data
  const monthStats = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.type === "수입") acc.income += t.amount;
        else if (t.type === "지출") acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [filteredTransactions]);

  const changeMonth = (delta: number) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const date = new Date(year, month - 1 + delta, 1);
    setSelectedMonth(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const handleUpdateBudget = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid, "budgets", selectedMonth), {
        amount: tempBudget,
        month: selectedMonth,
        currency: "KRW",
        updatedAt: serverTimestamp(),
      });
      setIsBudgetEditing(false);
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("예산 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (
      !user ||
      !confirm(
        "계좌를 삭제하시겠습니까? 계좌와 연동된 내역의 실제 잔액에는 영향을 주지 않습니다.",
      )
    )
      return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "cash_accounts", id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
    if (
      !user ||
      !confirm(
        "이 내역을 삭제하시겠습니까? 해당 계좌의 잔액이 취소 전으로 복구됩니다.",
      )
    )
      return;

    try {
      await runTransaction(db, async (t) => {
        const transRef = doc(
          db,
          "users",
          user.uid,
          "transactions",
          transaction.id,
        );

        // Restore balance logic
        const srcAccountRef = doc(
          db,
          "users",
          user.uid,
          "cash_accounts",
          transaction.accountId,
        );
        let amountDiff = 0;
        if (transaction.type === "지출") amountDiff = transaction.amount;
        else if (transaction.type === "수입") amountDiff = -transaction.amount;
        else if (transaction.type === "이체") amountDiff = transaction.amount;

        t.update(srcAccountRef, { balance: increment(amountDiff) });

        if (transaction.type === "이체" && transaction.toAccountId) {
          const destAccountRef = doc(
            db,
            "users",
            user.uid,
            "cash_accounts",
            transaction.toAccountId,
          );
          t.update(destAccountRef, { balance: increment(-transaction.amount) });
        }

        t.delete(transRef);
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!isMounted) return null;

  const totalCash = cashAccounts.reduce((sum, c) => sum + c.balance, 0);

  return (
    <main className="space-y-6 pb-20">
      <AddCashModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <AddTransactionModal
        isOpen={isTransModalOpen}
        onClose={() => setIsTransModalOpen(false)}
        initialAccounts={cashAccounts}
      />
      <ManageCategoriesModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
      />

      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-xs font-medium text-primary/60 uppercase tracking-wider">
            Total balance (총 잔액)
          </p>
          <p className="text-2xl font-bold font-mono-num">
            ₩ {totalCash.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4 bg-blue-500/5 border-blue-500/20">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-blue-500/60 uppercase tracking-wider">
              Month Income
            </p>
          </div>
          <p className="text-2xl font-bold font-mono-num text-blue-600">
            +₩ {monthStats.income.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4 bg-red-500/5 border-red-500/20">
          <p className="text-xs font-medium text-red-500/60 uppercase tracking-wider">
            Month Expense
          </p>
          <p className="text-2xl font-bold font-mono-num text-red-600">
            -₩ {monthStats.expense.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4 bg-amber-500/5 border-amber-500/20 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-medium text-amber-600/60 uppercase tracking-wider">
                Monthly Budget
              </p>
              <button
                onClick={() => setIsBudgetEditing(!isBudgetEditing)}
                className="text-[10px] text-amber-700 hover:underline"
              >
                {isBudgetEditing ? "취소" : budget ? "수정" : "설정"}
              </button>
            </div>
            {isBudgetEditing ? (
              <div className="flex gap-2 mb-2">
                <Input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(Number(e.target.value))}
                  className="h-7 text-xs"
                />
                <Button
                  size="sm"
                  className="h-7 px-2 text-[10px]"
                  onClick={handleUpdateBudget}
                >
                  저장
                </Button>
              </div>
            ) : (
              <p className="text-xl font-bold font-mono-num text-amber-700">
                ₩ {budget?.amount.toLocaleString() || "0"}
              </p>
            )}
          </div>

          <div className="mt-2 text-[10px] space-y-1">
            <div className="flex justify-between font-medium">
              <span>남은 예산</span>
              <span
                className={
                  budget && budget.amount - monthStats.expense < 0
                    ? "text-red-500"
                    : "text-amber-700"
                }
              >
                ₩{" "}
                {(budget
                  ? budget.amount - monthStats.expense
                  : 0
                ).toLocaleString()}
              </span>
            </div>
            <div className="w-full h-1.5 bg-amber-200/50 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${budget && monthStats.expense / budget.amount > 0.9 ? "bg-red-500" : "bg-amber-500"}`}
                style={{
                  width: `${Math.min(100, budget ? (monthStats.expense / budget.amount) * 100 : 0)}%`,
                }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-1 p-1 bg-secondary rounded-lg w-full md:max-w-[300px]">
          <button
            onClick={() => setActiveTab("accounts")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "accounts"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            계좌 목록
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "history"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            최근 내역
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "stats"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            통계 분석
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="메모, 카테고리 검색..."
              className="pl-9 h-9 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCatModalOpen(true)}
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
            title="카테고리 설정"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="hidden md:flex"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            계좌 추가
          </Button>
          <Button size="sm" onClick={() => setIsTransModalOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            내역 추가
          </Button>
        </div>
      </div>

      {/* Month Filter (For history and stats tabs) */}
      {(activeTab === "history" || activeTab === "stats") && (
        <div className="flex items-center justify-center gap-4 py-2 bg-secondary/10 rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 font-bold text-lg font-mono-num">
            {selectedMonth.replace("-", "년 ")}월
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => changeMonth(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => {
              const today = new Date();
              setSelectedMonth(
                `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
              );
            }}
          >
            이번 달
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-8 text-muted-foreground italic">
          로딩 중...
        </div>
      ) : (
        <>
          {activeTab === "accounts" ? (
            <div className="grid gap-4">
              {cashAccounts.length === 0 ? (
                <div className="flex justify-center p-8 border border-dashed rounded-md text-muted-foreground">
                  계좌가 없습니다. '계좌 추가'를 눌러 시작하세요.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cashAccounts.map((account) => (
                    <Card
                      key={account.id}
                      className="p-4 group relative hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter mb-1">
                            {account.bankName}
                          </p>
                          <h3 className="font-bold text-foreground leading-none">
                            {account.accountName}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-secondary-foreground/40 text-xs font-mono">
                          {account.currency}
                        </span>
                        <p className="text-xl font-bold font-mono-num text-foreground">
                          {account.currency === "USD" ? "$" : "₩"}{" "}
                          {account.balance.toLocaleString()}
                        </p>
                      </div>
                    </Card>
                  ))}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg hover:bg-secondary/20 transition-colors min-h-[120px]"
                  >
                    <PlusCircle className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium text-muted-foreground">
                      새 계좌 연결
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === "stats" ? (
            <StatsDashboard transactions={filteredTransactions} />
          ) : (
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-md text-muted-foreground">
                  <p>필터링된 내역이 없습니다.</p>
                  {(searchTerm || selectedMonth) && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        const today = new Date();
                        setSelectedMonth(
                          `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
                        );
                      }}
                    >
                      필터 초기화
                    </Button>
                  )}
                </div>
              ) : (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground border-b border-border">
                        <tr>
                          <th className="px-4 py-2 font-medium">날짜</th>
                          <th className="px-4 py-2 font-medium">계좌</th>
                          <th className="px-4 py-2 font-medium">
                            유형/카테고리
                          </th>
                          <th className="px-4 py-2 font-medium">메모</th>
                          <th className="px-4 py-2 font-medium text-right">
                            금액
                          </th>
                          <th className="px-4 py-2 w-[50px]"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredTransactions.map((t) => (
                          <tr
                            key={t.id}
                            className="hover:bg-secondary/20 transition-colors group"
                          >
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {t.date}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col max-w-[150px]">
                                {t.type === "이체" ? (
                                  <>
                                    <span className="text-[10px] text-red-400 font-medium truncate">
                                      출금: {t.accountName || "알 수 없음"}
                                    </span>
                                    <span className="text-[10px] text-blue-400 font-medium truncate">
                                      입금: {t.toAccountName || "알 수 없음"}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xs font-medium truncate">
                                    {t.accountName || "기록된 계좌 없음"}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span
                                  className={`text-[10px] font-bold uppercase ${
                                    t.type === "수입"
                                      ? "text-blue-500"
                                      : t.type === "지출"
                                        ? "text-red-500"
                                        : "text-amber-500"
                                  }`}
                                >
                                  {t.type}
                                </span>
                                <span className="font-medium">
                                  {t.category}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground truncate max-w-[150px]">
                              {t.memo || "-"}
                            </td>
                            <td
                              className={`px-4 py-3 text-right font-bold font-mono-num ${
                                t.type === "수입"
                                  ? "text-blue-600"
                                  : t.type === "지출"
                                    ? "text-red-600"
                                    : "text-foreground"
                              }`}
                            >
                              {t.type === "지출"
                                ? "-"
                                : t.type === "수입"
                                  ? "+"
                                  : ""}
                              {t.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteTransaction(t)}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
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
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
