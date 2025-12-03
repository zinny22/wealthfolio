"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAssetStore } from "@/features/assets/store";
import { CashAccount } from "@/features/assets/types";

interface AddCashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCashModal({ isOpen, onClose }: AddCashModalProps) {
  const { addCashAccount } = useAssetStore();
  const [formData, setFormData] = useState<Partial<CashAccount>>({
    bankName: "",
    accountName: "",
    balance: 0,
    currency: "KRW",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: CashAccount = {
      id: crypto.randomUUID(),
      ...formData,
    } as CashAccount;

    addCashAccount(newItem);
    onClose();
    setFormData({
      bankName: "",
      accountName: "",
      balance: 0,
      currency: "KRW",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Cash Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Bank Name
            </label>
            <Input
              required
              value={formData.bankName}
              onChange={(e) =>
                setFormData({ ...formData, bankName: e.target.value })
              }
              placeholder="e.g. Shinhan"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Account Name
            </label>
            <Input
              required
              value={formData.accountName}
              onChange={(e) =>
                setFormData({ ...formData, accountName: e.target.value })
              }
              placeholder="e.g. Main Account"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Balance
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
              Currency
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
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Account</Button>
        </div>
      </form>
    </Modal>
  );
}
