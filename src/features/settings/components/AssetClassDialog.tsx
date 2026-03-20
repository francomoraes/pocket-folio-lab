import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Plus } from "lucide-react";
import { useAssetClasses } from "@/features/settings/hooks/useAssetClasses";
import { AssetClass } from "@/shared/types/assetClass";
import { useTranslation } from "react-i18next";

export const AssetClassDialog = ({
  mode,
  assetClass,
  onClose,
}: {
  mode: "create" | "edit";
  assetClass?: AssetClass;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(!!assetClass);
  const [name, setName] = useState(assetClass?.name || "");
  const { createAssetClass, updateAssetClass, isCreating, isUpdating } =
    useAssetClasses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      await createAssetClass({ name });
    } else {
      await updateAssetClass({ id: assetClass!.id, name });
    }

    setOpen(false);
    setName("");
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setName("");
          onClose?.();
        }
      }}
    >
      <DialogTrigger asChild>
        {mode === "create" && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("settings.assetClasses.create")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? t("settings.assetClasses.create")
              : t("settings.assetClasses.edit")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("settings.assetClasses.table.name")}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("transaction.placeholders.name")}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? t("common.status.saving")
                : t("common.buttons.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
