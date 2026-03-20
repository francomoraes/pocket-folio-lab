import { ConfirmDeleteDialog } from "@/shared/components/ConfirmDeleteDialog";
import { AssetTypesDialog } from "@/features/settings/components/AssetTypesDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useAssetTypes } from "@/features/settings/hooks/useAssetTypes";
import { AssetType } from "@/shared/types/assetType";
import { Filter, Pencil, Trash2, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  getPercentageBgColor,
  getPercentageColor,
} from "@/shared/utils/formatters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { SortableTableHead } from "@/shared/components/ui/sortable-table-head";

type SortBy = "name" | "targetPercentage" | "class";
type SortOrder = "ASC" | "DESC";

export const AssetTypesTable = () => {
  const { assetTypes, isLoading, deleteAssetType, isDeleting } =
    useAssetTypes();
  const [editingClass, setEditingClass] = useState<AssetType | null>(null);
  const [deletingClass, setDeletingClass] = useState<AssetType | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [order, setOrder] = useState<SortOrder>("ASC");
  const { t } = useTranslation();

  const uniqueClasses = useMemo(() => {
    if (!assetTypes || assetTypes.length === 0) return [];
    const classes = assetTypes.map((at) => at.assetClass);
    const uniqueMap = new Map(classes.map((c) => [c.id, c]));
    return Array.from(uniqueMap.values());
  }, [assetTypes]);

  const filteredAssetTypes = useMemo(() => {
    return assetTypes.filter((assetType) => {
      const matchesName = assetType.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesClass =
        classFilter === "all" ||
        assetType.assetClass.id.toString() === classFilter;
      return matchesName && matchesClass;
    });
  }, [assetTypes, nameFilter, classFilter]);

  const totalPercentage = useMemo(() => {
    return filteredAssetTypes.reduce(
      (sum, assetType) => sum + (Number(assetType.targetPercentage) || 0),
      0,
    );
  }, [filteredAssetTypes]);

  const sortedAssetTypes = useMemo(() => {
    const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
    const factor = order === "ASC" ? 1 : -1;

    return [...filteredAssetTypes].sort((a, b) => {
      if (sortBy === "name") {
        return collator.compare(a.name, b.name) * factor;
      }

      if (sortBy === "class") {
        return collator.compare(a.assetClass.name, b.assetClass.name) * factor;
      }

      return (a.targetPercentage - b.targetPercentage) * factor;
    });
  }, [filteredAssetTypes, order, sortBy]);

  const toggleSort = (column: string) => {
    const nextColumn = column as SortBy;
    if (sortBy === nextColumn) {
      setOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
      return;
    }

    setSortBy(nextColumn);
    setOrder("ASC");
  };

  const hasActiveFilters = nameFilter !== "" || classFilter !== "all";

  const clearFilters = () => {
    setNameFilter("");
    setClassFilter("all");
  };

  if (isLoading) return <div>{t("common.status.loading")}</div>;

  if (assetTypes.length === 0) {
    return (
      <div>
        <p>{t("common.status.noData")}</p>
        <AssetTypesDialog mode="create" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-216px)] p-3">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:hidden">
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant={hasActiveFilters ? "default" : "outline"}
                  size="icon"
                  title={t("settings.assetTypes.filters.open")}
                >
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">
                    {t("settings.assetTypes.filters.open")}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] sm:w-[420px]">
                <SheetHeader>
                  <SheetTitle>
                    {t("settings.assetTypes.filters.title")}
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      {t("settings.assetTypes.filters.name")}
                    </label>
                    <Input
                      placeholder={t(
                        "settings.assetTypes.filters.namePlaceholder",
                      )}
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      {t("settings.assetTypes.filters.class")}
                    </label>
                    <Select value={classFilter} onValueChange={setClassFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t("settings.assetTypes.filters.allClasses")}
                        </SelectItem>
                        {uniqueClasses.map((assetClass) => (
                          <SelectItem
                            key={assetClass.id}
                            value={assetClass.id.toString()}
                          >
                            {assetClass.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      {t("settings.assetTypes.filters.clear")}
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                title={t("settings.assetTypes.filters.clear")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <AssetTypesDialog mode="create" />
          </div>

          <div className="hidden sm:flex items-end gap-3">
            <div className="w-64">
              <label className="text-sm font-medium mb-1.5 block">
                {t("settings.assetTypes.filters.name")}
              </label>
              <Input
                placeholder={t("settings.assetTypes.filters.namePlaceholder")}
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
            <div className="w-56">
              <label className="text-sm font-medium mb-1.5 block">
                {t("settings.assetTypes.filters.class")}
              </label>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("settings.assetTypes.filters.allClasses")}
                  </SelectItem>
                  {uniqueClasses.map((assetClass) => (
                    <SelectItem
                      key={assetClass.id}
                      value={assetClass.id.toString()}
                    >
                      {assetClass.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                title={t("settings.assetTypes.filters.clear")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <AssetTypesDialog mode="create" />
          </div>
        </div>

        <Card
          className={`p-3 sm:p-4 border-2 flex justify-between sm:flex-col flex-row items-center gap-2 w-full sm:w-auto ${getPercentageBgColor(totalPercentage)}`}
        >
          <div className="text-xs sm:text-sm font-medium whitespace-nowrap">
            {t("settings.assetTypes.summary.totalAllocated")}
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
                label={t("settings.assetTypes.table.name")}
                sortKey="name"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <SortableTableHead
                label={t("settings.assetTypes.table.targetPercentage")}
                sortKey="targetPercentage"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <SortableTableHead
                label={t("settings.assetTypes.table.class")}
                sortKey="class"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={toggleSort}
              />
              <TableHead className="text-right">
                {t("settings.assetTypes.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAssetTypes.map((assetType) => (
              <TableRow key={assetType.id}>
                <TableCell>{assetType.name}</TableCell>
                <TableCell>{assetType.targetPercentage * 100 + "%"}</TableCell>
                <TableCell>{assetType.assetClass.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingClass(assetType)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingClass(assetType)}
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
        <AssetTypesDialog
          mode="edit"
          assetType={editingClass}
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
            await deleteAssetType(deletingClass.id);
            setDeletingClass(null);
          }
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};
