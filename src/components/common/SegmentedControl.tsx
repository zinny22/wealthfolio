"use client";

import React from "react";
import { motion } from "framer-motion";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`flex bg-slate-100 dark:bg-slate-800 p-1 rounded-3xl w-fit relative ${className}`}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative px-5 py-1.5 rounded-3xl text-[11px] font-bold transition-colors z-10 w-20 
              ${isSelected ? "text-primary" : "text-slate-400 hover:text-slate-500"}`}
          >
            {isSelected && (
              <motion.div
                layoutId="segmented-active"
                className="absolute inset-0 bg-white dark:bg-slate-700 rounded-3xl shadow-sm z-[-1]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
