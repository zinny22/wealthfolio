"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModernBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string; // e.g. "500px"
}

export function ModernBottomSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "500px"
}: ModernBottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`relative w-full bg-white rounded-t-[40px] shadow-2xl overflow-hidden flex flex-col safe-bottom max-h-[85vh] z-10`}
            style={{ maxWidth }}
          >
            {/* Top Handle bar */}
            <div className="w-12 h-1.5 bg-[#191f28]/10 rounded-full mx-auto mt-4 mb-2 shrink-0" />

            {/* Header */}
            {(title || description) && (
              <div className="px-8 pt-6 pb-2 shrink-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="space-y-1">
                    {title && <h3 className="text-2xl font-black text-[#191f28]">{title}</h3>}
                    {description && <p className="text-[13px] font-bold text-[#adb5bd] leading-relaxed">{description}</p>}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2.5 bg-[#f2f4f6] rounded-full text-[#adb5bd] hover:bg-[#e5e8eb] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
              {children}
            </div>

            {/* Optional Footer */}
            {footer && (
              <div className="p-8 pt-0 border-t border-[#f2f4f6]/50 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
