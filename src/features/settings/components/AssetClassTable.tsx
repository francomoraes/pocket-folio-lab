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
import { useAssetClasses } from "@/features/settings/hooks/useAssetClasses";
import { AssetClass } from "@/shared/types/assetClass";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";

export const AssetClassTable = () => {
  const { assetClasses, isLoading, deleteAssetClass, isDeleting } =
    useAssetClasses();
  const [editingClass, setEditingClass] = useState<AssetClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<AssetClass | null>(null);
  const { t } = useTranslation();

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
      <div className="flex justify-end">
        <AssetClassDialog mode="create" />
      </div>
      <Card className="flex-1 flex flex-col min-h-0">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>{t("settings.assetClasses.table.name")}</TableHead>
              <TableHead className="text-right">
                {t("settings.assetClasses.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetClasses.map((assetClass) => (
              <TableRow key={assetClass.id}>
                <TableCell>{assetClass.name}</TableCell>
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
