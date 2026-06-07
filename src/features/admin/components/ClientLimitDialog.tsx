import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface ClientLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  managerId: number;
  currentLimit: number | null;
  onSave: (managerId: number, limit: number) => Promise<void>;
  isSaving: boolean;
}

export const ClientLimitDialog = ({
  open,
  onOpenChange,
  managerId,
  currentLimit,
  onSave,
  isSaving,
}: ClientLimitDialogProps) => {
  const { t } = useTranslation();
  const [limit, setLimit] = useState(String(currentLimit ?? 10));

  const handleSave = async () => {
    const parsed = parseInt(limit, 10);
    if (isNaN(parsed) || parsed < 1) return;
    await onSave(managerId, parsed);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.users.editLimit.title")}</DialogTitle>
          <DialogDescription>
            {t("admin.users.editLimit.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="limit">{t("admin.users.editLimit.label")}</Label>
          <Input
            id="limit"
            type="number"
            min={1}
            max={500}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("admin.users.editLimit.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {t("admin.users.editLimit.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
