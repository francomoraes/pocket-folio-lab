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
import { Pencil, Trash2, X } from "lucide-react";
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

export const AssetTypesTable = () => {
  const { assetTypes, isLoading, deleteAssetType, isDeleting } =
    useAssetTypes();
  const [editingClass, setEditingClass] = useState<AssetType | null>(null);
  const [deletingClass, setDeletingClass] = useState<AssetType | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
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
    <div className="flex flex-col gap-3 h-[calc(100vh-216px)] p-3 relative">
      <Card
        className={`p-4 border-2 flex items-center gap-2 w-min absolute top-[-80px] right-0 ${getPercentageBgColor(totalPercentage)}`}
      >
        <div className="text-sm font-medium">
          {t("settings.assetTypes.summary.totalAllocated")}
        </div>
        <div
          className={`text-2xl font-bold ${getPercentageColor(totalPercentage)}`}
        >
          {(totalPercentage * 100).toFixed(1)}%
        </div>
      </Card>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">
              {t("settings.assetTypes.filters.name")}
            </label>
            <Input
              placeholder={t("settings.assetTypes.filters.namePlaceholder")}
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className="flex-1">
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
          <div className="flex gap-2">
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
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>{t("settings.assetTypes.table.name")}</TableHead>
              <TableHead>
                {t("settings.assetTypes.table.targetPercentage")}
              </TableHead>
              <TableHead>{t("settings.assetTypes.table.class")}</TableHead>
              <TableHead className="text-right">
                {t("settings.assetTypes.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssetTypes.map((assetType) => (
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
