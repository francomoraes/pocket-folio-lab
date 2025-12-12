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
import { CsvUploadDialog } from "@/components/CsvUpload/CsvUploadDialog";
import { usePagination } from "@/hooks/usePagination";
import { useEffect } from "react";
import { useSummary } from "@/hooks/useSummary";
import {
  Pagination,
  PaginationPrevious,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { PaginationControls } from "@/components/ui/pagination-control";

export const Positions = () => {
  const pagination = usePagination();

  const {
    page,
    itemsPerPage,
    sortBy,
    order,

    setMeta,
  } = pagination;

  const { assets, isLoading, refreshMarketPrices, isRefreshingMarketPrices } =
    usePositions({
      page,
      itemsPerPage,
      sortBy,
      order,
    });

  const { summary } = useSummary();

  useEffect(() => {
    if (assets && assets.meta) {
      setMeta(assets.meta);
    }
  }, [assets]);

  const totalPatrimonyCents = summary?.reduce((acc, item) => {
    const currency = item.currency;
    acc[currency] = (acc[currency] || 0) + item.totalValueCents;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularProgress size="xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold">Minhas Posições</h2>
          <p className="text-muted-foreground">
            Gerencie sua carteira de investimentos
          </p>
        </div>
        <div className="flex gap-2">
          <CsvUploadDialog />
          <Button
            onClick={() => refreshMarketPrices()}
            variant="secondary"
            className="gap-2"
            disabled={isRefreshingMarketPrices}
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar Cotações
          </Button>
          <TransactionDialog />
        </div>
      </div>

      <Card className="p-3 flex-shrink-0">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs text-muted-foreground">
              Patromônio (parte em dólares)
            </p>
            <p className="text-xl font-semibold">
              {formatCentsToCurrency(totalPatrimonyCents?.USD || 0, "USD")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Patromônio (parte em reais)
            </p>
            <p className="text-xl font-semibold">
              {formatCentsToCurrency(totalPatrimonyCents?.BRL || 0, "BRL")}
            </p>
          </div>
        </div>
      </Card>

      <Card className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
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
              {!assets || assets?.data?.length === 0 ? (
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
                assets?.data?.map((asset) => (
                  <TableRow key={asset.ticker}>
                    <TableCell className="font-medium">
                      {asset.ticker}
                    </TableCell>
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
        </div>
        {/* simple pagination */}
        <PaginationControls pagination={pagination} />
      </Card>
    </div>
  );
};
