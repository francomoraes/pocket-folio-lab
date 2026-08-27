import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import { ManagerContextBanner } from "@/features/manager/components/ManagerContextBanner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Card } from "@/shared/components/ui/card";
import { AssetTransactionHistory } from "@/features/positions/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import CircularProgress from "@/shared/components/ui/circular-progress";
import { PaginationControls } from "@/shared/components/ui/pagination-control";
import { ConfirmDeleteDialog } from "@/shared/components/ConfirmDeleteDialog";
import { FixedIncomeFormDialog } from "@/features/positions/components/FixedIncomeFormDialog/FixedIncomeFormDialog";
import VariableIncome from "@/features/positions/components/VariableIncome/VariableIncome";
import { useFixedIncomePositions } from "@/features/positions/hooks/useFixedIncomePositions";
import { usePagination } from "@/shared/hooks/usePagination";
import { formatCentsToCurrency } from "@/shared/utils/formatters";
import { FixedIncomeAsset } from "@/shared/types/fixedIncomeAsset";

const ClientFixedIncome = ({ investorId }: { investorId: number }) => {
  const { t } = useTranslation();
  const pagination = usePagination({ initialSortBy: "description" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<FixedIncomeAsset | undefined>(undefined);
  const [assetToDelete, setAssetToDelete] = useState<FixedIncomeAsset | undefined>(undefined);

  const { page, itemsPerPage, sortBy, order, setMeta } = pagination;

  const {
    fixedIncomeAssets,
    isLoading,
    deleteFixedIncomeAsset,
    isDeletingFixedIncomeAsset,
  } = useFixedIncomePositions({ page, itemsPerPage, sortBy, order }, investorId);

  useEffect(() => {
    if (fixedIncomeAssets && fixedIncomeAssets.meta) {
      setMeta(fixedIncomeAssets.meta);
    }
  }, [fixedIncomeAssets, setMeta]);

  const handleEditAsset = (asset: FixedIncomeAsset) => {
    setEditingAsset(asset);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAsset(undefined);
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
      <div className="flex gap-2 justify-start mb-2 shrink-0">
        <Button
          onClick={() => {
            setEditingAsset(undefined);
            setDialogOpen(true);
          }}
        >
          {t("positions.actions.addAsset")}
        </Button>
      </div>

      <FixedIncomeFormDialog
        asset={editingAsset}
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        investorId={investorId}
      />

      <ConfirmDeleteDialog
        open={!!assetToDelete}
        onOpenChange={(open) => {
          if (!open) setAssetToDelete(undefined);
        }}
        onConfirm={async () => {
          if (assetToDelete) {
            await deleteFixedIncomeAsset(assetToDelete.id);
            setAssetToDelete(undefined);
          }
        }}
        isLoading={isDeletingFixedIncomeAsset}
      />

      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="overflow-auto flex-1 min-h-0">
          <Table wrapperClassName="overflow-visible">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>{t("positions.table.headers.description")}</TableHead>
                <TableHead>{t("positions.table.headers.type")}</TableHead>
                <TableHead>{t("positions.table.headers.invested")}</TableHead>
                <TableHead>{t("positions.table.headers.currentValue")}</TableHead>
                <TableHead>{t("positions.table.headers.institution")}</TableHead>
                <TableHead className="w-[80px]">
                  {t("positions.table.headers.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!fixedIncomeAssets || fixedIncomeAssets?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {t("positions.table.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                fixedIncomeAssets?.data?.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.description}</TableCell>
                    <TableCell>{asset.type.assetClass.name}</TableCell>
                    <TableCell>
                      {formatCentsToCurrency(asset.investedValueCents, asset.currency)}
                    </TableCell>
                    <TableCell>
                      {formatCentsToCurrency(asset.currentValueCents, asset.currency)}
                    </TableCell>
                    <TableCell>{asset.institution ? asset.institution.name : "-"}</TableCell>
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
                          onClick={() => setAssetToDelete(asset)}
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
        </div>
        <PaginationControls pagination={pagination} />
      </Card>
    </div>
  );
};

export const ClientPositionsPage = () => {
  const { investorId } = useParams<{ investorId: string }>();
  const id = Number(investorId);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "positions";

  const handleTabChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", value);
    if (value !== "transactions") {
      next.delete("assetId");
    }
    setSearchParams(next);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-61px)]">
      <ManagerContextBanner investorId={id} />

      <div className="flex flex-col gap-3 flex-1 min-h-0 p-3 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full flex flex-col flex-1 min-h-0"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between items-start sm:items-center mb-4 shrink-0">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger className="flex-1 sm:flex-none" value="positions">
                {t("positions.tabs.variableIncome")}
              </TabsTrigger>
              <TabsTrigger className="flex-1 sm:flex-none" value="allocation">
                {t("positions.tabs.fixedIncome")}
              </TabsTrigger>
              <TabsTrigger className="flex-1 sm:flex-none" value="transactions">
                {t("positions.tabs.transactions")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="positions" className="w-full flex flex-col flex-1 min-h-0 mt-0">
            <VariableIncome investorId={id} />
          </TabsContent>
          <TabsContent value="allocation" className="w-full flex flex-col flex-1 min-h-0 mt-0">
            <ClientFixedIncome investorId={id} />
          </TabsContent>
          <TabsContent value="transactions" className="w-full flex flex-col flex-1 min-h-0 mt-0">
            <AssetTransactionHistory investorId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
