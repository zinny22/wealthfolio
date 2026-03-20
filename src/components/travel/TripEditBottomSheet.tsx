"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Save } from "lucide-react";

interface TripEditBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  trip: {
    title: string;
    startDate: Date;
    endDate: Date;
    totalBudget: number;
    currencySymbol: string;
  };
  onSave: (updatedTrip: any) => void;
}

export default function TripEditBottomSheet({
  isOpen,
  onClose,
  trip,
  onSave
}: TripEditBottomSheetProps) {
  const [title, setTitle] = useState(trip.title);
  const [startDate, setStartDate] = useState(trip.startDate.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(trip.endDate.toISOString().split('T')[0]);
  const [budget, setBudget] = useState(trip.totalBudget.toString());

  useEffect(() => {
    if (isOpen) {
      setTitle(trip.title);
      setStartDate(trip.startDate.toISOString().split('T')[0]);
      setEndDate(trip.endDate.toISOString().split('T')[0]);
      setBudget(trip.totalBudget.toString());
    }
  }, [isOpen, trip]);

  const handleSave = () => {
    if (!title || !startDate || !endDate || !budget) return;
    
    onSave({
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalBudget: parseInt(budget)
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[600px] bg-white dark:bg-slate-900 rounded-t-4xl z-[70] shadow-2xl shadow-black/20 max-h-[90vh] flex flex-col overflow-x-hidden"
          >
            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto my-4 shrink-0" />
            
            <div className="px-8 pb-4 flex items-center justify-between shrink-0">
              <h3 className="text-[20px] font-black tracking-tight text-foreground">여행 정보 수정</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-4 no-scrollbar">
              <div className="space-y-8 py-2">
                {/* Title */}
                <div className="space-y-3">
                  <p className="text-[12px] font-bold text-slate-500 ml-1 uppercase">여행 이름</p>
                  <input
                    type="text"
                    placeholder="여행 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-[16px] font-bold outline-none border-2 border-transparent focus:border-primary/20 transition-all shadow-sm"
                  />
                </div>

                {/* Dates */}
                <div className="space-y-3">
                  <p className="text-[12px] font-bold text-slate-500 ml-1 uppercase">여행 기간</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <p className="text-[11px] font-bold text-slate-400">시작일</p>
                        <input 
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl text-[14px] font-bold outline-none border-2 border-transparent focus:border-primary/20"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[11px] font-bold text-slate-400">종료일</p>
                        <input 
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl text-[14px] font-bold outline-none border-2 border-transparent focus:border-primary/20"
                        />
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-4">
                  <p className="text-[12px] font-bold text-slate-500 ml-1 uppercase">총 여행 예산</p>
                  <div className="flex items-center gap-2 border-b-2 border-slate-100 dark:border-slate-800 pb-2 focus-within:border-primary transition-colors">
                    <span className="text-xl font-bold text-slate-400">{trip.currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ""))}
                      className="flex-1 bg-transparent text-2xl font-black outline-none tracking-tight"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 pb-10 pt-4 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
              <button
                onClick={handleSave}
                disabled={!title || !startDate || !endDate || !budget}
                className="w-full h-15 bg-primary disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-300 rounded-2xl text-[16px] font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                저장하기
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
