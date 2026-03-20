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
      className="fixed bottom-24 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-60 border-4 border-white transition-all active:scale-95"
    >
      <Plus size={28} strokeWidth={3} />
    </motion.button>
  );
}
