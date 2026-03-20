import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, TransactionType, PaymentMethod, Category } from '@/types/transaction';

interface TransactionState {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  
  // Transactions
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Budgets
  setBudget: (month: string, categoryId: string, amount: number) => void;
  copyBudget: (fromMonth: string, toMonth: string) => void;
  
  // Filtering
  selectedCategoryIds: string[];
  setFilter: (categoryIds: string[]) => void;
  
  // Categories
  addCategory: (cat: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categories: Category[]) => void;
  
  // Init/Mock
  initializeMockData: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: [],
      categories: [
        { id: '1', name: '식비', icon: 'Utensils', color: 'bg-orange-100 text-orange-600' },
        { id: '2', name: '교통', icon: 'Bus', color: 'bg-blue-100 text-blue-600' },
        { id: '3', name: '쇼핑', icon: 'ShoppingBag', color: 'bg-pink-100 text-pink-600' },
        { id: '4', name: '의료/건강', icon: 'Activity', color: 'bg-green-100 text-green-600' },
        { id: '5', name: '문화/생활', icon: 'Film', color: 'bg-purple-100 text-purple-600' },
        { id: '6', name: '주거/통신', icon: 'Home', color: 'bg-indigo-100 text-indigo-600' },
        { id: '7', name: '기타', icon: 'MoreHorizontal', color: 'bg-gray-100 text-gray-600' },
        { id: '8', name: '월급', icon: 'Coins', color: 'bg-emerald-100 text-emerald-600' },
        { id: '9', name: '용돈', icon: 'Gift', color: 'bg-yellow-100 text-yellow-600' },
      ],
      
      addTransaction: (t) => set((state) => ({
        transactions: [
          ...state.transactions,
          { ...t, id: Math.random().toString(36).substring(2, 9) }
        ]
      })),
      
      updateTransaction: (id, t) => set((state) => ({
        transactions: state.transactions.map((trans) => trans.id === id ? { ...trans, ...t } : trans)
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((trans) => trans.id !== id)
      })),
      
      setBudget: (month, categoryId, amount) => set((state) => {
        const existingIdx = state.budgets.findIndex(b => b.month === month && b.categoryId === categoryId);
        if (existingIdx > -1) {
          const newBudgets = [...state.budgets];
          newBudgets[existingIdx] = { month, categoryId, amount };
          return { budgets: newBudgets };
        }
        return { budgets: [...state.budgets, { month, categoryId, amount }] };
      }),
      
      copyBudget: (fromMonth, toMonth) => set((state) => {
        const fromBudgets = state.budgets.filter(b => b.month === fromMonth);
        const otherBudgets = state.budgets.filter(b => b.month !== toMonth);
        const copied = fromBudgets.map(b => ({ ...b, month: toMonth }));
        return { budgets: [...otherBudgets, ...copied] };
      }),
      
      selectedCategoryIds: [],
      setFilter: (ids) => set({ selectedCategoryIds: ids }),
      
      addCategory: (cat) => set((state) => ({
        categories: [...state.categories, { ...cat, id: Math.random().toString(36).substring(2, 9) }]
      })),
      
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      })),
      
      reorderCategories: (newCats) => set({ categories: newCats }),
      
      initializeMockData: () => {
        const now = new Date();
        const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        set({
          transactions: [
            { id: 'm1', date: `${yearMonth}-10`, amount: 50000, type: 'expense', categoryId: '1', method: 'card', memo: '맛있는 점심' },
            { id: 'm2', date: `${yearMonth}-12`, amount: 3000, type: 'expense', categoryId: '2', method: 'cash', memo: '버스비' },
            { id: 'm3', date: `${yearMonth}-15`, amount: 2500000, type: 'income', categoryId: '8', method: 'card', memo: '3월 월급' },
            { id: 'm4', date: `${yearMonth}-18`, amount: 12000, type: 'expense', categoryId: '3', method: 'card', memo: '티셔츠' },
          ],
          budgets: [
            { categoryId: '1', amount: 500000, month: yearMonth },
            { categoryId: '2', amount: 100000, month: yearMonth },
            { categoryId: '3', amount: 200000, month: yearMonth },
          ]
        });
      }
    }),
    {
      name: 'wealthfolio-storage',
    }
  )
);
