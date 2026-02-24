"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TransactionType, Category } from "@/features/assets/types";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { Trash2, Plus } from "lucide-react";

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CATEGORIES: {
  name: string;
  type: TransactionType;
  order: number;
}[] = [
  { name: "식비", type: "지출", order: 1 },
  { name: "교통", type: "지출", order: 2 },
  { name: "쇼핑", type: "지출", order: 3 },
  { name: "의료", type: "지출", order: 4 },
  { name: "여가", type: "지출", order: 5 },
  { name: "생활", type: "지출", order: 6 },
  { name: "주거", type: "지출", order: 7 },
  { name: "기타", type: "지출", order: 8 },
  { name: "급여", type: "수입", order: 1 },
  { name: "보너스", type: "수입", order: 2 },
  { name: "이자/배당", type: "수입", order: 3 },
  { name: "부수입", type: "수입", order: 4 },
  { name: "기타", type: "수입", order: 5 },
  { name: "이체", type: "이체", order: 1 },
  { name: "저축", type: "이체", order: 2 },
];

export function ManageCategoriesModal({
  isOpen,
  onClose,
}: ManageCategoriesModalProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [activeTab, setActiveTab] = useState<TransactionType>("지출");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !isOpen) return;

    const q = query(
      collection(db, "users", user.uid, "categories"),
      orderBy("order", "asc"),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Initialize default categories if none exist
        await initializeDefaults();
      } else {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(fetched);
      }
    });

    return () => unsubscribe();
  }, [user, isOpen]);

  const initializeDefaults = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    const colRef = collection(db, "users", user.uid, "categories");

    DEFAULT_CATEGORIES.forEach((cat) => {
      const newDocRef = doc(colRef);
      batch.set(newDocRef, cat);
    });

    await batch.commit();
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newCatName.trim()) return;

    setLoading(true);
    try {
      const colRef = collection(db, "users", user.uid, "categories");
      const sameTypeCats = categories.filter((c) => c.type === activeTab);
      const maxOrder =
        sameTypeCats.length > 0
          ? Math.max(...sameTypeCats.map((c) => c.order))
          : 0;

      await addDoc(colRef, {
        name: newCatName.trim(),
        type: activeTab,
        order: maxOrder + 1,
      });
      setNewCatName("");
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !user ||
      !confirm(
        "이 카테고리를 삭제하시겠습니까? 기존 내역의 카테고리 정보는 유지되지만 새 내역에는 선택할 수 없습니다.",
      )
    )
      return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "categories", id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="카테고리 관리">
      <div className="space-y-4">
        {/* Type Tabs */}
        <div className="flex gap-1 p-1 bg-secondary rounded-lg">
          {(["지출", "수입", "이체"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Add Field */}
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <Input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder={`${activeTab} 카테고리 이름`}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading || !newCatName.trim()}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {/* Category List */}
        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
          {categories
            .filter((c) => c.type === activeTab)
            .map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/50 group"
              >
                <span className="text-sm font-medium">{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          {categories.filter((c) => c.type === activeTab).length === 0 && (
            <p className="text-center py-8 text-xs text-muted-foreground">
              등록된 카테고리가 없습니다.
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
