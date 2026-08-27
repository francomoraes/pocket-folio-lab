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
import { useAssetTransactionForm } from "@/features/positions/components/AssetTransactionDialog/useAssetTransactionForm";
import { useTranslation } from "react-i18next";
import { AssetTransaction } from "@/shared/types/assetTransaction";
import { useEffect } from "react";

interface AssetTransactionDialogProps {
  transaction?: AssetTransaction | null;
  assetId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investorId?: number;
}

export const AssetTransactionDialog = ({
  transaction,
  assetId,
  open,
  onOpenChange,
  investorId,
}: AssetTransactionDialogProps) => {
  const { t } = useTranslation();

  const {
    formData,
    updateField,
    handleSubmit,
    resetForm,
    isSubmitting,
    isEditMode,
    needsAssetSelection,
    isCreatingNewAsset,
    existingAssets,
  } = useAssetTransactionForm(transaction, assetId, () => onOpenChange(false), investorId);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) resetForm();
  };

  const { institutions, isLoading: isLoadingInstitutions } = useInstitutions(
    investorId,
    { enabled: open && isCreatingNewAsset },
  );
  const { assetTypes, isLoading: isLoadingTypes } = useAssetTypes(investorId, {
    enabled: open && isCreatingNewAsset,
  });

  useEffect(() => {
    if (open && isCreatingNewAsset && assetTypes?.length && !formData.assetTypeName) {
      updateField("assetTypeName", assetTypes[0].name);
    }
  }, [open, isCreatingNewAsset, assetTypes, formData.assetTypeName]);

  useEffect(() => {
    if (open && isCreatingNewAsset && institutions?.length && !formData.institutionId) {
      updateField("institutionId", institutions[0].id);
    }
  }, [open, isCreatingNewAsset, institutions, formData.institutionId]);

  const isDividend = formData.type === "dividend";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[calc(100%-2rem)] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? t("transaction.dialog.operationTitleEdit")
              : t("transaction.dialog.operationTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">{t("transaction.fields.operation")}</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => updateField("type", v)}
              disabled={isEditMode}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">{t("transaction.operations.buy")}</SelectItem>
                <SelectItem value="sell">{t("transaction.operations.sell")}</SelectItem>
                <SelectItem value="dividend">
                  {t("transaction.operations.dividend")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {needsAssetSelection && (
            <div className="space-y-2">
              <Label htmlFor="asset">{t("transaction.fields.asset")}</Label>
              <Select
                value={formData.selectedAssetId}
                onValueChange={(v) => updateField("selectedAssetId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("transaction.placeholders.selectAsset")} />
                </SelectTrigger>
                <SelectContent>
                  {existingAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      {asset.ticker} — {asset.institution.name}
                    </SelectItem>
                  ))}
                  {formData.type === "buy" && (
                    <SelectItem value="new">
                      {t("transaction.fields.newAsset")}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {isCreatingNewAsset && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ticker">{t("transaction.fields.ticker")}</Label>
                <Input
                  id="ticker"
                  placeholder={t("transaction.placeholders.ticker")}
                  value={formData.ticker}
                  onChange={(e) => updateField("ticker", e.target.value)}
                  className="uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetTypeName">
                  {t("transaction.fields.assetTypeName")}
                </Label>
                <Select
                  value={formData.assetTypeName}
                  onValueChange={(v) => updateField("assetTypeName", v)}
                  disabled={isLoadingTypes || assetTypes.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("transaction.placeholders.selectType")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">
                  {t("transaction.fields.institution")}
                </Label>
                <Select
                  value={
                    formData.institutionId ? formData.institutionId.toString() : ""
                  }
                  onValueChange={(v) => updateField("institutionId", Number(v))}
                  disabled={isLoadingInstitutions || (institutions ?? []).length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("transaction.placeholders.selectInstitution")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(institutions ?? []).map((institution) => (
                      <SelectItem key={institution.id} value={institution.id.toString()}>
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
                    <SelectItem value="BRL">{t("transaction.currency.brl")}</SelectItem>
                    <SelectItem value="USD">{t("transaction.currency.usd")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">{t("transaction.fields.date")}</Label>
            <Input
              id="date"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={formData.date}
              onChange={(e) => updateField("date", e.target.value)}
              required
            />
          </div>

          {isDividend ? (
            <div className="space-y-2">
              <Label htmlFor="totalAmount">
                {t("transaction.fields.totalAmount")}
              </Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.totalAmount}
                onChange={(e) => updateField("totalAmount", e.target.value)}
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="quantity">{t("transaction.fields.quantity")}</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={t("transaction.placeholders.quantity")}
                  value={formData.quantity}
                  onChange={(e) => updateField("quantity", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">{t("transaction.fields.unitPrice")}</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={t("transaction.placeholders.price")}
                  value={formData.unitPrice}
                  onChange={(e) => updateField("unitPrice", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fees">{t("transaction.fields.fees")}</Label>
                <Input
                  id="fees"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.fees}
                  onChange={(e) => updateField("fees", e.target.value)}
                />
              </div>
            </>
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
