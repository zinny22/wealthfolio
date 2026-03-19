"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import * as Icons from "lucide-react";

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="w-full max-w-[600px] bg-white rounded-t-[2.5rem] shadow-2xl p-8 outline-none"
        >
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-black text-[#191f28]">카테고리 필터</h4>
            <button onClick={onClose} className="p-3 bg-[#f2f4f6] text-[#8b95a1] rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {categories.map((cat) => {
              const isActive = selectedCategoryIds.includes(cat.id);
              // @ts-ignore
              const IconComp = cat.icon ? (Icons[cat.icon as keyof typeof Icons] as any) : Icons.MoreHorizontal;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-3xl transition-all border-2 ${
                    isActive ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-[#f2f4f6]"
                  }`}
                >
                  <IconComp size={20} className={isActive ? "text-primary" : "text-[#8b95a1]"} />
                  <span className="text-[11px] font-black">{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={clearAll}
              className="flex-1 py-4 bg-[#f2f4f6] text-[#8b95a1] rounded-2xl font-black text-sm"
            >
              초기화
            </button>
            <button
              onClick={onClose}
              className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20"
            >
              필터 적용
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
