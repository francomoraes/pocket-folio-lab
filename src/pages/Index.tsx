import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Positions } from "@/pages/Positions";
import { Dashboard } from "@/pages/Dashboard";
import {
  Transaction,
  Position,
  AllocationByClass,
  AllocationByTicker,
  PatrimonyEvolution,
} from "@/types/investment";
import {
  saveTransactions,
  loadTransactions,
  calculatePositions,
} from "@/lib/investmentStorage";
import { TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Layout";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [activeTab, setActiveTab] = useState("positions");

  useEffect(() => {
    const loaded = loadTransactions();
    setTransactions(loaded);
    setPositions(calculatePositions(loaded));
  }, []);

  const handleAddTransaction = (
    transaction: Omit<Transaction, "id" | "createdAt">,
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...transactions, newTransaction];
    setTransactions(updated);
    saveTransactions(updated);
    setPositions(calculatePositions(updated));
  };

  const handleUpdatePrices = () => {
    const updatedPositions = positions.map((pos) => {
      const randomVariation = (Math.random() - 0.5) * 0.1;
      const newPrice = pos.currentPrice * (1 + randomVariation);
      const newTotalValue = newPrice * pos.quantity;
      const profitLoss = newTotalValue - pos.averagePrice * pos.quantity;
      const profitLossPercentage =
        ((newPrice - pos.averagePrice) / pos.averagePrice) * 100;

      return {
        ...pos,
        currentPrice: newPrice,
        totalValue: newTotalValue,
        profitLoss,
        profitLossPercentage,
      };
    });

    setPositions(updatedPositions);
  };

  const totalPatrimony = positions.reduce(
    (sum, pos) => sum + pos.totalValue,
    0,
  );

  const allocationByClass: AllocationByClass[] = positions.reduce(
    (acc, pos) => {
      const existing = acc.find((item) => item.class === pos.assetClass);
      if (existing) {
        existing.value += pos.totalValue;
      } else {
        acc.push({
          class: pos.assetClass,
          value: pos.totalValue,
          percentage: 0,
        });
      }
      return acc;
    },
    [] as AllocationByClass[],
  );

  allocationByClass.forEach((item) => {
    item.percentage =
      totalPatrimony > 0 ? (item.value / totalPatrimony) * 100 : 0;
  });

  const allocationByTicker: AllocationByTicker[] = positions.map((pos) => ({
    ticker: pos.ticker,
    value: pos.totalValue,
    percentage:
      totalPatrimony > 0 ? (pos.totalValue / totalPatrimony) * 100 : 0,
  }));

  const patrimonyEvolution: PatrimonyEvolution[] = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, transaction, index) => {
      const previousValue = acc.length > 0 ? acc[acc.length - 1].value : 0;
      const change =
        transaction.operation === "buy"
          ? transaction.quantity * transaction.price
          : -(transaction.quantity * transaction.price);

      const existingDate = acc.find((item) => item.date === transaction.date);
      if (existingDate) {
        existingDate.value += change;
      } else {
        acc.push({
          date: transaction.date,
          value: previousValue + change,
        });
      }

      return acc;
    }, [] as PatrimonyEvolution[]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="positions">Posições</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="positions">
            <Positions />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard
              allocationByClass={allocationByClass}
              allocationByTicker={allocationByTicker}
              patrimonyEvolution={patrimonyEvolution}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
