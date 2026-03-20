"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import * as Icons from "lucide-react";
import { ModernBottomSheet } from "./ModernBottomSheet";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { categories, selectedCategoryIds, setFilter } = useTransactionStore();

  const toggleCategory = (id: string) => {
    if (selectedCategoryIds.includes(id)) {
      setFilter(selectedCategoryIds.filter((cid) => cid !== id));
    } else {
      setFilter([...selectedCategoryIds, id]);
    }
  };

  const clearAll = () => setFilter([]);

  return (
    <ModernBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="카테고리 필터"
      description="보고 싶은 카테고리만 선택해보세요."
      maxWidth="700px"
      footer={
        <div className="flex gap-4">
          <button
            onClick={clearAll}
            className="flex-1 py-4.5 bg-[#f2f4f6] text-[#8b95a1] rounded-3xl font-black text-sm active:scale-95 transition-all"
          >
            초기화
          </button>
          <button
            onClick={onClose}
            className="flex-[2] py-4.5 bg-primary text-white rounded-3xl font-black text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all"
          >
            적용하기
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        {categories.map((cat) => {
          const isActive = selectedCategoryIds.includes(cat.id);
          // @ts-ignore
          const IconComp = cat.icon
            ? (Icons[cat.icon as keyof typeof Icons] as any)
            : Icons.MoreHorizontal;
          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`flex flex-col items-center gap-3 p-5 rounded-[2rem] transition-all border-2 ${
                isActive
                  ? "border-primary bg-primary/5 text-primary scale-105 shadow-md"
                  : "border-transparent bg-[#f9fafb] text-[#8b95a1]"
              }`}
            >
              <IconComp
                size={22}
                className={isActive ? "text-primary" : "text-[#adb5bd]"}
              />
              <span className="text-[12px] font-black">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </ModernBottomSheet>
  );
}
