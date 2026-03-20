"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  ChevronLeft, 
  Trash2, 
  Plus, 
  Check,
  Utensils,
  Bus,
  ShoppingBag,
  Activity,
  Film,
  Home,
  MoreHorizontal,
  Coins,
  Gift,
  Search,
  Zap,
  Coffee,
  Car,
  Laptop,
  Book,
  Heart,
  Music,
  Tent,
  Smile,
  GripVertical
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Category } from "@/types/transaction";

const ICON_LIST = [
  "Utensils", "Bus", "ShoppingBag", "Activity", "Film", "Home", 
  "Coins", "Gift", "Coffee", "Car", "Laptop", "Book", 
  "Heart", "Music", "Tent", "Smile", "Zap", "Search", "MoreHorizontal"
];

const COLOR_LIST = [
  { bg: "bg-orange-100", text: "text-orange-600", key: "orange" },
  { bg: "bg-blue-100", text: "text-blue-600", key: "blue" },
  { bg: "bg-pink-100", text: "text-pink-600", key: "pink" },
  { bg: "bg-green-100", text: "text-green-600", key: "green" },
  { bg: "bg-purple-100", text: "text-purple-600", key: "purple" },
  { bg: "bg-indigo-100", text: "text-indigo-600", key: "indigo" },
  { bg: "bg-yellow-100", text: "text-yellow-600", key: "yellow" },
  { bg: "bg-emerald-100", text: "text-emerald-600", key: "emerald" },
  { bg: "bg-gray-100", text: "text-gray-600", key: "gray" },
];

export default function CategorySettingsPage() {
  const router = useRouter();
  const { categories, addCategory, deleteCategory, reorderCategories } = useTransactionStore();
  const [isAdding, setIsAdding] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);
  // New Category State
  const [newName, setNewName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("MoreHorizontal");
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const handleAddCategory = () => {
    if (!newName.trim()) return;
    const colorObj = COLOR_LIST[selectedColorIdx];
    addCategory({
      name: newName,
      icon: selectedIcon,
      color: `${colorObj.bg} ${colorObj.text}`
    });
    setNewName("");
    setIsAdding(false);
    setLocalCategories([...categories, { id: 'temp', name: newName, icon: selectedIcon, color: `${colorObj.bg} ${colorObj.text}` }]);
  };

  const saveOrder = () => {
    reorderCategories(localCategories);
    setIsOrderChanged(false);
  };

  const onReorder = (newOrder: Category[]) => {
    setLocalCategories(newOrder);
    setIsOrderChanged(true);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#f9fafb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex h-16 items-center px-4 bg-white border-b border-[#f2f4f6]">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-[#f2f4f6] rounded-full text-[#191f28] transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-[17px] font-black text-[#191f28] flex-1 text-center">카테고리 관리</h2>
        <div className="w-12 flex justify-end">
          {isOrderChanged && (
            <button 
              onClick={saveOrder}
              className="text-[13px] font-black text-primary px-3 py-1.5 bg-primary/10 rounded-lg hover:bg-primary/20 transition-all"
            >
              순서 저장
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[14px] font-black text-[#adb5bd] uppercase tracking-widest">나의 카테고리</h3>
             <span className="text-[12px] font-bold text-primary">{localCategories.length}개</span>
          </div>
          
          <motion.div className="grid grid-cols-1 gap-3">
            <Reorder.Group axis="y" values={localCategories} onReorder={onReorder} className="space-y-3">
              {localCategories.map((cat) => {
                // @ts-ignore
                const IconComp = LucideIcons[cat.icon] || LucideIcons.MoreHorizontal;
                return (
                  <Reorder.Item 
                    key={cat.id}
                    value={cat}
                    className="bg-white p-4 rounded-3xl border border-[#f2f4f6] flex items-center justify-between shadow-sm group active:shadow-lg active:scale-[1.02] transition-all cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-[#adb5bd] group-hover:text-[#191f28] transition-colors">
                        <GripVertical size={18} />
                      </div>
                      <div className={`w-10 h-10 flex items-center justify-center rounded-2xl ${cat.color} transition-transform`}>
                         <IconComp size={18} />
                      </div>
                      <span className="text-[15px] font-black text-[#191f28]">{cat.name}</span>
                    </div>
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="p-2 text-[#adb5bd] hover:text-expense hover:bg-expense/5 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </motion.div>
        </section>
      </div>

      {/* Floating Add Button - Smaller and fixed visibility */}
      {!isAdding && (
        <motion.button
          initial={{ y: 20, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          onClick={() => setIsAdding(true)}
          className="fixed bottom-10 left-1/2 bg-[#191f28] text-white px-6 py-3.5 rounded-full font-black flex items-center gap-2 shadow-2xl z-40 border-4 border-white active:scale-95 transition-all text-sm"
        >
          <Plus size={16} strokeWidth={3} /> 카테고리 추가
        </motion.button>
      )}

      {/* Add Category Sheet */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 z-60 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-70 bg-white rounded-t-[3rem] shadow-2xl p-8 pb-10 flex flex-col h-[80vh] outline-none"
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-[#e5e8eb] rounded-full" />
              
              <div className="flex items-center justify-between mt-4 mb-8">
                <h4 className="text-xl font-black text-[#191f28]">새 카테고리</h4>
                <button onClick={() => setIsAdding(false)} className="p-2.5 bg-[#f2f4f6] text-[#8b95a1] rounded-full"><LucideIcons.X size={18} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 pr-1">
                {/* Name Input */}
                <div className="space-y-3">
                   <p className="text-[11px] font-black text-[#adb5bd] tracking-widest pl-2">CATEGORY NAME</p>
                   <input 
                     autoFocus
                     value={newName}
                     onChange={(e) => setNewName(e.target.value)}
                     placeholder="카테고리 이름을 입력하세요"
                     className="w-full p-6 bg-[#f2f4f6] rounded-4xl text-lg font-black text-[#191f28] placeholder:text-[#adb5bd] border-none focus:ring-2 focus:ring-primary/20 transition-all"
                   />
                </div>

                {/* Color Picker */}
                <div className="space-y-4">
                  <p className="text-[11px] font-black text-[#adb5bd] tracking-widest pl-2">SELECT COLOR</p>
                  <div className="flex flex-wrap gap-3 px-2">
                    {COLOR_LIST.map((color, idx) => (
                      <button
                        key={color.key}
                        onClick={() => setSelectedColorIdx(idx)}
                        className={`w-10 h-10 rounded-full ${color.bg} border-4 transition-all ${selectedColorIdx === idx ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Grid */}
                <div className="space-y-4">
                  <p className="text-[11px] font-black text-[#adb5bd] tracking-widest pl-2">SELECT ICON</p>
                  <div className="grid grid-cols-5 gap-3 pb-4">
                    {ICON_LIST.map((icon) => {
                      // @ts-ignore
                      const IconComp = LucideIcons[icon];
                      const isSelected = selectedIcon === icon;
                      return (
                        <button
                          key={icon}
                          onClick={() => setSelectedIcon(icon)}
                          className={`flex items-center justify-center w-full aspect-square rounded-2xl transition-all border-2 ${
                            isSelected ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-[#f2f4f6] text-[#8b95a1]"
                          }`}
                        >
                          <IconComp size={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#f2f4f6]">
                 <button 
                   onClick={handleAddCategory}
                   disabled={!newName.trim()}
                   className="w-full py-5 bg-primary text-white rounded-4xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-30 transition-all active:scale-95"
                 >
                   <Check size={20} strokeWidth={3} /> 카테고리 저장
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
