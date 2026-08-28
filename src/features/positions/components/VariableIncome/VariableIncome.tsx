import { useTranslation } from "react-i18next";
import { RefreshCw, Pencil, Trash, AlertCircle, Link2, History } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import { AssetTransactionDialog } from "@/features/positions/components/AssetTransactionDialog/AssetTransactionDialog";
import { usePositions } from "@/features/positions/hooks/usePositions";
import CircularProgress from "@/shared/components/ui/circular-progress";
import {
  formatCentsToCurrency,
  formatPercentage,
  formatQuantity,
} from "@/shared/utils/formatters";
import { usePagination } from "@/shared/hooks/usePagination";
import { useEffect, useState } from "react";
import { PaginationControls } from "@/shared/components/ui/pagination-control";
import { Asset } from "@/shared/types/asset";
import { ConfirmDeleteDialog } from "@/shared/components/ConfirmDeleteDialog";
import { SortableTableHead } from "@/shared/components/ui/sortable-table-head";
import { useAuth } from "@/shared/hooks/useAuth";

// TODO(franco): reavaliar se "Adicionar Ativo" volta a ficar visível junto
// com "Lançar Operação", ou se o fluxo de criar ativo direto sai de vez.
const SHOW_ADD_ASSET_BUTTON = false;

const VariableIncome = ({ investorId }: { investorId?: number } = {}) => {
  const { t } = useTranslation();
  const { canOperateOwnPortfolio } = useAuth();
  const canOperate = !!investorId || canOperateOwnPortfolio;
  const pagination = usePagination();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(
    undefined,
  );
  const [assetToDelete, setAssetToDelete] = useState<Asset | undefined>(
    undefined,
  );
  const [hideZeroQuantity, setHideZeroQuantity] = useState(false);

  const { page, itemsPerPage, sortBy, order, setMeta, toggleSort } = pagination;

  const {
    assets,
    isLoading,
    refreshMarketPrices,
    isRefreshingMarketPrices,
    deleteAsset,
    isDeleting,
  } = usePositions(
    {
      page,
      itemsPerPage,
      sortBy,
      order,
      includeZeroQuantity: !hideZeroQuantity,
    },
    investorId,
  );

  const viewHistory = (assetId: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", "transactions");
    next.set("assetId", String(assetId));
    setSearchParams(next);
  };

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
    <div className="flex flex-col flex-1 min-h-0">
      {!canOperate && (
        <p className="text-sm text-muted-foreground mb-2 shrink-0">
          {t("positions.autonomy.readOnlyNotice")}
        </p>
      )}
      {canOperate && (
        <div className="flex flex-col sm:flex-row gap-2 justify-start mb-2 shrink-0">
          <CsvUploadDialog investorId={investorId} />
          <Button
            onClick={() => refreshMarketPrices()}
            variant="secondary"
            className="w-full sm:w-min gap-2"
            disabled={isRefreshingMarketPrices}
          >
            <RefreshCw className="h-4 w-4" />
            {t("positions.actions.refreshPrices")}
          </Button>
          {SHOW_ADD_ASSET_BUTTON && (
            <Button className="w-full sm:w-min" onClick={handleCreateAsset}>
              {t("positions.actions.addAsset")}
            </Button>
          )}
          <Button
            className="w-full sm:w-min"
            onClick={() => setTransactionDialogOpen(true)}
          >
            {t("transaction.history.addOperation")}
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2 shrink-0">
        <Checkbox
          id="hideZeroQuantity"
          checked={hideZeroQuantity}
          onCheckedChange={(checked) => setHideZeroQuantity(checked === true)}
        />
        <label htmlFor="hideZeroQuantity" className="text-sm text-muted-foreground cursor-pointer">
          {t("positions.actions.hideZeroQuantity")}
        </label>
      </div>

      <AssetFormDialog
        asset={editingAsset}
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        investorId={investorId}
      />

      <AssetTransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        investorId={investorId}
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

      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="overflow-auto flex-1 min-h-0">
          <Table wrapperClassName="overflow-visible">
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
                  label={t("positions.table.headers.dividends")}
                  sortKey="dividendsCentsAccumulated"
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
                <TableHead className="w-[50px]">
                  {t("positions.actions.viewHistory")}
                </TableHead>
                {canOperate && (
                  <TableHead className="w-[80px]">
                    {t("positions.table.headers.actions")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {!assets || assets?.data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={canOperate ? 12 : 11}
                    className="text-center text-muted-foreground py-8"
                  >
                    {t("positions.table.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                assets?.data?.map((asset) => (
                  <TableRow
                    key={asset.id}
                    className={asset.priceUnavailable ? "bg-amber-500/10" : ""}
                  >
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-1.5">
                        {asset.ticker}
                        {asset.source !== "manual" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link2 className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {t("positions.table.syncedTooltip")}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>{asset.type.name}</TableCell>
                    <TableCell>
                      {formatQuantity(Number(asset.quantity))}
                    </TableCell>
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
                              {asset.currentPriceCents !==
                              asset.averagePriceCents
                                ? formatCentsToCurrency(
                                    asset.currentPriceCents,
                                    asset.currency,
                                  )
                                : t("positions.table.priceUnavailable")}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("positions.table.priceUnavailableTooltip", {
                              date: new Date(
                                asset.updatedAt,
                              ).toLocaleDateString(),
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
                      {formatCentsToCurrency(
                        asset.dividendsCentsAccumulated,
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewHistory(asset.id)}
                        className="h-8 w-8"
                        title={t("positions.actions.viewHistory")}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    {canOperate && (
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
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationControls pagination={pagination} />
      </Card>
    </div>
  );
};

export default VariableIncome;
