import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useInstitutions } from "@/features/settings/hooks/useInstitutions";
import { useAssetTypes } from "@/features/settings/hooks/useAssetTypes";
import { useAssetForm } from "@/features/positions/components/AssetFormDialog/useAssetForm";
import { useTranslation } from "react-i18next";
import { Asset } from "@/shared/types/asset";

interface AssetFormDialogProps {
  asset?: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssetFormDialog = ({
  asset,
  open,
  onOpenChange,
}: AssetFormDialogProps) => {
  const { t } = useTranslation();

  const {
    formData,
    updateField,
    handleSubmit,
    resetForm,
    isSubmitting,
    isEditMode,
  } = useAssetForm(asset, () => onOpenChange(false));

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const { institutions } = useInstitutions();
  const { assetTypes } = useAssetTypes();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[calc(100%-2rem)] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? t("transaction.dialog.titleEdit")
              : t("transaction.dialog.title")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticker">{t("transaction.fields.ticker")}</Label>
            <Input
              id="ticker"
              placeholder={t("transaction.placeholders.ticker")}
              value={formData.ticker}
              onChange={(e) => updateField("ticker", e.target.value)}
              className="uppercase"
              disabled={isEditMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">{t("transaction.fields.assetType")}</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => updateField("type", v)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("transaction.placeholders.selectType")}
                />
              </SelectTrigger>
              <SelectContent>
                {assetTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">{t("transaction.fields.quantity")}</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              placeholder={t("transaction.placeholders.quantity")}
              value={formData.quantity}
              onChange={(e) => updateField("quantity", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              {t("transaction.fields.averagePrice")}
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder={t("transaction.placeholders.price")}
              value={formData.price}
              onChange={(e) => updateField("price", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">
              {t("transaction.fields.institution")}
            </Label>
            <Select
              value={
                formData.institutionId ? formData.institutionId.toString() : ""
              }
              onValueChange={(v) => updateField("institutionId", v)}
              disabled={isEditMode}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("transaction.placeholders.selectInstitution")}
                />
              </SelectTrigger>
              <SelectContent>
                {institutions?.map((institution) => (
                  <SelectItem
                    key={institution.id}
                    value={institution.id.toString()}
                  >
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">{t("transaction.fields.currency")}</Label>
            <Select
              value={formData.currency}
              onValueChange={(v) => updateField("currency", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">
                  {t("transaction.currency.brl")}
                </SelectItem>
                <SelectItem value="USD">
                  {t("transaction.currency.usd")}
                </SelectItem>
              </SelectContent>
            </Select>
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
