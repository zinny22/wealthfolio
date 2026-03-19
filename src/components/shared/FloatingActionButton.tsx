"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface FABProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FABProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-5 z-[60] w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 border-4 border-white active:bg-primary/90 transition-colors"
    >
      <Plus size={28} strokeWidth={3} />
    </motion.button>
  );
}
