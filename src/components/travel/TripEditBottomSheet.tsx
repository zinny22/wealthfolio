"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, FileText, Table2, Download, Trash2 } from "lucide-react";

interface TripEditBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEditTrip: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onExportCSV: () => void;
  onDeleteTrip: () => void;
}

export default function TripEditBottomSheet({
  isOpen,
  onClose,
  onEditTrip,
  onExportPDF,
  onExportExcel,
  onExportCSV,
  onDeleteTrip,
}: TripEditBottomSheetProps) {
  const actionItems = [
    {
      label: "여행 정보 수정",
      icon: Pencil,
      onClick: onEditTrip,
      className: "text-foreground",
    },
    {
      label: "PDF로 내보내기",
      icon: FileText,
      onClick: onExportPDF,
      className: "text-foreground",
    },
    {
      label: "Excel로 내보내기",
      icon: Table2,
      onClick: onExportExcel,
      className: "text-foreground",
    },
    {
      label: "CSV로 내보내기",
      icon: Download,
      onClick: onExportCSV,
      className: "text-foreground",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[600px] bg-white dark:bg-slate-900 rounded-t-[36px] z-70 shadow-2xl shadow-black/20 max-h-[90vh] flex flex-col overflow-x-hidden"
          >
            <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto my-4 shrink-0" />
            <div className="px-7 pb-7">
              <div>
                {actionItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className={`w-full flex items-center gap-4 px-2 py-4 text-left transition-colors ${item.className}`}
                    >
                      <Icon size={20} strokeWidth={2} />
                      <span className="text-md font-semibold tracking-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}

                <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mt-5">
                  <button
                    onClick={onDeleteTrip}
                    className="w-full flex items-center gap-4 px-2 py-4 text-left text-rose-500"
                  >
                    <Trash2 size={20} strokeWidth={2} />
                    <span className="text-md font-semibold tracking-tight">
                      여행 삭제하기
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
