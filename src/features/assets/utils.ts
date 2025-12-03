// src/features/assets/utils.ts
import { StockHolding, CashAccount, SavingDeposit, Insurance } from "./types";

export const calculateStockValuation = (
  stock: StockHolding,
  exchangeRate: number
) => {
  const priceInKrw =
    stock.currency === "USD"
      ? stock.currentPrice * exchangeRate
      : stock.currentPrice;
  return stock.quantity * priceInKrw;
};

export const calculateStockProfit = (stock: StockHolding) => {
  // Profit = (Current Price - Purchase Price) * Quantity
  // For USD stocks, this profit is in USD. For KRW, in KRW.
  // If we want realized gain logic, we check tradeType.
  // Here we calculate UNREALIZED profit based on unitPrice (purchase price).

  return (stock.currentPrice - stock.unitPrice) * stock.quantity;
};

export const calculateStockProfitRate = (stock: StockHolding) => {
  if (stock.unitPrice === 0) return 0;
  return ((stock.currentPrice - stock.unitPrice) / stock.unitPrice) * 100;
};

export const calculateTotalAssets = (
  stocks: StockHolding[],
  cash: CashAccount[],
  savings: SavingDeposit[],
  insurances: Insurance[],
  exchangeRate: number
) => {
  const stockTotal = stocks.reduce(
    (sum, s) => sum + calculateStockValuation(s, exchangeRate),
    0
  );
  const cashTotal = cash.reduce((sum, c) => sum + c.balance, 0);
  const savingsTotal = savings.reduce((sum, s) => sum + s.amount, 0);
  const insuranceTotal = insurances.reduce((sum, i) => sum + i.totalPayment, 0);

  return {
    stockTotal,
    cashTotal,
    savingsTotal,
    insuranceTotal,
    grandTotal: stockTotal + cashTotal + savingsTotal + insuranceTotal,
  };
};
