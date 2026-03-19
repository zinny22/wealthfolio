export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'card';

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji
  color: string; // Tailwind class or hex
}

export interface Transaction {
  id: string;
  date: string; // ISO format string
  amount: number;
  type: TransactionType;
  categoryId: string;
  method: PaymentMethod;
  memo?: string;
}

export interface Budget {
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM
}
