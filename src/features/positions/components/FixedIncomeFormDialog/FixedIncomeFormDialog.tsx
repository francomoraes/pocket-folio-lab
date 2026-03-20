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
              ? "Editar Ativo de Renda Fixa"
              : "Adicionar Ativo de Renda Fixa"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: CDB Banco XYZ"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Ativo</Label>
            <Select
              value={formData.typeId ? formData.typeId.toString() : ""}
              onValueChange={(v) => updateField("typeId", Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
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
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maturityDate">Data de Vencimento</Label>
              <Input
                id="maturityDate"
                type="date"
                value={formData.maturityDate}
                onChange={(e) => updateField("maturityDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indexationMode">Tipo de Indexação</Label>
            <Select
              value={formData.indexationMode}
              onValueChange={(v) => updateField("indexationMode", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRE">Pré-fixado</SelectItem>
                <SelectItem value="CDI">CDI +</SelectItem>
                <SelectItem value="IPCA">IPCA +</SelectItem>
                <SelectItem value="SELIC">Selic +</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interestRate">
                {formData.indexationMode === "PRE"
                  ? "Taxa (% a.a.)"
                  : "Taxa Adicional (%)"}
              </Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="Ex: 12.5"
                value={formData.interestRate}
                onChange={(e) => updateField("interestRate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investedValue">Valor Investido</Label>
              <Input
                id="investedValue"
                type="number"
                step="0.01"
                placeholder="Ex: 10000.00"
                value={formData.investedValue}
                onChange={(e) => updateField("investedValue", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Instituição</Label>
            <Select
              value={
                formData.institutionId ? formData.institutionId.toString() : ""
              }
              onValueChange={(v) => updateField("institutionId", Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a instituição" />
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
            <Label htmlFor="currency">Moeda</Label>
            <Select
              value={formData.currency}
              onValueChange={(v) => updateField("currency", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">BRL (Real)</SelectItem>
                <SelectItem value="USD">USD (Dólar)</SelectItem>
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
