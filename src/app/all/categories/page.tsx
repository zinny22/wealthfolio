"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, Plus, GripVertical, Trash2, Check, 
  Utensils, Bus, ShoppingBag, Clapperboard, 
  HeartPulse, GraduationCap, Phone, Home, 
  Coffee, Gift, Palette
} from "lucide-react";
import { motion, Reorder } from "framer-motion";
import SegmentedControl from "@/components/common/SegmentedControl";
import Header from "@/components/common/Header";

const ICON_MAP = {
  Utensils, Bus, ShoppingBag, Clapperboard, 
  HeartPulse, GraduationCap, Phone, Home, 
  Coffee, Gift, Palette
};

const COLORS = [
  "#3B82F6", "#EF4444", "#10B981", "#F59E0B", 
  "#8B5CF6", "#EC4899", "#6B7280", "#06B6D4"
];

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  iconName: keyof typeof ICON_MAP;
  color: string;
}

const initialCategories: Category[] = [
  { id: "1", name: "식비", type: "expense", iconName: "Utensils", color: "#3B82F6" },
  { id: "2", name: "교통비", type: "expense", iconName: "Bus", color: "#F59E0B" },
  { id: "3", name: "쇼핑", type: "expense", iconName: "ShoppingBag", color: "#EC4899" },
  { id: "4", name: "문화생활", type: "expense", iconName: "Clapperboard", color: "#8B5CF6" },
  { id: "5", name: "의료/건강", type: "expense", iconName: "HeartPulse", color: "#EF4444" },
  { id: "6", name: "교육", type: "expense", iconName: "GraduationCap", color: "#10B981" },
  { id: "7", name: "통신", type: "expense", iconName: "Phone", color: "#6B7280" },
  { id: "8", name: "주거/통신", type: "expense", iconName: "Home", color: "#06B6D4" },
  { id: "9", name: "월급", type: "income", iconName: "Gift", color: "#3B82F6" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleAdd = () => {
    const newCat: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: "새 카테고리",
      type,
      iconName: "Palette",
      color: COLORS[0],
    };
    setCategories([newCat, ...categories]);
    setEditingCatId(newCat.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <main className="flex-1 flex flex-col bg-app-bg min-h-screen pb-32">
      <Header 
        title="카테고리 설정" 
        showBack 
        rightAction={
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
              isEditing ? "bg-primary text-white" : "text-primary"
            }`}
          >
            {isEditing ? "완료" : "편집"}
          </button>
        }
      />

      <div className="px-8 py-8 space-y-10">
        <div className="flex justify-center">
          <SegmentedControl
            options={[
              { label: "지출", value: "expense" },
              { label: "수입", value: "income" },
            ]}
            value={type}
            onChange={(val) => setType(val)}
            className="w-full max-w-[300px]"
          />
        </div>

        <div className="flex flex-col gap-8">
          <Reorder.Group axis="y" values={filteredCategories} onReorder={(reordered) => {
            const others = categories.filter(c => c.type !== type);
            setCategories([...reordered, ...others]);
          }}>
            {filteredCategories.map((category) => {
              const Icon = ICON_MAP[category.iconName];
              const isDetailEditing = editingCatId === category.id;

              return (
                <Reorder.Item
                  key={category.id}
                  value={category}
                  dragListener={isEditing && !isDetailEditing}
                  className="flex flex-col gap-4 py-2"
                >
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-5 flex-1">
                      {isEditing && !isDetailEditing ? (
                        <div className="text-slate-200">
                          <GripVertical size={20} />
                        </div>
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                          style={{ backgroundColor: `${category.color}15`, color: category.color }}
                          onClick={() => isEditing && setEditingCatId(isDetailEditing ? null : category.id)}
                        >
                          <Icon size={24} strokeWidth={2.5} />
                        </div>
                      )}
                      
                      {isDetailEditing ? (
                        <input
                          autoFocus
                          value={category.name}
                          onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                          className="text-[17px] font-bold text-foreground bg-transparent border-b-2 border-primary outline-none py-1 w-full max-w-[150px]"
                        />
                      ) : (
                        <span 
                          className="text-[17px] font-bold text-foreground cursor-pointer"
                          onClick={() => isEditing && setEditingCatId(category.id)}
                        >
                          {category.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                       {isEditing && (
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-slate-200 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>

                  {isDetailEditing && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="ml-16 flex flex-wrap gap-3"
                    >
                      {COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => updateCategory(category.id, { color })}
                          className={`w-8 h-8 rounded-full transition-transform active:scale-90 ${
                            category.color === color ? "ring-2 ring-primary ring-offset-2" : ""
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </motion.div>
                  )}
                </Reorder.Item>
              );
            })}
          </Reorder.Group>

          <button
            onClick={handleAdd}
            className="flex items-center gap-5 p-1 group active:scale-95 transition-all text-slate-300 hover:text-primary"
          >
            <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <Plus size={24} />
            </div>
            <span className="text-[17px] font-bold">카테고리 추가</span>
          </button>
        </div>
      </div>
    </main>
  );
}
