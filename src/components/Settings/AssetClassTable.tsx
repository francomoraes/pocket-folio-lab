import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { AssetClassDialog } from "@/components/Settings/AssetClassDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAssetClasses } from "@/hooks/useAssetClasses";
import { AssetClass } from "@/types/assetClass";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export const AssetClassTable = () => {
  const { assetClasses, isLoading, deleteAssetClass } = useAssetClasses();
  const [editingClass, setEditingClass] = useState<AssetClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<AssetClass | null>(null);

  if (isLoading) return <div>Carregando...</div>;

  if (assetClasses.length === 0) {
    return (
      <div>
        <p>Nenhuma classe de ativo encontrada.</p>
        <AssetClassDialog mode="create" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end">
        <AssetClassDialog mode="create" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Ações</TableHead>
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

      {editingClass && (
        <AssetClassDialog
          mode="edit"
          assetClass={editingClass}
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
              deleteAssetClass(deletingClass.id);
              setDeletingClass(null);
            }
          }}
        />
      )}
    </div>
  );
};
