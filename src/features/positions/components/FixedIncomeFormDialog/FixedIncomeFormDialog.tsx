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
import { useFixedIncomeForm } from "@/features/positions/components/FixedIncomeFormDialog/useFixedIncomeForm";
import { useTranslation } from "react-i18next";
import { FixedIncomeAsset } from "@/shared/types/fixedIncomeAsset";

interface FixedIncomeFormDialogProps {
  asset?: FixedIncomeAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FixedIncomeFormDialog = ({
  asset,
  open,
  onOpenChange,
}: FixedIncomeFormDialogProps) => {
  const { t } = useTranslation();

  const {
    formData,
    updateField,
    handleSubmit,
    resetForm,
    isSubmitting,
    isEditMode,
  } = useFixedIncomeForm(asset, () => onOpenChange(false));

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
      <DialogContent className="sm:max-w-[500px] max-h-[calc(100%-2rem)] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? t("transaction.dialog.fixedIncomeTitleEdit")
              : t("transaction.dialog.fixedIncomeTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">
              {t("transaction.fields.description")}
            </Label>
            <Input
              id="description"
              placeholder={t("transaction.placeholders.description")}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">{t("transaction.fields.assetType")}</Label>
            <Select
              value={formData.typeId ? formData.typeId.toString() : ""}
              onValueChange={(v) => updateField("typeId", Number(v))}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("transaction.placeholders.selectType")}
                />
              </SelectTrigger>
              <SelectContent>
                {assetTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                {t("transaction.fields.startDate")}
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maturityDate">
                {t("transaction.fields.maturityDate")}
              </Label>
              <Input
                id="maturityDate"
                type="date"
                value={formData.maturityDate}
                onChange={(e) => updateField("maturityDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indexationMode">
              {t("transaction.fields.indexationMode")}
            </Label>
            <Select
              value={formData.indexationMode}
              onValueChange={(v) => updateField("indexationMode", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRE">
                  {t("transaction.indexationMode.pre")}
                </SelectItem>
                <SelectItem value="CDI">
                  {t("transaction.indexationMode.cdi")}
                </SelectItem>
                <SelectItem value="IPCA">
                  {t("transaction.indexationMode.ipca")}
                </SelectItem>
                <SelectItem value="SELIC">
                  {t("transaction.indexationMode.selic")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interestRate">
                {formData.indexationMode === "PRE"
                  ? t("transaction.fields.interestRate")
                  : t("transaction.fields.additionalRate")}
              </Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder={t("transaction.placeholders.interestRate")}
                value={formData.interestRate}
                onChange={(e) => updateField("interestRate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investedValue">
                {t("transaction.fields.investedValue")}
              </Label>
              <Input
                id="investedValue"
                type="number"
                step="0.01"
                placeholder={t("transaction.placeholders.investedValue")}
                value={formData.investedValue}
                onChange={(e) => updateField("investedValue", e.target.value)}
              />
            </div>
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
