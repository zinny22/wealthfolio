"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StockItem } from "@/features/assets/types";
import { useAuth } from "@/context/auth-context";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStockModal({ isOpen, onClose }: AddStockModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<StockItem>>({
    purchaseDate: new Date().toISOString().split("T")[0],
    broker: "",
    tradeType: "매수",
    name: "",
    code: "",
    market: "나스닥",
    sector: "",
    unitPrice: 0,
    quantity: 0,
    currency: "USD",
    exchangeRate: 1400,
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const unitPrice = formData.unitPrice || 0;
      const quantity = formData.quantity || 0;
      const exchangeRate =
        formData.currency === "USD" ? formData.exchangeRate || 1400 : 1;

      const newItem = {
        ...formData,
        currentPrice: unitPrice, // 초기값
        amount: unitPrice * quantity,
        adjustedAvgPrice: unitPrice,
        totalAmount: unitPrice * quantity,
        totalAmountKrw: unitPrice * quantity * exchangeRate,
        realizedGain: 0,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "users", user.uid, "stocks"), newItem);

      onClose();
      setFormData({
        purchaseDate: new Date().toISOString().split("T")[0],
        broker: "",
        tradeType: "매수",
        name: "",
        code: "",
        market: "나스닥",
        sector: "",
        unitPrice: 0,
        quantity: 0,
        currency: "USD",
        exchangeRate: 1400,
        note: "",
      });
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("주식 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Stock">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Date
            </label>
            <Input
              type="date"
              required
              value={formData.purchaseDate}
              onChange={(e) =>
                setFormData({ ...formData, purchaseDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Broker
            </label>
            <Input
              required
              value={formData.broker}
              onChange={(e) =>
                setFormData({ ...formData, broker: e.target.value })
              }
              placeholder="e.g. Kiwoom"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Name
            </label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Apple"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Code
            </label>
            <Input
              required
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="e.g. AAPL"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Qty
            </label>
            <Input
              type="number"
              required
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Price
            </label>
            <Input
              type="number"
              step="0.01"
              required
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData({ ...formData, unitPrice: Number(e.target.value) })
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
              <option value="USD">USD</option>
              <option value="KRW">KRW</option>
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
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Stock"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
