import { WealthHistory } from "@/shared/types/wealthHistory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useWealthHistory } from "@/shared/hooks/useWealthHistory";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

interface WealthHistoryListProps {
  wealthHistory: WealthHistory[];
  onEdit: (item: WealthHistory) => void;
}

const formatCurrency = (value: number, locale: string) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString: string, locale: string) => {
  return new Date(dateString).toLocaleDateString(locale);
};

export const WealthHistoryList = ({
  wealthHistory,
  onEdit,
}: WealthHistoryListProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || "pt-BR";
  const { deleteWealthHistory } = useWealthHistory();
  const [itemToDelete, setItemToDelete] = useState<WealthHistory | null>(null);

  const handleDelete = () => {
    if (itemToDelete) {
      deleteWealthHistory(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  if (!wealthHistory || wealthHistory.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {t("dashboard.wealthHistory.list.empty")}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("dashboard.wealthHistory.list.date")}</TableHead>
              <TableHead className="text-right">
                {t("dashboard.wealthHistory.list.value")}
              </TableHead>
              <TableHead className="text-right">
                {t("dashboard.wealthHistory.list.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...wealthHistory]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.date, locale)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.totalWealthCents / 100, locale)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setItemToDelete(item)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("global.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.wealthHistory.list.deleteDescription", {
                date: itemToDelete ? formatDate(itemToDelete.date, locale) : "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("global.deleteDialog.cancelButton")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t("global.deleteDialog.deleteButton")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
