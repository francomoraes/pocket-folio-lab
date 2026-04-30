import { useFixedIncomePositions } from "@/features/positions/hooks/useFixedIncomePositions";
import { formatCurrencyToCents } from "@/shared/utils/formatters";
import {
  FixedIncomeAsset,
  IndexationMode,
} from "@/shared/types/fixedIncomeAsset";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FixedIncomeFormData = {
  description: string;
  startDate: string;
  maturityDate: string;
  indexationMode: IndexationMode;
  interestRate: string;
  investedValue: string;
  currentValue: string;
  institutionId: number | null;
  typeId: number | null;
  currency: string;
};

const initialState: FixedIncomeFormData = {
  description: "",
  startDate: "",
  maturityDate: "",
  indexationMode: IndexationMode.PRE,
  interestRate: "",
  investedValue: "",
  currentValue: "",
  institutionId: null,
  typeId: null,
  currency: "BRL",
};

const toInputDate = (value: string | Date): string => {
  const stringValue = typeof value === "string" ? value : value.toISOString();
  return stringValue.split("T")[0];
};

export const useFixedIncomeForm = (
  asset?: FixedIncomeAsset | null,
  onSuccess?: () => void,
) => {
  const [formData, setFormData] = useState<FixedIncomeFormData>(initialState);
  const isEditMode = !!asset;

  const {
    createFixedIncomeAsset,
    updateFixedIncomeAsset,
    isCreatingFixedIncomeAsset,
    isUpdatingFixedIncomeAsset,
  } = useFixedIncomePositions({
    skipPagination: true,
  });

  // Preenche o formulário quando um asset é passado
  useEffect(() => {
    if (asset) {
      setFormData({
        description: asset.description,
        startDate: asset.startDate ? toInputDate(asset.startDate) : "",
        maturityDate: asset.maturityDate ? toInputDate(asset.maturityDate) : "",
        indexationMode: asset.indexationMode || IndexationMode.PRE,
        interestRate:
          asset.interestRate != null ? asset.interestRate.toString() : "",
        investedValue: (asset.investedValueCents / 100).toString(),
        currentValue: asset.manualMode
          ? (asset.currentValueCents / 100).toString()
          : "",
        institutionId: asset.institution.id,
        typeId: asset.type.id,
        currency: asset.currency,
      });
    } else {
      setFormData(initialState);
    }
  }, [asset]);

  const updateField = (
    field: keyof FixedIncomeFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.description.trim()) {
      toast.error("A descrição é obrigatória.");
      return false;
    }
    if (
      !formData.investedValue.trim() ||
      parseFloat(formData.investedValue) <= 0
    ) {
      toast.error("O valor investido deve ser maior que zero");
      return false;
    }
    if (!formData.currency.trim()) {
      toast.error("A moeda é obrigatória.");
      return false;
    }
    if (!formData.institutionId) {
      toast.error("A instituição é obrigatória.");
      return false;
    }
    if (!formData.typeId) {
      toast.error("O tipo de ativo é obrigatório.");
      return false;
    }
    if (formData.startDate && formData.maturityDate) {
      const startDate = new Date(formData.startDate);
      const maturityDate = new Date(formData.maturityDate);
      if (maturityDate <= startDate) {
        toast.error(
          "A data de vencimento deve ser posterior à data de início.",
        );
        return false;
      }
    }
    return true;
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    const hasRate = formData.interestRate.trim() !== "";
    const hasCurrentValue = formData.currentValue.trim() !== "";
    const manualMode = hasCurrentValue && !hasRate;

    const investedValueCents = formatCurrencyToCents(
      parseFloat(formData.investedValue),
    );
    const currentValueCents = manualMode
      ? formatCurrencyToCents(parseFloat(formData.currentValue))
      : undefined;
    const interestRate = hasRate
      ? parseFloat(formData.interestRate)
      : undefined;
    const institutionId = Number(formData.institutionId);
    const typeId = Number(formData.typeId);

    const payload = {
      description: formData.description,
      manualMode,
      startDate: formData.startDate || undefined,
      maturityDate: formData.maturityDate || undefined,
      indexationMode: !manualMode ? formData.indexationMode : undefined,
      interestRate,
      investedValueCents,
      currentValueCents,
      institutionId,
      typeId,
      currency: formData.currency,
    };

    try {
      if (isEditMode && asset) {
        await updateFixedIncomeAsset({ id: asset.id, data: payload });
      } else {
        await createFixedIncomeAsset({ data: payload });
      }
      resetForm();
      onSuccess?.();
    } catch (error) {
      // Error já é tratado no hook useFixedIncomePositions
    }
  };

  return {
    formData,
    updateField,
    handleSubmit,
    resetForm,
    isSubmitting: isCreatingFixedIncomeAsset || isUpdatingFixedIncomeAsset,
    isEditMode,
  };
};
