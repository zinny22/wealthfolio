import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  StockItem,
  CashAccount,
  SavingDeposit,
  Insurance,
  ExchangeRate,
} from "./types";
import {
  MOCK_STOCKS,
  MOCK_CASH,
  MOCK_SAVINGS,
  MOCK_INSURANCE,
  MOCK_EXCHANGE_RATE,
} from "./mock";

interface AssetStore {
  stocks: StockItem[];
  cashAccounts: CashAccount[];
  savings: SavingDeposit[];
  insurances: Insurance[];
  exchangeRate: ExchangeRate;

  // Stock Actions
  addStock: (stock: StockItem) => void;
  updateStock: (id: string, stock: Partial<StockItem>) => void;
  removeStock: (id: string) => void;

  // Cash Actions
  addCashAccount: (account: CashAccount) => void;
  updateCashAccount: (id: string, account: Partial<CashAccount>) => void;
  removeCashAccount: (id: string) => void;

  // Savings Actions
  addSaving: (saving: SavingDeposit) => void;
  updateSaving: (id: string, saving: Partial<SavingDeposit>) => void;
  removeSaving: (id: string) => void;

  // Insurance Actions
  addInsurance: (insurance: Insurance) => void;
  updateInsurance: (id: string, insurance: Partial<Insurance>) => void;
  removeInsurance: (id: string) => void;

  // Exchange Rate
  setExchangeRate: (rate: number) => void;
}

export const useAssetStore = create<AssetStore>()(
  persist(
    (set) => ({
      stocks: MOCK_STOCKS,
      cashAccounts: MOCK_CASH,
      savings: MOCK_SAVINGS,
      insurances: MOCK_INSURANCE,
      exchangeRate: MOCK_EXCHANGE_RATE,

      // Stock
      addStock: (stock) =>
        set((state) => ({ stocks: [...state.stocks, stock] })),
      updateStock: (id, stock) =>
        set((state) => ({
          stocks: state.stocks.map((s) =>
            s.id === id ? { ...s, ...stock } : s
          ),
        })),
      removeStock: (id) =>
        set((state) => ({
          stocks: state.stocks.filter((s) => s.id !== id),
        })),

      // Cash
      addCashAccount: (account) =>
        set((state) => ({ cashAccounts: [...state.cashAccounts, account] })),
      updateCashAccount: (id, account) =>
        set((state) => ({
          cashAccounts: state.cashAccounts.map((c) =>
            c.id === id ? { ...c, ...account } : c
          ),
        })),
      removeCashAccount: (id) =>
        set((state) => ({
          cashAccounts: state.cashAccounts.filter((c) => c.id !== id),
        })),

      // Savings
      addSaving: (saving) =>
        set((state) => ({ savings: [...state.savings, saving] })),
      updateSaving: (id, saving) =>
        set((state) => ({
          savings: state.savings.map((s) =>
            s.id === id ? { ...s, ...saving } : s
          ),
        })),
      removeSaving: (id) =>
        set((state) => ({
          savings: state.savings.filter((s) => s.id !== id),
        })),

      // Insurance
      addInsurance: (insurance) =>
        set((state) => ({ insurances: [...state.insurances, insurance] })),
      updateInsurance: (id, insurance) =>
        set((state) => ({
          insurances: state.insurances.map((i) =>
            i.id === id ? { ...i, ...insurance } : i
          ),
        })),
      removeInsurance: (id) =>
        set((state) => ({
          insurances: state.insurances.filter((i) => i.id !== id),
        })),

      // Exchange Rate
      setExchangeRate: (rate) =>
        set((state) => ({
          exchangeRate: { ...state.exchangeRate, rate },
        })),
    }),
    {
      name: "wealthfolio-storage", // LocalStorage key
    }
  )
);
