"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SavingDeposit } from "@/features/assets/types";
import { useAuth } from "@/context/auth-context";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AddSavingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSavingModal({ isOpen, onClose }: AddSavingModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<SavingDeposit>>({
    type: "예금",
    bankName: "",
    joinDate: new Date().toISOString().split("T")[0],
    interestRate: 0,
    period: 12,
    amount: 0,
    isTaxFree: false,
    currency: "KRW",
    maturityDate: "",
    exchangeRate: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("현재 테스트 모드입니다. 예적금 추가는 파이어베이스 활성화 후 가능합니다.");
    onClose();
    /*
    if (!user) return;

    setLoading(true);
    try {
      // Simple calculation for maturity amounts (Example logic)
      const interest =
        (formData.amount || 0) *
        ((formData.interestRate || 0) / 100) *
        ((formData.period || 12) / 12);
      const taxRate = formData.isTaxFree ? 0 : 0.154;
      const maturityAmountPreTax = (formData.amount || 0) + interest;
      const maturityAmountPostTax =
        (formData.amount || 0) + interest * (1 - taxRate);

      const newItem = {
        ...formData,
        maturityAmountPreTax,
        maturityAmountPostTax,
        maturityAmountOriginal: maturityAmountPreTax, // Simplified
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "users", user.uid, "savings"), newItem);

      onClose();
      setFormData({
        type: "예금",
        bankName: "",
        joinDate: new Date().toISOString().split("T")[0],
        interestRate: 0,
        period: 12,
        amount: 0,
        isTaxFree: false,
        currency: "KRW",
        maturityDate: "",
        exchangeRate: 1,
      });
    } catch (error) {
      console.error("Error adding saving:", error);
      alert("예적금 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="예적금 추가">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              분류
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="예금">예금</option>
              <option value="적금">적금</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground">
              은행명
            </label>
            <Input
              required
              value={formData.bankName}
              onChange={(e) =>
                setFormData({ ...formData, bankName: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              가입일
            </label>
            <Input
              type="date"
              required
              value={formData.joinDate}
              onChange={(e) =>
                setFormData({ ...formData, joinDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              만기일
            </label>
            <Input
              type="date"
              required
              value={formData.maturityDate}
              onChange={(e) =>
                setFormData({ ...formData, maturityDate: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              금액
            </label>
            <Input
              type="number"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              이율 (%)
            </label>
            <Input
              type="number"
              step="0.01"
              required
              value={formData.interestRate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  interestRate: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              기간 (개월)
            </label>
            <Input
              type="number"
              required
              value={formData.period}
              onChange={(e) =>
                setFormData({ ...formData, period: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isTaxFree"
            checked={formData.isTaxFree}
            onChange={(e) =>
              setFormData({ ...formData, isTaxFree: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300"
          />
          <label
            htmlFor="isTaxFree"
            className="text-sm font-medium text-foreground"
          >
            비과세
          </label>
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
            {loading ? "추가 중..." : "저장하기"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
