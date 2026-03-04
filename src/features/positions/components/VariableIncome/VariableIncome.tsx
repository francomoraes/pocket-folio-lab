import { useTranslation } from "react-i18next";
import { RefreshCw, Pencil, Trash } from "lucide-react";
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

  const { page, itemsPerPage, sortBy, order, setMeta } = pagination;

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
  }, [assets]);

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
      <div className="flex gap-2 justify-start mb-2">
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
        <Button onClick={handleCreateAsset}>
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
              <TableHead className="w-[80px]">Ações</TableHead>
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
