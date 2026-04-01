interface ButtonProps {
  handleClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}

function Button({ handleClick, disabled, children }: ButtonProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[600px] -translate-x-1/2 bg-white/90 px-4 py-6">
      <button
        onClick={handleClick}
        disabled={disabled}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-md font-bold text-white active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800"
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
