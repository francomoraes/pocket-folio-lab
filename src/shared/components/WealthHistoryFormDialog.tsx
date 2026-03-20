import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useWealthHistoryForm } from "@/shared/hooks/useWealthHistoryForm";
import { WealthHistory } from "@/shared/types/wealthHistory";
import { useTranslation } from "react-i18next";

interface WealthHistoryFormDialogProps {
  item?: WealthHistory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WealthHistoryFormDialog = ({
  item,
  open,
  onOpenChange,
}: WealthHistoryFormDialogProps) => {
  const { t } = useTranslation();

  const {
    formData,
    updateField,
    handleSubmit,
    resetForm,
    isSubmitting,
    isEditMode,
  } = useWealthHistoryForm(item, () => onOpenChange(false));

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? t("dashboard.wealthHistory.form.titleEdit")
              : t("dashboard.wealthHistory.form.titleCreate")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">
              {t("dashboard.wealthHistory.form.date")}
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateField("date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalWealthCents">
              {t("dashboard.wealthHistory.form.wealthValue")}
            </Label>
            <Input
              id="totalWealthCents"
              type="number"
              placeholder="0.00"
              value={formData.totalWealthCents}
              onChange={(e) => updateField("totalWealthCents", e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="flex justify-end gap-2 sticky bottom-0 bg-background pt-4 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              {t("common.buttons.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("common.status.saving")
                : t("common.buttons.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
