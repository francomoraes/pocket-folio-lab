import { useFixedIncomePositions } from "@/features/positions/hooks/useFixedIncomePositions";
import { formatCurrencyToCents } from "@/shared/utils/formatters";
import { FixedIncomeAsset } from "@/shared/types/fixedIncomeAsset";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FixedIncomeFormData = {
  description: string;
  startDate: string;
  maturityDate: string;
  interestRate: string;
  investedValue: string;
  institutionId: number | null;
  typeId: number | null;
  currency: string;
};

const initialState: FixedIncomeFormData = {
  description: "",
  startDate: "",
  maturityDate: "",
  interestRate: "",
  investedValue: "",
  institutionId: null,
  typeId: null,
  currency: "BRL",
};

export const useFixedIncomeForm = (
  asset?: FixedIncomeAsset | null,
  onSuccess?: () => void
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
        startDate: new Date(asset.startDate).toISOString().split("T")[0],
        maturityDate: new Date(asset.maturityDate).toISOString().split("T")[0],
        interestRate: asset.interestRate.toString(),
        investedValue: (asset.investedValueCents / 100).toString(),
        institutionId: asset.institution.id,
        typeId: asset.type.id,
        currency: asset.currency,
      });
    } else {
      setFormData(initialState);
    }
  }, [asset]);

  const updateField = (field: keyof FixedIncomeFormData, value: string | number) => {
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
    if (!formData.startDate) {
      toast.error("A data de início é obrigatória.");
      return false;
    }
    if (!formData.maturityDate) {
      toast.error("A data de vencimento é obrigatória.");
      return false;
    }
    if (!formData.interestRate.trim() || parseFloat(formData.interestRate) < 0) {
      toast.error("A taxa de juros deve ser maior ou igual a zero");
      return false;
    }
    if (!formData.investedValue.trim() || parseFloat(formData.investedValue) <= 0) {
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

    // Validar datas
    const startDate = new Date(formData.startDate);
    const maturityDate = new Date(formData.maturityDate);
    
    if (maturityDate <= startDate) {
      toast.error("A data de vencimento deve ser posterior à data de início.");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    const interestRate = parseFloat(formData.interestRate);
    const investedValue = parseFloat(formData.investedValue);
    const investedValueCents = formatCurrencyToCents(investedValue);
    const institutionId = Number(formData.institutionId);
    const typeId = Number(formData.typeId);

    try {
      if (isEditMode && asset) {
        // Modo edição
        await updateFixedIncomeAsset({
          id: asset.id,
          data: {
            id: asset.id,
            description: formData.description,
            startDate: new Date(formData.startDate),
            maturityDate: new Date(formData.maturityDate),
            interestRate,
            investedValueCents,
            institutionId,
            typeId,
            currency: formData.currency,
          },
        });
      } else {
        // Modo criação
        await createFixedIncomeAsset({
          data: {
            id: 0, // Backend vai gerar o ID
            description: formData.description,
            startDate: new Date(formData.startDate),
            maturityDate: new Date(formData.maturityDate),
            interestRate,
            investedValueCents,
            institutionId,
            typeId,
            currency: formData.currency,
          },
        });
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
