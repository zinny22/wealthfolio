"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAssetStore } from "@/features/assets/store";
import { Insurance } from "@/features/assets/types";

interface AddInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddInsuranceModal({ isOpen, onClose }: AddInsuranceModalProps) {
  const { addInsurance } = useAssetStore();
  const [formData, setFormData] = useState<Partial<Insurance>>({
    company: "",
    description: "",
    joinDate: new Date().toISOString().split("T")[0],
    endDate: "",
    monthlyPayment: 0,
    payout: 0,
    totalPayment: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Insurance = {
      id: crypto.randomUUID(),
      ...formData,
    } as Insurance;

    addInsurance(newItem);
    onClose();
    setFormData({
      company: "",
      description: "",
      joinDate: new Date().toISOString().split("T")[0],
      endDate: "",
      monthlyPayment: 0,
      payout: 0,
      totalPayment: 0,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Insurance">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Company
            </label>
            <Input
              required
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Description
            </label>
            <Input
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Join Date
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
              End Date
            </label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Monthly Pay
            </label>
            <Input
              type="number"
              required
              value={formData.monthlyPayment}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monthlyPayment: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Total Paid
            </label>
            <Input
              type="number"
              required
              value={formData.totalPayment}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalPayment: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Payout (Est)
            </label>
            <Input
              type="number"
              value={formData.payout}
              onChange={(e) =>
                setFormData({ ...formData, payout: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Insurance</Button>
        </div>
      </form>
    </Modal>
  );
}
