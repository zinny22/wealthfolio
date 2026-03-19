"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CashAccount,
  TransactionType,
  Currency,
  Category,
  Trip,
} from "@/features/assets/types";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  doc,
  runTransaction,
  increment,
  serverTimestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "@/context/auth-context";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAccounts?: CashAccount[];
}

export function AddTransactionModal({
  isOpen,
  onClose,
  initialAccounts,
}: AddTransactionModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<CashAccount[]>(
    initialAccounts || [],
  );
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    type: "지출" as TransactionType,
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    accountId: "",
    toAccountId: "",
    category: "",
    memo: "",
    isTravel: false,
    tripId: "",
  });

  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    /* Firebase 주석 처리
    if (user && isOpen && (!initialAccounts || initialAccounts.length === 0)) {
      const fetchAccounts = async () => {
        const q = query(collection(db, "users", user.uid, "cash_accounts"));
        const snapshot = await getDocs(q);
        const fetchedAccounts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CashAccount[];
        setAccounts(fetchedAccounts);
        if (fetchedAccounts.length > 0 && !formData.accountId) {
          setFormData((prev) => ({
            ...prev,
            accountId: fetchedAccounts[0].id,
          }));
        }
      };
      fetchAccounts();
    } else */ if (initialAccounts && initialAccounts.length > 0) {
      setAccounts(initialAccounts);
      if (!formData.accountId) {
        setFormData((prev) => ({ ...prev, accountId: initialAccounts[0].id }));
      }
    }
  }, [user, isOpen, initialAccounts]);

  // Fetch Categories (Firebase 주석 처리 및 Mock 데이터 사용)
  useEffect(() => {
    const mockCategories: Category[] = [
      { id: "1", name: "식비", type: "지출", order: 1 },
      { id: "2", name: "카페", type: "지출", order: 2 },
      { id: "5", name: "급여", type: "수입", order: 1 },
      { id: "6", name: "이체", type: "이체", order: 1 },
      { id: "7", name: "기타", type: "지출", order: 5 },
      // 여행 전용 카테고리 (isTravel일 때 활성화)
      { id: "t1", name: "항공/교통", type: "지출", order: 10 },
      { id: "t2", name: "숙박", type: "지출", order: 11 },
      { id: "t3", name: "현지 식비", type: "지출", order: 12 },
      { id: "t4", name: "관광/액티비티", type: "지출", order: 13 },
      { id: "t5", name: "쇼핑", type: "지출", order: 14 },
    ];
    setCategories(mockCategories);

    // 여행 프로젝트 Mock 데이터 (실제로는 API에서 가져옴)
    setTrips([
      { id: "trip1", name: "오사카 식도락 여행", emoji: "🍱" } as any,
      { id: "trip2", name: "파리 한 달 살기", emoji: "🇫🇷" } as any,
    ]);

    /*
    if (!user || !isOpen) return;

    const q = query(
      collection(db, "users", user.uid, "categories"),
      orderBy("order", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      setCategories(fetched);
    });

    return () => unsubscribe();
    */
  }, [user, isOpen]);

  // Set initial category when type, categories, or isTravel changes
  useEffect(() => {
    const filtered = categories.filter((c) => {
      const typeMatch = c.type === formData.type;
      const isTravelCategory = ["t1", "t2", "t3", "t4", "t5"].includes(c.id);
      if (formData.isTravel && formData.type === "지출") {
        return typeMatch && isTravelCategory;
      }
      return typeMatch && !isTravelCategory;
    });

    if (
      filtered.length > 0 &&
      (!formData.category ||
        !filtered.find((c) => c.name === formData.category))
    ) {
      setFormData((prev) => ({ ...prev, category: filtered[0].name }));
    }
  }, [formData.type, categories, formData.isTravel]);

  // Update accountId if accounts change
  useEffect(() => {
    if (accounts.length > 0 && !formData.accountId) {
      setFormData((prev) => ({ ...prev, accountId: accounts[0].id }));
    }
  }, [accounts]);

  const handleTypeChange = (type: TransactionType) => {
    const isTravelCategories =
      formData.isTravel &&
      ["t1", "t2", "t3", "t4", "t5"].some((id) =>
        categories.find((c) => c.id === id),
      );

    const filtered = categories.filter((c) => {
      const typeMatch = c.type === type;
      if (formData.isTravel && type === "지출") {
        return typeMatch && ["t1", "t2", "t3", "t4", "t5"].includes(c.id);
      }
      return typeMatch && !["t1", "t2", "t3", "t4", "t5"].includes(c.id);
    });

    setFormData((prev) => ({
      ...prev,
      type,
      category: filtered.length > 0 ? filtered[0].name : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.accountId) return;

    if (
      formData.type === "이체" &&
      (!formData.toAccountId || formData.accountId === formData.toAccountId)
    ) {
      alert("출금 계좌와 입금 계좌를 다르게 선택해주세요.");
      return;
    }

    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const transCollectionRef = collection(
          db,
          "users",
          user.uid,
          "transactions",
        );
        const newTransRef = doc(transCollectionRef);

        const selectedAccount = accounts.find(
          (a) => a.id === formData.accountId,
        );
        const toAccount = accounts.find((a) => a.id === formData.toAccountId);
        const currency = selectedAccount?.currency || "KRW";

        // 1. Calculate balance change for source account
        let amountDiff = 0;
        if (formData.type === "지출") amountDiff = -formData.amount;
        else if (formData.type === "수입") amountDiff = formData.amount;
        else if (formData.type === "이체") amountDiff = -formData.amount;

        const srcAccountRef = doc(
          db,
          "users",
          user.uid,
          "cash_accounts",
          formData.accountId,
        );
        transaction.update(srcAccountRef, { balance: increment(amountDiff) });

        // 2. If transfer, update destination account
        if (formData.type === "이체" && formData.toAccountId) {
          const destAccountRef = doc(
            db,
            "users",
            user.uid,
            "cash_accounts",
            formData.toAccountId,
          );
          transaction.update(destAccountRef, {
            balance: increment(formData.amount),
          });
        }

        // 3. Save transaction record
        transaction.set(newTransRef, {
          ...formData,
          accountName: selectedAccount
            ? `${selectedAccount.bankName} ${selectedAccount.accountName}`
            : "",
          toAccountName: toAccount
            ? `${toAccount.bankName} ${toAccount.accountName}`
            : "",
          currency,
          createdAt: serverTimestamp(),
        });
      });

      onClose();
      // Reset form
      setFormData({
        type: "지출",
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        accountId: accounts[0]?.id || "",
        toAccountId: "",
        category: categories.filter((c) => c.type === "지출")[0]?.name || "",
        memo: "",
        isTravel: false,
        tripId: "",
      });
    } catch (error) {
      console.error("Error adding transaction: ", error);
      alert("내역 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="내역 추가">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-secondary rounded-lg">
          {(["지출", "수입", "이체"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                formData.type === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              날짜
            </label>
            <Input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              금액
            </label>
            <Input
              type="number"
              required
              min="0"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              {formData.type === "이체" ? "출금 계좌" : "계좌"}
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.accountId}
              onChange={(e) =>
                setFormData({ ...formData, accountId: e.target.value })
              }
              required
            >
              <option value="" disabled>
                계좌 선택
              </option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.bankName} - {a.accountName}
                </option>
              ))}
            </select>
          </div>

          {formData.type === "이체" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                입금 계좌
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.toAccountId}
                onChange={(e) =>
                  setFormData({ ...formData, toAccountId: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  계좌 선택
                </option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.bankName} - {a.accountName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              카테고리
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              {categories
                .filter((c) => {
                  const typeMatch = c.type === formData.type;
                  const isTravelCategory = ["t1", "t2", "t3", "t4", "t5"].includes(c.id);
                  if (formData.isTravel && formData.type === "지출") {
                     return typeMatch && isTravelCategory;
                  }
                  return typeMatch && !isTravelCategory;
                })
                .map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="pt-2 border-t border-dashed">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#3182f6]">여행 지출 기록</label>
              <input 
                type="checkbox" 
                checked={formData.isTravel}
                onChange={(e) => setFormData({ ...formData, isTravel: e.target.checked })}
                className="h-4 w-4 rounded"
              />
            </div>
            {formData.isTravel && (
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                value={formData.tripId}
                onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                required
              >
                <option value="" disabled>어느 여행인가요?</option>
                {trips.map(trip => (
                  <option key={trip.id} value={trip.id}>{trip.emoji} {trip.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              메모
            </label>
            <Input
              value={formData.memo}
              onChange={(e) =>
                setFormData({ ...formData, memo: e.target.value })
              }
              placeholder="내용 입력 (필수 아님)"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            취소
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
