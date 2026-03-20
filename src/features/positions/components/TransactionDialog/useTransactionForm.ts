import { usePositions } from "@/features/positions/hooks/usePositions";
import { formatCurrencyToCents } from "@/shared/utils/formatters";
import { useState } from "react";
import { toast } from "sonner";

type TransactionFormData = {
  ticker: string;
  quantity: string;
  price: string;
  institutionId: number | null;
  currency: string;
  type: string;
};

const initialState: TransactionFormData = {
  ticker: "",
  quantity: "",
  price: "",
  institutionId: null,
  currency: "BRL",
  type: "Ação",
};

export const useTransactionForm = (onSuccess?: () => void) => {
  const [formData, setFormData] = useState<TransactionFormData>(initialState);
  const { createAsset, isCreating, assets } = usePositions({
    skipPagination: true,
  });

  const updateField = (field: keyof TransactionFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.ticker.trim()) {
      toast.error("O ticker é obrigatório.");
      return false;
    }
    if (!formData.quantity.trim() || parseFloat(formData.quantity) <= 0) {
      toast.error("A quantidade deve ser maior do que zero");
      return false;
    }
    if (!formData.price.trim() || parseFloat(formData.price) <= 0) {
      toast.error("O preço deve ser maior do que zero");
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
    if (!formData.type.trim()) {
      toast.error("O tipo de ativo é obrigatório.");
      return false;
    }

    // Validação de duplicidade
    const ticker = formData.ticker.toUpperCase();
    const institutionId = Number(formData.institutionId);

    const existingAsset = assets?.data.find(
      (asset) =>
        asset.ticker === ticker && asset.institution.id === institutionId,
    );

    if (existingAsset) {
      toast.error(
        `O ativo ${ticker} já existe na instituição ${existingAsset.institution.name}. Para alterar, edite o ativo existente.`,
      );
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

    const quantity = parseFloat(formData.quantity);
    const price = parseFloat(formData.price);
    const averagePriceCents = formatCurrencyToCents(price);
    const ticker = formData.ticker.toUpperCase();
    const institutionId = Number(formData.institutionId);

    try {
      await createAsset({
        ticker,
        quantity,
        averagePriceCents,
        type: formData.type,
        institutionId,
        currency: formData.currency,
      });
      resetForm();
      onSuccess?.();
    } catch (error) {
      // Error já é tratado no hook usePositions
    }
  };

  return {
    formData,
    updateField,
    handleSubmit,
    resetForm,
    isSubmitting: isCreating,
  };
};
