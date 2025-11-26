import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { InstitutionDialog } from "@/components/Settings/InstitutionsDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInstitutions } from "@/hooks/useInstitutions";
import { Institution } from "@/types/institution";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export const InstitutionsTable = () => {
  const { institutions, isLoading, deleteInstitution } = useInstitutions();
  const [editingInstitution, setEditingInstitution] =
    useState<Institution | null>(null);
  const [deletingInstitution, setDeletingInstitution] =
    useState<Institution | null>(null);

  if (isLoading) return <div>Carregando...</div>;

  if (institutions.length === 0) {
    return (
      <div>
        <p>Nenhuma instituição encontrada.</p>
        <InstitutionDialog mode="create" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end">
        <InstitutionDialog mode="create" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {institutions.map((institution) => (
            <TableRow key={institution.id}>
              <TableCell>{institution.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingInstitution(institution)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingInstitution(institution)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingInstitution && (
        <InstitutionDialog
          mode="edit"
          institution={editingInstitution}
          onClose={() => setEditingInstitution(null)}
        />
      )}

      {deletingInstitution && (
        <ConfirmDeleteDialog
          open={!!deletingInstitution}
          onOpenChange={(open) => {
            if (!open) setDeletingInstitution(null);
          }}
          onConfirm={() => {
            if (deletingInstitution) {
              deleteInstitution(deletingInstitution.id);
              setDeletingInstitution(null);
            }
          }}
        />
      )}
    </div>
  );
};
