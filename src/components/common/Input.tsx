import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

function Input({ ...props }: InputProps) {
  return (
    <input
      className="w-full rounded-lg bg-gray-50 px-4 py-3 text-md font-medium outline-none transition-all focus:border-primary/20 dark:bg-gray-800 focus:ring-1 focus:ring-primary/20"
      {...props}
    />
  );
}

export default Input;
