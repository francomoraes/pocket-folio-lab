import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionDialog } from "@/components/TransactionDialog";
import { usePositions } from "@/hooks/usePositions";
import CircularProgress from "@/components/ui/circular-progress";
import { formatCentsToCurrency, formatPercentage } from "@/utils/formatters";

export const Positions = () => {
  const { assets, isLoading, refreshMarketPrices, isRefreshingMarketPrices } =
    usePositions();

  const totalPatrimonyCents = assets?.reduce((sum, asset) => {
    sum[asset.currency] = (sum[asset.currency] ?? 0) + asset.currentValueCents;
    return sum;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularProgress size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TransactionDialog />

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Patromônio (parte em dólares)
            </p>
            <p className="text-3xl font-semibold">
              {formatCentsToCurrency(totalPatrimonyCents?.USD || 0, "USD")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Patromônio (parte em reais)
            </p>
            <p className="text-3xl font-semibold">
              {formatCentsToCurrency(totalPatrimonyCents?.BRL || 0, "BRL")}
            </p>
          </div>
          <Button
            onClick={() => refreshMarketPrices()}
            variant="secondary"
            className="gap-2"
            disabled={isRefreshingMarketPrices}
          >
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
              <TableHead>Quantidade</TableHead>
              <TableHead>PM Compra</TableHead>
              <TableHead>Cotação</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>L/P</TableHead>
              <TableHead>Instituição</TableHead>
              <TableHead>% Carteira</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!assets || assets?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhuma posição encontrada. Adicione uma transação para
                  começar.
                </TableCell>
              </TableRow>
            ) : (
              assets?.map((asset) => (
                <TableRow key={asset.ticker}>
                  <TableCell className="font-medium">{asset.ticker}</TableCell>
                  <TableCell>{asset.type.assetClass.name}</TableCell>
                  <TableCell>{asset.quantity}</TableCell>
                  <TableCell>
                    {formatCentsToCurrency(
                      asset.averagePriceCents,
                      asset.currency,
                    )}
                  </TableCell>
                  <TableCell>
                    {formatCentsToCurrency(
                      asset.currentPriceCents,
                      asset.currency,
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCentsToCurrency(
                      asset.currentValueCents,
                      asset.currency,
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        +asset.returnPercentage >= 0
                          ? "text-success"
                          : "text-destructive"
                      }
                    >
                      {formatPercentage(Number(asset.returnPercentage))}
                    </span>
                  </TableCell>
                  <TableCell>
                    {asset.institution ? asset.institution.name : "-"}
                  </TableCell>
                  <TableCell>
                    {formatPercentage(Number(asset.portfolioPercentage))}
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
