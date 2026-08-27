import { useTranslation } from "react-i18next";
import { Pencil, Trash } from "lucide-react";
import { useSearchParams } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { SortableTableHead } from "@/shared/components/ui/sortable-table-head";
import { AssetTransactionDialog } from "@/features/positions/components/AssetTransactionDialog/AssetTransactionDialog";
import { useAssetTransactions } from "@/features/positions/hooks/useAssetTransactions";
import { usePositions } from "@/features/positions/hooks/usePositions";
import CircularProgress from "@/shared/components/ui/circular-progress";
import {
  formatCentsToCurrency,
  formatQuantity,
} from "@/shared/utils/formatters";
import { usePagination } from "@/shared/hooks/usePagination";
import { useEffect, useMemo, useState } from "react";
import { PaginationControls } from "@/shared/components/ui/pagination-control";
import { ConfirmDeleteDialog } from "@/shared/components/ConfirmDeleteDialog";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  AssetTransaction,
  AssetTransactionType,
} from "@/shared/types/assetTransaction";

const ALL = "all";

export const AssetTransactionHistory = ({
  investorId,
}: {
  investorId?: number;
} = {}) => {
  const { t } = useTranslation();
  const { canOperateOwnPortfolio } = useAuth();
  const canOperate = !!investorId || canOperateOwnPortfolio;
  const [searchParams, setSearchParams] = useSearchParams();
  const pagination = usePagination({ initialSortBy: "date", initialOrder: "DESC" });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<AssetTransaction | undefined>(
    undefined,
  );
  const [transactionToDelete, setTransactionToDelete] = useState<AssetTransaction | undefined>(
    undefined,
  );

  const assetIdParam = searchParams.get("assetId");
  const assetId = assetIdParam ? Number(assetIdParam) : undefined;
  const [type, setType] = useState<AssetTransactionType | typeof ALL>(ALL);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { page, itemsPerPage, sortBy, order, setMeta, toggleSort } = pagination;

  const { assets } = usePositions({ skipPagination: true }, investorId);
  const assetsById = useMemo(() => {
    const map = new Map<number, { ticker: string; currency: string }>();
    assets?.data?.forEach((asset) =>
      map.set(asset.id, { ticker: asset.ticker, currency: asset.currency }),
    );
    return map;
  }, [assets]);

  const {
    transactions,
    isLoading,
    deleteTransaction,
    isDeleting,
  } = useAssetTransactions(
    {
      page,
      itemsPerPage,
      sortBy,
      order,
      assetId,
      type: type === ALL ? undefined : type,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    },
    investorId,
  );

  useEffect(() => {
    if (transactions && transactions.meta) {
      setMeta(transactions.meta);
    }
  }, [transactions, setMeta]);

  const setAssetFilter = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === ALL) {
      next.delete("assetId");
    } else {
      next.set("assetId", value);
    }
    setSearchParams(next, { replace: true });
  };

  const hasActiveFilters = !!assetId || type !== ALL || !!dateFrom || !!dateTo;

  const clearAllFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("assetId");
    setSearchParams(next, { replace: true });
    setType(ALL);
    setDateFrom("");
    setDateTo("");
  };

  const handleCreateTransaction = () => {
    setEditingTransaction(undefined);
    setDialogOpen(true);
  };

  const handleEditTransaction = (transaction: AssetTransaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-end mb-2 shrink-0">
        <div className="space-y-1">
          <Label className="text-xs">{t("transaction.history.filters.asset")}</Label>
          <Select value={assetId ? String(assetId) : ALL} onValueChange={setAssetFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("transaction.history.filters.allAssets")}</SelectItem>
              {Array.from(assetsById.entries()).map(([id, asset]) => (
                <SelectItem key={id} value={String(id)}>
                  {asset.ticker}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t("transaction.history.filters.type")}</Label>
          <Select value={type} onValueChange={(v) => setType(v as AssetTransactionType | typeof ALL)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("transaction.history.filters.allTypes")}</SelectItem>
              <SelectItem value="buy">{t("transaction.operations.buy")}</SelectItem>
              <SelectItem value="sell">{t("transaction.operations.sell")}</SelectItem>
              <SelectItem value="dividend">{t("transaction.operations.dividend")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t("transaction.history.filters.dateFrom")}</Label>
          <Input
            type="date"
            className="w-[150px]"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t("transaction.history.filters.dateTo")}</Label>
          <Input
            type="date"
            className="w-[150px]"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            {t("transaction.history.filters.clearAll")}
          </Button>
        )}

        {canOperate && (
          <Button className="ml-auto" onClick={handleCreateTransaction}>
            {t("transaction.history.addOperation")}
          </Button>
        )}
      </div>

      <AssetTransactionDialog
        transaction={editingTransaction}
        assetId={editingTransaction ? undefined : assetId}
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        investorId={investorId}
      />

      <ConfirmDeleteDialog
        open={!!transactionToDelete}
        onOpenChange={(open) => {
          if (!open) setTransactionToDelete(undefined);
        }}
        onConfirm={async () => {
          if (transactionToDelete) {
            await deleteTransaction(transactionToDelete.id);
            setTransactionToDelete(undefined);
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
                  label={t("transaction.history.columns.date")}
                  sortKey="date"
                  currentSortBy={sortBy}
                  currentOrder={order}
                  onSort={toggleSort}
                />
                {!assetId && <TableHead>{t("transaction.history.columns.asset")}</TableHead>}
                <SortableTableHead
                  label={t("transaction.history.columns.type")}
                  sortKey="type"
                  currentSortBy={sortBy}
                  currentOrder={order}
                  onSort={toggleSort}
                />
                <SortableTableHead
                  label={t("transaction.history.columns.quantity")}
                  sortKey="quantity"
                  currentSortBy={sortBy}
                  currentOrder={order}
                  onSort={toggleSort}
                />
                <SortableTableHead
                  label={t("transaction.history.columns.unitPrice")}
                  sortKey="unitPriceCents"
                  currentSortBy={sortBy}
                  currentOrder={order}
                  onSort={toggleSort}
                />
                <SortableTableHead
                  label={t("transaction.history.columns.fees")}
                  sortKey="feesCents"
                  currentSortBy={sortBy}
                  currentOrder={order}
                  onSort={toggleSort}
                />
                <SortableTableHead
                  label={t("transaction.history.columns.total")}
                  sortKey="totalAmountCents"
                  currentSortBy={sortBy}
                  currentOrder={order}
                  onSort={toggleSort}
                />
                {canOperate && (
                  <TableHead className="w-[80px]">
                    {t("positions.table.headers.actions")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={assetId ? 6 : 7} className="text-center py-8">
                    <CircularProgress size="lg" />
                  </TableCell>
                </TableRow>
              ) : !transactions || transactions.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={assetId ? 6 : 7}
                    className="text-center text-muted-foreground py-8"
                  >
                    {hasActiveFilters
                      ? t("transaction.history.emptyFiltered")
                      : t("transaction.history.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.data.map((transaction) => {
                  const asset = assetsById.get(transaction.assetId);
                  const currency = asset?.currency ?? "BRL";
                  return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                      })}
                    </TableCell>
                    {!assetId && (
                      <TableCell className="font-medium">
                        {asset?.ticker ?? "-"}
                      </TableCell>
                    )}
                    <TableCell>{t(`transaction.operations.${transaction.type}`)}</TableCell>
                    <TableCell>
                      {transaction.quantity !== null
                        ? formatQuantity(transaction.quantity)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {transaction.unitPriceCents !== null
                        ? formatCentsToCurrency(transaction.unitPriceCents, currency)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {transaction.feesCents
                        ? formatCentsToCurrency(transaction.feesCents, currency)
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCentsToCurrency(transaction.totalAmountCents, currency)}
                    </TableCell>
                    {canOperate && (
                      <TableCell>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTransaction(transaction)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTransactionToDelete(transaction)}
                            className="h-8 w-8"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationControls pagination={pagination} />
      </Card>
    </div>
  );
};
