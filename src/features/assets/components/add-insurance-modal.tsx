"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Insurance } from "@/features/assets/types";
import { useAuth } from "@/context/auth-context";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AddInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddInsuranceModal({ isOpen, onClose }: AddInsuranceModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Insurance>>({
    company: "",
    description: "",
    joinDate: new Date().toISOString().split("T")[0],
    endDate: "",
    monthlyPayment: 0,
    payout: 0,
    totalPayment: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const newItem = {
        ...formData,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "users", user.uid, "insurances"), newItem);

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
    } catch (error) {
      console.error("Error adding insurance:", error);
      alert("보험/연금 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Insurance"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
