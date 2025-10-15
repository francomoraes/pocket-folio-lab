import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Position } from "@/types/investment";
import { toast } from "sonner";

interface PositionsProps {
  positions: Position[];
  totalPatrimony: number;
  onUpdatePrices: () => void;
}

const getAssetClassLabel = (assetClass: string) => {
  const labels: Record<string, string> = {
    stocks: "Ação",
    fiis: "FII",
    fixed_income: "Renda Fixa",
  };
  return labels[assetClass] || assetClass;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value: number) => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};

export const Positions = ({ positions, totalPatrimony, onUpdatePrices }: PositionsProps) => {
  const handleUpdatePrices = () => {
    onUpdatePrices();
    toast.success("Cotações atualizadas!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Patrimônio Total</p>
            <p className="text-3xl font-semibold">{formatCurrency(totalPatrimony)}</p>
          </div>
          <Button onClick={handleUpdatePrices} variant="secondary" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar Cotações
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticker</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-right">PM Compra</TableHead>
              <TableHead className="text-right">Cotação</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">L/P</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhuma posição encontrada. Adicione uma transação para começar.
                </TableCell>
              </TableRow>
            ) : (
              positions.map((position) => (
                <TableRow key={position.ticker}>
                  <TableCell className="font-medium">{position.ticker}</TableCell>
                  <TableCell>{getAssetClassLabel(position.assetClass)}</TableCell>
                  <TableCell className="text-right">{position.quantity.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(position.averagePrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(position.currentPrice)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(position.totalValue)}</TableCell>
                  <TableCell className="text-right">
                    <span className={position.profitLossPercentage >= 0 ? "text-success" : "text-destructive"}>
                      {formatPercentage(position.profitLossPercentage)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
