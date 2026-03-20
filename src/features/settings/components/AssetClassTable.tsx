import { ConfirmDeleteDialog } from "@/shared/components/ConfirmDeleteDialog";
import { AssetClassDialog } from "@/features/settings/components/AssetClassDialog";
import { Button } from "@/shared/components/ui/button";
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
import { useAssetClasses } from "@/features/settings/hooks/useAssetClasses";
import { AssetClass } from "@/shared/types/assetClass";
import {
  Pencil,
  Trash2,
  Info,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";
import { useAssetTypes } from "@/features/settings/hooks/useAssetTypes";
import {
  getPercentageBgColor,
  getPercentageColor,
} from "@/shared/utils/formatters";
import { SortableTableHead } from "@/shared/components/ui/sortable-table-head";

type SortBy = "name" | "classPercentage";
type SortOrder = "ASC" | "DESC";

export const AssetClassTable = () => {
  const { assetClasses, isLoading, deleteAssetClass, isDeleting } =
    useAssetClasses();
  const { assetTypes } = useAssetTypes();
  const [editingClass, setEditingClass] = useState<AssetClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<AssetClass | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [order, setOrder] = useState<SortOrder>("ASC");
  const { t } = useTranslation();

  const classPercentages = useMemo(() => {
    const classMap = new Map<number, number>();
    assetTypes.forEach((assetType) => {
      const classId = assetType.assetClass.id;
      const current = classMap.get(classId) || 0;
      classMap.set(classId, current + Number(assetType.targetPercentage || 0));
    });
    return classMap;
  }, [assetTypes]);

  const totalPercentage = useMemo(() => {
    return assetTypes.reduce(
      (sum, assetType) => sum + (Number(assetType.targetPercentage) || 0),
      0,
    );
  }, [assetTypes]);

  const toggleSort = (column: string) => {
    const nextColumn = column as SortBy;
    if (sortBy === nextColumn) {
      setOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
      return;
    }

    setSortBy(nextColumn);
    setOrder("ASC");
  };

  const sortedAssetClasses = useMemo(() => {
    const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
    const factor = order === "ASC" ? 1 : -1;

    return [...assetClasses].sort((a, b) => {
      if (sortBy === "name") {
        return collator.compare(a.name, b.name) * factor;
      }

      const aPercentage = classPercentages.get(a.id) || 0;
      const bPercentage = classPercentages.get(b.id) || 0;
      return (aPercentage - bPercentage) * factor;
    });
  }, [assetClasses, classPercentages, order, sortBy]);

  if (isLoading) return <div>{t("common.status.loading")}</div>;

  if (assetClasses.length === 0) {
    return (
      <div>
        <p>{t("common.status.noData")}</p>
        <AssetClassDialog mode="create" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-216px)] p-3">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <AssetClassDialog mode="create" />
        <Card
          className={`p-3 sm:p-4 border-2 flex justify-between sm:flex-col flex-row items-center gap-2 w-full sm:w-auto ${getPercentageBgColor(totalPercentage)}`}
        >
          <div className="text-xs sm:text-sm font-medium whitespace-nowrap">
            {t("settings.assetClasses.summary.totalAllocated")}
          </div>
          <div
            className={`text-xl sm:text-2xl font-bold ${getPercentageColor(totalPercentage)}`}
          >
            {(totalPercentage * 100).toFixed(1)}%
          </div>
        </Card>
      </div>
      <Card className="flex-1 flex flex-col min-h-0">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <SortableTableHead
                label={t("settings.assetClasses.table.name")}
                sortKey="name"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <TableHead>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto p-0 font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
                    onClick={() => toggleSort("classPercentage")}
                  >
                    <span>
                      {t("settings.assetClasses.table.classPercentage")}
                    </span>
                    {sortBy === "classPercentage" ? (
                      order === "ASC" ? (
                        <ArrowUp className="ml-1 h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ArrowDown
                          className="ml-1 h-4 w-4"
                          aria-hidden="true"
                        />
                      )
                    ) : (
                      <ArrowUpDown
                        className="ml-1 h-4 w-4 opacity-50"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("settings.assetClasses.table.classPercentageTooltip")}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead className="text-right">
                {t("settings.assetClasses.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAssetClasses.map((assetClass) => (
              <TableRow key={assetClass.id}>
                <TableCell>{assetClass.name}</TableCell>
                <TableCell>
                  {((classPercentages.get(assetClass.id) || 0) * 100).toFixed(
                    1,
                  )}
                  %
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingClass(assetClass)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingClass(assetClass)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {editingClass && (
        <AssetClassDialog
          mode="edit"
          assetClass={editingClass}
          onClose={() => setEditingClass(null)}
        />
      )}

      <ConfirmDeleteDialog
        open={!!deletingClass}
        onOpenChange={(open) => {
          if (!open) setDeletingClass(null);
        }}
        onConfirm={async () => {
          if (deletingClass) {
            await deleteAssetClass(deletingClass.id);
            setDeletingClass(null);
          }
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};
