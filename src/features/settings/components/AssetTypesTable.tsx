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
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";

export const AssetTypesTable = () => {
  const { assetTypes, isLoading, deleteAssetType } = useAssetTypes();
  const [editingClass, setEditingClass] = useState<AssetType | null>(null);
  const [deletingClass, setDeletingClass] = useState<AssetType | null>(null);
  const { t } = useTranslation();

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
      <div className="flex justify-end">
        <AssetTypesDialog mode="create" />
      </div>
      <Card className="flex-1 flex flex-col min-h-0">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>{t("settings.assetTypes.table.name")}</TableHead>
              <TableHead>Percentual Meta (%)</TableHead>
              <TableHead>{t("settings.assetTypes.table.class")}</TableHead>
              <TableHead className="text-right">
                {t("settings.assetTypes.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetTypes.map((assetType) => (
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

      {deletingClass && (
        <ConfirmDeleteDialog
          open={!!deletingClass}
          onOpenChange={(open) => {
            if (!open) setDeletingClass(null);
          }}
          onConfirm={() => {
            if (deletingClass) {
              deleteAssetType(deletingClass.id);
              setDeletingClass(null);
            }
          }}
        />
      )}
    </div>
  );
};
