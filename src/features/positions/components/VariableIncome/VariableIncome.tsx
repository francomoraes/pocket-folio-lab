import { useTranslation } from "react-i18next";
import { RefreshCw, Pencil, Trash, AlertCircle } from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  AssetFormDialog,
  CsvUploadDialog,
} from "@/features/positions/components";
import { usePositions } from "@/features/positions/hooks/usePositions";
import CircularProgress from "@/shared/components/ui/circular-progress";
import {
  formatCentsToCurrency,
  formatPercentage,
} from "@/shared/utils/formatters";
import { usePagination } from "@/shared/hooks/usePagination";
import { useEffect, useState } from "react";
import { PaginationControls } from "@/shared/components/ui/pagination-control";
import { Asset } from "@/shared/types/asset";
import { ConfirmDeleteDialog } from "@/shared/components/ConfirmDeleteDialog";
import { SortableTableHead } from "@/shared/components/ui/sortable-table-head";

const VariableIncome = () => {
  const { t } = useTranslation();
  const pagination = usePagination();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(
    undefined,
  );
  const [assetToDelete, setAssetToDelete] = useState<Asset | undefined>(
    undefined,
  );

  const { page, itemsPerPage, sortBy, order, setMeta, toggleSort } = pagination;

  const {
    assets,
    isLoading,
    refreshMarketPrices,
    isRefreshingMarketPrices,
    deleteAsset,
    isDeleting,
  } = usePositions({
    page,
    itemsPerPage,
    sortBy,
    order,
  });

  useEffect(() => {
    if (assets && assets.meta) {
      setMeta(assets.meta);
    }
  }, [assets, setMeta]);

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAsset(undefined);
  };

  const handleCreateAsset = () => {
    setEditingAsset(undefined);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularProgress size="xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 justify-start mb-2">
        <CsvUploadDialog />
        <Button
          onClick={() => refreshMarketPrices()}
          variant="secondary"
          className="w-full sm:w-min gap-2"
          disabled={isRefreshingMarketPrices}
        >
          <RefreshCw className="h-4 w-4" />
          {t("positions.actions.refreshPrices")}
        </Button>
        <Button className="w-full sm:w-min" onClick={handleCreateAsset}>
          {t("positions.actions.addAsset")}
        </Button>
      </div>

      <AssetFormDialog
        asset={editingAsset}
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
      />

      <ConfirmDeleteDialog
        open={!!assetToDelete}
        onOpenChange={(open) => {
          if (!open) setAssetToDelete(undefined);
        }}
        onConfirm={async () => {
          if (assetToDelete) {
            await deleteAsset(assetToDelete.id);
            setAssetToDelete(undefined);
          }
        }}
        isLoading={isDeleting}
      />

      <Card className="flex-1 flex flex-col min-h-0 h-full">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <SortableTableHead
                label={t("positions.table.headers.ticker")}
                sortKey="ticker"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <SortableTableHead
                label={t("positions.table.headers.type")}
                sortKey="type"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <SortableTableHead
                label={t("positions.table.headers.quantity")}
                sortKey="quantity"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <SortableTableHead
                label={t("positions.table.headers.averagePrice")}
                sortKey="averagePriceCents"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <SortableTableHead
                label={t("positions.table.headers.currentPrice")}
                sortKey="currentPriceCents"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <SortableTableHead
                label={t("positions.table.headers.total")}
                sortKey="currentValueCents"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <SortableTableHead
                label={t("positions.table.headers.profitLoss")}
                sortKey="resultCents"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <SortableTableHead
                label={t("positions.table.headers.institution")}
                sortKey="institution"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <SortableTableHead
                label={t("positions.table.headers.portfolioPercentage")}
                sortKey="portfolioPercentage"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <TableHead className="w-[80px]">
                {t("positions.table.headers.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!assets || assets?.data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-muted-foreground py-8"
                >
                  {t("positions.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              assets?.data?.map((asset) => (
                <TableRow
                  key={asset.ticker}
                  className={asset.priceUnavailable ? "bg-amber-500/10" : ""}
                >
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
                    {asset.priceUnavailable ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center gap-1 text-amber-500 cursor-help">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {t("positions.table.priceUnavailable")}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {t("positions.table.priceUnavailableTooltip", {
                            date: new Date(asset.updatedAt).toLocaleDateString(),
                          })}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      formatCentsToCurrency(
                        asset.currentPriceCents,
                        asset.currency,
                      )
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
                  <TableCell>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditAsset(asset)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAssetToDelete(asset);
                        }}
                        className="h-8 w-8"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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

export default VariableIncome;
