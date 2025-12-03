"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAssetStore } from "@/features/assets/store";
import { StockItem } from "@/features/assets/types";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStockModal({ isOpen, onClose }: AddStockModalProps) {
  const { addStock } = useAssetStore();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: StockItem = {
      id: crypto.randomUUID(),
      ...formData,
      currentPrice: formData.unitPrice || 0, // 초기값
      amount: (formData.unitPrice || 0) * (formData.quantity || 0),
      adjustedAvgPrice: formData.unitPrice || 0,
      totalAmount: (formData.unitPrice || 0) * (formData.quantity || 0),
      totalAmountKrw:
        (formData.unitPrice || 0) *
        (formData.quantity || 0) *
        (formData.currency === "USD" ? formData.exchangeRate || 1 : 1),
      realizedGain: 0,
    } as StockItem;

    addStock(newItem);
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
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Stock</Button>
        </div>
      </form>
    </Modal>
  );
}
