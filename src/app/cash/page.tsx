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
  Settings2,
  Search,
  ChevronLeft,
  ChevronRight,
  Utensils,
  ShoppingBag,
  Bus,
  Coffee,
  MoreHorizontal,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import {
  deleteDoc,
  doc,
  runTransaction,
  increment,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CashAccount, Transaction, Budget } from "@/features/assets/types";
import { Input } from "@/components/ui/input";

// 카테고리별 아이콘 매핑
const CATEGORY_ICONS: Record<string, any> = {
  식비: Utensils,
  쇼핑: ShoppingBag,
  교통: Bus,
  카페: Coffee,
  급여: TrendingUp,
  이체: CreditCard,
  기타: MoreHorizontal,
};

const getCategoryIcon = (category: string) => {
  return CATEGORY_ICONS[category] || MoreHorizontal;
};

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
    "history",
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
    // 테스트용 모의 데이터를 설정합니다.
    setCashAccounts([
      {
        id: "1",
        bankName: "신한은행",
        accountName: "주거래 계좌",
        balance: 15600000,
        currency: "KRW",
      } as any,
      {
        id: "2",
        bankName: "카카오뱅크",
        accountName: "비상금",
        balance: 5000000,
        currency: "KRW",
      } as any,
    ]);

    setTransactions([
      {
        id: "1",
        date: "2024-03-19",
        type: "지출",
        category: "식비",
        amount: 15500,
        memo: "마라탕",
        accountName: "주거래 계좌",
      } as any,
      {
        id: "2",
        date: "2024-03-19",
        type: "지출",
        category: "카페",
        amount: 4500,
        memo: "아이스 아메리카노",
        accountName: "주거래 계좌",
      } as any,
      {
        id: "3",
        date: "2024-03-18",
        type: "수입",
        category: "급여",
        amount: 3500000,
        memo: "3월 급여",
        accountName: "주거래 계좌",
      } as any,
      {
        id: "4",
        date: "2024-03-18",
        type: "지출",
        category: "교통",
        amount: 2400,
        memo: "지하철",
        accountName: "주거래 계좌",
      } as any,
      {
        id: "5",
        date: "2024-03-17",
        type: "지출",
        category: "쇼핑",
        amount: 89000,
        memo: "나이키 운동화",
        accountName: "비상금",
      } as any,
    ]);

    setBudget({ amount: 1200000, month: selectedMonth } as any);

    setBudget({ amount: 1200000, month: selectedMonth } as any);
    setTempBudget(1200000);
    setLoading(false);
  }, [user, selectedMonth]);

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

  // 날짜별로 그룹화된 내역
  const groupedTransactions = useMemo(() => {
    const groups: Record<
      string,
      { transactions: Transaction[]; dailyExpense: number; dailyIncome: number }
    > = {};

    filteredTransactions.forEach((t) => {
      if (!groups[t.date]) {
        groups[t.date] = { transactions: [], dailyExpense: 0, dailyIncome: 0 };
      }
      groups[t.date].transactions.push(t);
      if (t.type === "지출") groups[t.date].dailyExpense += t.amount;
      else if (t.type === "수입") groups[t.date].dailyIncome += t.amount;
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredTransactions]);

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
    alert(
      "현재 테스트 모드입니다. 예산 저장은 파이어베이스 활성화 후 가능합니다.",
    );
    setIsBudgetEditing(false);
    /*
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
    */
  };

  const handleDeleteAccount = async (id: string) => {
    alert(
      "현재 테스트 모드입니다. 계좌 삭제는 파이어베이스 활성화 후 가능합니다.",
    );
    /*
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
    */
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
    alert(
      "현재 테스트 모드입니다. 내역 삭제는 파이어베이스 활성화 후 가능합니다.",
    );
    /*
    if (
      !user ||
      !confirm(
        "이 내역을 삭제하시겠습니까? 해당 계좌의 잔액이 취소 전으로 복구됩니다.",
      )
    )
      return;

    try {
      await runTransaction(db, async (t) => {
        const transRef = doc(db, "users", user.uid, "transactions", transaction.id);
        const srcAccountRef = doc(db, "users", user.uid, "cash_accounts", transaction.accountId);
        
        let amountDiff = 0;
        if (transaction.type === "지출") amountDiff = transaction.amount;
        else if (transaction.type === "수입") amountDiff = -transaction.amount;
        else if (transaction.type === "이체") amountDiff = transaction.amount;

        t.update(srcAccountRef, { balance: increment(amountDiff) });

        if (transaction.type === "이체" && transaction.toAccountId) {
          const destAccountRef = doc(db, "users", user.uid, "cash_accounts", transaction.toAccountId);
          t.update(destAccountRef, { balance: increment(-transaction.amount) });
        }

        t.delete(transRef);
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
    */
  };

  if (!isMounted) return null;

  const totalCash = cashAccounts.reduce((sum, c) => sum + c.balance, 0);

  return (
    <main className="space-y-8 pb-32">
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

      {/* Hero Header: Budget Focus */}
      <section className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#8b95a1] uppercase tracking-wider">
                이번 달 소비 현황
              </span>
              <div className="h-1 w-1 rounded-full bg-[#3182f6]" />
              <span className="text-[11px] font-bold text-[#3182f6]">
                {selectedMonth.split("-")[1]}월
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-bold text-[#191f28] tracking-tight">
                ₩ {monthStats.expense.toLocaleString()}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#8b95a1]">
                  남은 예산
                </span>
                <span
                  className={`text-sm font-bold ${budget && budget.amount - monthStats.expense < 0 ? "text-[#f04452]" : "text-[#3182f6]"}`}
                >
                  ₩{" "}
                  {(budget
                    ? budget.amount - monthStats.expense
                    : 0
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4 max-w-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-[#8b95a1]">
                  예산{" "}
                  {Math.round(
                    (monthStats.expense / (budget?.amount || 1)) * 100,
                  )}
                  % 사용 중
                </span>
                <button
                  onClick={() => setIsBudgetEditing(true)}
                  className="text-[10px] font-bold text-[#3182f6] hover:underline"
                >
                  예산 설정
                </button>
              </div>
              <div className="w-full h-3 bg-[#f2f4f6] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${budget && monthStats.expense / budget.amount > 0.9 ? "bg-[#f04452]" : "bg-[#3182f6]"}`}
                  style={{
                    width: `${Math.min(100, budget ? (monthStats.expense / budget.amount) * 100 : 0)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:w-80">
            <Card className="p-4 bg-[#f9fafb] border-none shadow-none rounded-2xl">
              <p className="text-[10px] font-bold text-[#8b95a1] mb-1">
                총 수익
              </p>
              <p className="text-lg font-bold text-[#4caf50]">
                +{monthStats.income.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 bg-[#f9fafb] border-none shadow-none rounded-2xl">
              <p className="text-[10px] font-bold text-[#8b95a1] mb-1">
                총 지출
              </p>
              <p className="text-lg font-bold text-[#f04452]">
                -{monthStats.expense.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 bg-[#3182f61a] border-none shadow-none rounded-2xl col-span-2 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#3182f6] mb-0.5">
                  현재 현금 총합
                </p>
                <p className="text-lg font-bold text-[#191f28]">
                  ₩ {totalCash.toLocaleString()}
                </p>
              </div>
              <PlusCircle className="h-5 w-5 text-[#3182f6] opacity-50" />
            </Card>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-[#3182f6]/5 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
      </section>

      {/* Tabs Menu */}
      <section className="flex items-center justify-between bg-white/60 backdrop-blur-md sticky top-0 z-20 py-4 border-b border-[#f2f4f6]/50">
        <div className="flex gap-8 px-2">
          {["accounts", "history", "stats"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-sm font-bold transition-all relative py-2 ${
                activeTab === tab ? "text-[#191f28]" : "text-[#adb5bd]"
              }`}
            >
              {tab === "accounts"
                ? "계좌"
                : tab === "history"
                  ? "기록"
                  : "통계"}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#191f28] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {activeTab === "history" && (
            <div className="flex items-center bg-[#f2f4f6] rounded-full px-3 py-1">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 hover:text-[#3182f6]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-[#4e5968] mx-2">
                {selectedMonth.split("-")[1]}월
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="p-1 hover:text-[#3182f6]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCatModalOpen(true)}
            className="rounded-full hover:bg-[#f2f4f6]"
          >
            <Settings2 className="h-4 w-4 text-[#8b95a1]" />
          </Button>
        </div>
      </section>

      {/* Content Area */}
      <section>
        {loading ? (
          <div className="flex justify-center p-20 text-[#8b95a1] animate-pulse font-medium">
            데이터를 정리하고 있습니다...
          </div>
        ) : activeTab === "accounts" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cashAccounts.map((account) => (
              <Card
                key={account.id}
                className="p-6 group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] flex items-center justify-center text-[#3182f6] font-bold">
                      {account.bankName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#8b95a1] mb-0.5">
                        {account.bankName}
                      </p>
                      <h3 className="text-base font-bold text-[#191f28]">
                        {account.accountName}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-[#8b95a1] hover:text-[#f04452] transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-baseline justify-between mt-auto">
                  <span className="text-[10px] font-bold text-[#adb5bd]">
                    {account.currency}
                  </span>
                  <h3 className="text-xl font-bold text-[#191f28] font-mono-num">
                    ₩ {account.balance.toLocaleString()}
                  </h3>
                </div>
              </Card>
            ))}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex flex-col items-center justify-center p-6 bg-white/50 border-2 border-dashed border-[#e5e8eb] rounded-3xl hover:bg-white transition-all group min-h-[140px]"
            >
              <Plus className="h-8 w-8 text-[#adb5bd] mb-2 group-hover:text-[#3182f6] transition-colors" />
              <span className="text-xs font-bold text-[#adb5bd] group-hover:text-[#3182f6]">
                계좌 추가
              </span>
            </button>
          </div>
        ) : activeTab === "stats" ? (
          <StatsDashboard transactions={filteredTransactions} />
        ) : (
          <div className="space-y-10">
            {groupedTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-32 text-[#8b95a1]">
                <ShoppingBag className="h-16 w-16 mb-4 opacity-10" />
                <p className="text-sm font-bold opacity-40">
                  아직 이번 달 기록이 없어요.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {groupedTransactions.map(([date, data]) => (
                  <div key={date} className="space-y-4">
                    <div className="flex items-baseline justify-between px-2">
                      <div className="flex items-baseline gap-2">
                        <h4 className="text-lg font-bold text-[#191f28]">
                          {date.split("-")[2]}일
                        </h4>
                        <span className="text-[11px] font-medium text-[#adb5bd]">
                          {new Date(date).toLocaleDateString("ko-KR", {
                            weekday: "long",
                          })}
                        </span>
                      </div>
                      <div className="flex gap-3 text-[11px] font-bold">
                        {data.dailyIncome > 0 && (
                          <span className="text-[#4caf50]">
                            +{data.dailyIncome.toLocaleString()}원
                          </span>
                        )}
                        {data.dailyExpense > 0 && (
                          <span className="text-[#f04452]">
                            {data.dailyExpense.toLocaleString()}원
                          </span>
                        )}
                      </div>
                    </div>

                    <Card className="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-3xl">
                      <div className="divide-y divide-[#f2f4f6]">
                        {data.transactions.map((t) => {
                          const Icon = getCategoryIcon(t.category);
                          return (
                            <div
                              key={t.id}
                              className="p-5 flex items-center justify-between hover:bg-[#f9fafb] transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                                    t.type === "수입"
                                      ? "bg-[#4caf501a] text-[#4caf50]"
                                      : t.type === "지출"
                                        ? "bg-[#f044521a] text-[#f04452]"
                                        : "bg-[#3182f61a] text-[#3182f6]"
                                  }`}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <h5 className="font-bold text-[#191f28] text-sm">
                                      {t.memo || t.category}
                                    </h5>
                                    <span className="text-[10px] text-[#adb5bd] font-medium">
                                      • {t.category}
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-medium text-[#adb5bd]">
                                    {t.accountName}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p
                                    className={`text-base font-bold font-mono-num ${
                                      t.type === "수입"
                                        ? "text-[#3182f6]"
                                        : t.type === "지출"
                                          ? "text-[#f04452]"
                                          : "text-[#191f28]"
                                    }`}
                                  >
                                    {t.type === "수입"
                                      ? "+"
                                      : t.type === "지출"
                                        ? ""
                                        : ""}
                                    {t.amount.toLocaleString()}
                                  </p>
                                  {t.type === "이체" && (
                                    <p className="text-[10px] font-medium text-[#adb5bd]">
                                      이체
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDeleteTransaction(t)}
                                  className="opacity-0 group-hover:opacity-100 p-2 text-[#adb5bd] hover:text-[#f04452] transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Floating Action Button for 가계부 느낌 */}
      <button
        onClick={() => setIsTransModalOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-[#191f28] text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group overflow-hidden"
      >
        <Plus className="h-8 w-8 relative z-10" />
        <div className="absolute inset-0 bg-[#3182f6] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>

      {/* Budget Edit Modal Placeholder (Inline input in this case) */}
      {isBudgetEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <Card className="w-full max-w-sm p-8 bg-white rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-[#191f28] mb-6">
              이번 달 예산 설정
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8b95a1] ml-1">
                  한 달 목표 지출액
                </label>
                <Input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(Number(e.target.value))}
                  className="h-14 rounded-2xl border-none bg-[#f2f4f6] text-lg font-bold px-5"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  className="flex-1 h-12 rounded-xl font-bold text-[#8b95a1]"
                  onClick={() => setIsBudgetEditing(false)}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl bg-[#3182f6] font-bold"
                  onClick={handleUpdateBudget}
                >
                  저장하기
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  title,
  amount,
  color,
  prefix = "",
  subText,
}: {
  title: string;
  amount: number;
  color: string;
  prefix?: string;
  subText?: string;
}) {
  return (
    <Card className="p-6 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group rounded-3xl">
      <p className="text-[11px] font-bold text-[#8b95a1] uppercase mb-1 relative z-10">
        {title}
      </p>
      <h3
        className="text-2xl font-bold tracking-tight font-mono-num relative z-10"
        style={{ color: color === "#3182f6" ? "#191f28" : color }}
      >
        {prefix}₩ {amount.toLocaleString()}
      </h3>
      {subText && (
        <p className="mt-2 text-[11px] font-medium text-[#8b95a1] relative z-10">
          {subText}
        </p>
      )}
      <div
        className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br transition-all group-hover:scale-110 opacity-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom right, ${color}, transparent)`,
        }}
      />
    </Card>
  );
}
