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
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate("/settings");
  };

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

  const { institutions, isLoading: isLoadingInstitutions } = useInstitutions({
    enabled: open,
  });
  const { assetTypes, isLoading: isLoadingTypes } = useAssetTypes({
    enabled: open,
  });

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
              disabled={isLoadingTypes || assetTypes.length === 0}
            >
              <SelectTrigger>
                {isLoadingTypes ? (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  <SelectValue
                    placeholder={t("transaction.placeholders.selectType")}
                  />
                )}
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isLoadingTypes && assetTypes.length === 0 && (
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p>{t("transaction.emptyState.noTypes")}</p>
                <p>{t("transaction.emptyState.noTypesLine2")}</p>
                <button
                  type="button"
                  className="underline text-primary"
                  onClick={goToSettings}
                >
                  {t("transaction.emptyState.settingsLink")}
                </button>
              </div>
            )}
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
              disabled={
                isEditMode ||
                isLoadingInstitutions ||
                (institutions ?? []).length === 0
              }
            >
              <SelectTrigger>
                {isLoadingInstitutions ? (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  <SelectValue
                    placeholder={t(
                      "transaction.placeholders.selectInstitution",
                    )}
                  />
                )}
              </SelectTrigger>
              <SelectContent>
                {(institutions ?? []).map((institution) => (
                  <SelectItem
                    key={institution.id}
                    value={institution.id.toString()}
                  >
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isEditMode &&
              !isLoadingInstitutions &&
              (institutions ?? []).length === 0 && (
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>{t("transaction.emptyState.noInstitutions")}</p>
                  <p>{t("transaction.emptyState.noInstitutionsLine2")}</p>
                  <button
                    type="button"
                    className="underline text-primary"
                    onClick={goToSettings}
                  >
                    {t("transaction.emptyState.settingsLink")}
                  </button>
                </div>
              )}
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

          {isEditMode && asset?.priceUnavailable && (
            <div className="space-y-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3">
              <Label
                htmlFor="currentPrice"
                className="text-amber-600 dark:text-amber-400"
              >
                {t("transaction.fields.currentPrice")}
              </Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentPrice}
                onChange={(e) => updateField("currentPrice", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {t("positions.table.priceUnavailableTooltip", {
                  date: new Date(asset.updatedAt).toLocaleDateString(),
                })}
              </p>
            </div>
          )}

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
