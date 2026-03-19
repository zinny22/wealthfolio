"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CashAccount } from "@/features/assets/types";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";

interface AddCashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCashModal({ isOpen, onClose }: AddCashModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CashAccount>>({
    bankName: "",
    accountName: "",
    balance: 0,
    currency: "KRW",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("현재 테스트 모드입니다. 계좌 추가는 파이어베이스 활성화 후 가능합니다.");
    onClose();
    /*
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "users", user.uid, "cash_accounts"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      onClose();
      setFormData({
        bankName: "",
        accountName: "",
        balance: 0,
        currency: "KRW",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("자산 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="현금 계좌 추가">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              금융사/은행명
            </label>
            <Input
              required
              value={formData.bankName}
              onChange={(e) =>
                setFormData({ ...formData, bankName: e.target.value })
              }
              placeholder="예: 신한은행"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              계좌 별칭
            </label>
            <Input
              required
              value={formData.accountName}
              onChange={(e) =>
                setFormData({ ...formData, accountName: e.target.value })
              }
              placeholder="예: 주거래 계좌"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              잔액
            </label>
            <Input
              type="number"
              required
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              통화
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value as any })
              }
            >
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
            </select>
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
            {loading ? "추가 중..." : "계좌 추가"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
