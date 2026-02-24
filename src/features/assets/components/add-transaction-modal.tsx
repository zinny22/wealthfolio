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
  });

  useEffect(() => {
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
    } else if (initialAccounts && initialAccounts.length > 0) {
      setAccounts(initialAccounts);
      if (!formData.accountId) {
        setFormData((prev) => ({ ...prev, accountId: initialAccounts[0].id }));
      }
    }
  }, [user, isOpen, initialAccounts]);

  // Fetch Categories
  useEffect(() => {
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
  }, [user, isOpen]);

  // Set initial category when type or categories change
  useEffect(() => {
    const filtered = categories.filter((c) => c.type === formData.type);
    if (
      filtered.length > 0 &&
      (!formData.category ||
        !filtered.find((c) => c.name === formData.category))
    ) {
      setFormData((prev) => ({ ...prev, category: filtered[0].name }));
    }
  }, [formData.type, categories]);

  // Update accountId if accounts change
  useEffect(() => {
    if (accounts.length > 0 && !formData.accountId) {
      setFormData((prev) => ({ ...prev, accountId: accounts[0].id }));
    }
  }, [accounts]);

  const handleTypeChange = (type: TransactionType) => {
    const filtered = categories.filter((c) => c.type === type);
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
                .filter((c) => c.type === formData.type)
                .map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
            </select>
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
