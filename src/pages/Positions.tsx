import { RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  TransactionDialog,
  CsvUploadDialog,
} from "@/features/positions/components";
import { usePositions } from "@/features/positions/hooks/usePositions";
import CircularProgress from "@/shared/components/ui/circular-progress";
import {
  formatCentsToCurrency,
  formatPercentage,
} from "@/shared/utils/formatters";
import { usePagination } from "@/shared/hooks/usePagination";
import { useEffect } from "react";
import { useSummary } from "@/shared/hooks/useSummary";
import { PaginationControls } from "@/shared/components/ui/pagination-control";
import { useTranslation } from "react-i18next";

export const Positions = () => {
  const { t } = useTranslation();
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
    <div className="flex flex-col gap-3 h-[calc(100vh-61px)] p-3">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold">{t("positions.title")}</h2>
          <p className="text-muted-foreground">{t("positions.subtitle")}</p>
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
            {t("positions.actions.refreshPrices")}
          </Button>
          <TransactionDialog />
        </div>
      </div>

      <Card className="p-3 flex-shrink-0">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs text-muted-foreground">
              {t("positions.summary.patrimonyUSD")}
            </p>
            <p className="text-xl font-semibold">
              {formatCentsToCurrency(totalPatrimonyCents?.USD || 0, "USD")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("positions.summary.patrimonyBRL")}
            </p>
            <p className="text-xl font-semibold">
              {formatCentsToCurrency(totalPatrimonyCents?.BRL || 0, "BRL")}
            </p>
          </div>
        </div>
      </Card>

      <Card className="flex-1 flex flex-col min-h-0">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>{t("positions.table.headers.ticker")}</TableHead>
              <TableHead>{t("positions.table.headers.type")}</TableHead>
              <TableHead>{t("positions.table.headers.quantity")}</TableHead>
              <TableHead>{t("positions.table.headers.averagePrice")}</TableHead>
              <TableHead>{t("positions.table.headers.currentPrice")}</TableHead>
              <TableHead>{t("positions.table.headers.total")}</TableHead>
              <TableHead>{t("positions.table.headers.profitLoss")}</TableHead>
              <TableHead>{t("positions.table.headers.institution")}</TableHead>
              <TableHead>
                {t("positions.table.headers.portfolioPercentage")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!assets || assets?.data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  {t("positions.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              assets?.data?.map((asset) => (
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
        {/* simple pagination */}
        <PaginationControls pagination={pagination} />
      </Card>
    </div>
  );
};
