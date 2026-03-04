import { useTranslation } from "react-i18next";
import { Pencil, Trash } from "lucide-react";
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
import { FixedIncomeFormDialog } from "@/features/positions/components";
import CircularProgress from "@/shared/components/ui/circular-progress";
import {
  formatCentsToCurrency,
  formatPercentage,
} from "@/shared/utils/formatters";
import { usePagination } from "@/shared/hooks/usePagination";
import { useEffect, useState } from "react";
import { PaginationControls } from "@/shared/components/ui/pagination-control";
import { useFixedIncomePositions } from "@/features/positions/hooks/useFixedIncomePositions";
import {
  FixedIncomeAsset,
  IndexationMode,
} from "@/shared/types/fixedIncomeAsset";
import { ConfirmDeleteDialog } from "@/shared/components/ConfirmDeleteDialog";

const getIndexationLabel = (mode: IndexationMode, rate: number) => {
  switch (mode) {
    case IndexationMode.PRE:
      return `${rate}% a.a.`;
    case IndexationMode.CDI:
      return `CDI + ${rate}%`;
    case IndexationMode.IPCA:
      return `IPCA + ${rate}%`;
    case IndexationMode.SELIC:
      return `Selic + ${rate}%`;
    default:
      return `${rate}%`;
  }
};

const formatDateOnly = (value: string | Date) => {
  const raw = typeof value === "string" ? value : value.toISOString();
  const dateOnly = raw.split("T")[0];
  const [year, month, day] = dateOnly.split("-");
  return `${day}/${month}/${year}`;
};

const FixedIncome = () => {
  const { t } = useTranslation();
  const pagination = usePagination();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<
    FixedIncomeAsset | undefined
  >(undefined);
  const [assetToDelete, setAssetToDelete] = useState<
    FixedIncomeAsset | undefined
  >(undefined);

  const { page, itemsPerPage, sortBy, order, setMeta } = pagination;

  const {
    fixedIncomeAssets,
    isLoading,
    deleteFixedIncomeAsset,
    isDeletingFixedIncomeAsset,
  } = useFixedIncomePositions({
    page,
    itemsPerPage,
    sortBy: "description",
    order,
  });

  useEffect(() => {
    if (fixedIncomeAssets && fixedIncomeAssets.meta) {
      setMeta(fixedIncomeAssets.meta);
    }
  }, [fixedIncomeAssets]);

  const handleEditAsset = (asset: FixedIncomeAsset) => {
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
        <Button onClick={handleCreateAsset}>
          {t("positions.actions.addAsset")}
        </Button>
      </div>

      <FixedIncomeFormDialog
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
            await deleteFixedIncomeAsset(assetToDelete.id);
            setAssetToDelete(undefined);
          }
        }}
        isLoading={isDeletingFixedIncomeAsset}
      />

      <Card className="flex-1 flex flex-col min-h-0 h-full">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>{t("positions.table.headers.description")}</TableHead>
              <TableHead>{t("positions.table.headers.type")}</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Indexação</TableHead>
              <TableHead>Investido</TableHead>
              <TableHead>Valor Atual</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead>Retorno</TableHead>
              <TableHead>{t("positions.table.headers.institution")}</TableHead>
              <TableHead>
                {t("positions.table.headers.portfolioPercentage")}
              </TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!fixedIncomeAssets || fixedIncomeAssets?.data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  {t("positions.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              fixedIncomeAssets?.data?.map((fixedIncomeAsset) => (
                <TableRow key={fixedIncomeAsset.description}>
                  <TableCell className="font-medium">
                    {fixedIncomeAsset.description}
                  </TableCell>
                  <TableCell>{fixedIncomeAsset.type.assetClass.name}</TableCell>
                  <TableCell>
                    {formatDateOnly(fixedIncomeAsset.startDate)}
                  </TableCell>
                  <TableCell>
                    {formatDateOnly(fixedIncomeAsset.maturityDate)}
                  </TableCell>
                  <TableCell>
                    {getIndexationLabel(
                      fixedIncomeAsset.indexationMode || IndexationMode.PRE,
                      fixedIncomeAsset.interestRate,
                    )}
                  </TableCell>
                  <TableCell>
                    {formatCentsToCurrency(
                      fixedIncomeAsset.investedValueCents,
                      fixedIncomeAsset.currency,
                    )}
                  </TableCell>
                  <TableCell>
                    {formatCentsToCurrency(
                      fixedIncomeAsset.currentValueCents,
                      fixedIncomeAsset.currency,
                    )}
                  </TableCell>
                  <TableCell>
                    {formatCentsToCurrency(
                      fixedIncomeAsset.resultCents,
                      fixedIncomeAsset.currency,
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        +fixedIncomeAsset.returnPercentage >= 0
                          ? "text-success"
                          : "text-destructive"
                      }
                    >
                      {formatPercentage(
                        Number(fixedIncomeAsset.returnPercentage),
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[110px] truncate">
                    {fixedIncomeAsset.institution
                      ? fixedIncomeAsset.institution.name
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {formatPercentage(
                      Number(fixedIncomeAsset.portfolioPercentage),
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditAsset(fixedIncomeAsset)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAssetToDelete(fixedIncomeAsset);
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

export default FixedIncome;
