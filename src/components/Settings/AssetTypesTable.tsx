import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { AssetTypesDialog } from "@/components/Settings/AssetTypesDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAssetTypes } from "@/hooks/useAssetTypes";
import { AssetType } from "@/types/assetType";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export const AssetTypesTable = () => {
  const { assetTypes, isLoading, deleteAssetType } = useAssetTypes();
  const [editingClass, setEditingClass] = useState<AssetType | null>(null);
  const [deletingClass, setDeletingClass] = useState<AssetType | null>(null);

  if (isLoading) return <div>Carregando...</div>;

  if (assetTypes.length === 0) {
    return (
      <div>
        <p>Nenhuma classe de ativo encontrada.</p>
        <AssetTypesDialog mode="create" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end">
        <AssetTypesDialog mode="create" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Percentual Meta (%)</TableHead>
            <TableHead>Classe</TableHead>
            <TableHead className="text-right">Ações</TableHead>
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
