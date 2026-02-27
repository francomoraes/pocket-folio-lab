import { ConfirmDeleteDialog } from "@/shared/components/ConfirmDeleteDialog";
import { InstitutionDialog } from "@/features/settings/components/InstitutionDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useInstitutions } from "@/features/settings/hooks/useInstitutions";
import { Institution } from "@/shared/types/institution";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";

export const InstitutionsTable = () => {
  const { institutions, isLoading, deleteInstitution, isDeleting } =
    useInstitutions();
  const [editingInstitution, setEditingInstitution] =
    useState<Institution | null>(null);
  const [deletingInstitution, setDeletingInstitution] =
    useState<Institution | null>(null);
  const { t } = useTranslation();

  if (isLoading) return <div>{t("common.status.loading")}</div>;

  if (institutions.length === 0) {
    return (
      <div>
        <p>{t("common.status.noData")}</p>
        <InstitutionDialog mode="create" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-216px)] p-3">
      <div className="flex justify-end">
        <InstitutionDialog mode="create" />
      </div>
      <Card className="flex-1 flex flex-col min-h-0">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>{t("settings.institutions.table.name")}</TableHead>
              <TableHead className="text-right">
                {t("settings.institutions.table.actions")}
              </TableHead>
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
      </Card>

      {editingInstitution && (
        <InstitutionDialog
          mode="edit"
          institution={editingInstitution}
          onClose={() => setEditingInstitution(null)}
        />
      )}

      <ConfirmDeleteDialog
        open={!!deletingInstitution}
        onOpenChange={(open) => {
          if (!open) setDeletingInstitution(null);
        }}
        onConfirm={async () => {
          if (deletingInstitution) {
            await deleteInstitution(deletingInstitution.id);
            setDeletingInstitution(null);
          }
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};
