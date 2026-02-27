import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

import { useTranslation } from "react-i18next";
import { Asset } from "@/shared/types/asset";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfirmDeleteDialog = ({
  open,
  onOpenChange,
}: ConfirmDeleteDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-[425px] max-h-[calc(100%-2rem)] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("global.deleteDialog.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{t("global.deleteDialog.message")}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("global.deleteDialog.cancelButton")}
            </Button>
            <Button variant="destructive" onClick={() => onOpenChange(false)}>
              {t("global.deleteDialog.deleteButton")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
