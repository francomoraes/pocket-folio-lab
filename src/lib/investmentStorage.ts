import { Transaction, Position } from "@/shared/types/investment";

const STORAGE_KEY = "investTracker_transactions";

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const loadTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const calculatePositions = (transactions: Transaction[]): Position[] => {
  const positionsMap = new Map<string, Position>();

  transactions.forEach((transaction) => {
    const existing = positionsMap.get(transaction.ticker);

    if (!existing) {
      if (transaction.operation === "buy") {
        positionsMap.set(transaction.ticker, {
          ticker: transaction.ticker,
          assetClass: transaction.assetClass,
          assetType: transaction.assetType,
          quantity: transaction.quantity,
          averagePrice: transaction.price,
          currentPrice: transaction.price,
          totalValue: transaction.quantity * transaction.price,
          profitLoss: 0,
          profitLossPercentage: 0,
        });
      }
    } else {
      if (transaction.operation === "buy") {
        const newQuantity = existing.quantity + transaction.quantity;
        const newAveragePrice =
          (existing.averagePrice * existing.quantity +
            transaction.price * transaction.quantity) /
          newQuantity;

        positionsMap.set(transaction.ticker, {
          ...existing,
          quantity: newQuantity,
          averagePrice: newAveragePrice,
          totalValue: newQuantity * existing.currentPrice,
        });
      } else {
        const newQuantity = existing.quantity - transaction.quantity;

        if (newQuantity <= 0) {
          positionsMap.delete(transaction.ticker);
        } else {
          positionsMap.set(transaction.ticker, {
            ...existing,
            quantity: newQuantity,
            totalValue: newQuantity * existing.currentPrice,
          });
        }
      }
    }
  });

  return Array.from(positionsMap.values()).map((position) => {
    const profitLoss =
      position.totalValue - position.averagePrice * position.quantity;
    const profitLossPercentage =
      ((position.currentPrice - position.averagePrice) /
        position.averagePrice) *
      100;

    return {
      ...position,
      profitLoss,
      profitLossPercentage,
    };
  });
};
