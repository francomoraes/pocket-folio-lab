import { usePositions } from "@/hooks/usePositions";
import { formatCurrencyToCents } from "@/utils/formatters";
import { useState } from "react";
import { toast } from "sonner";

type OperationType = "buy" | "sell";

type TransactionFormData = {
  ticker: string;
  quantity: string;
  price: string;
  operation: OperationType;
  institutionId: number | null;
  currency: string;
};

const initialState = {
  ticker: "",
  quantity: "",
  price: "",
  operation: "buy" as OperationType,
  institutionId: null,
  currency: "BRL",
};

export const useTransactionForm = (onSuccess?: () => void) => {
  const [formData, setFormData] = useState<TransactionFormData>(initialState);
  const { buyAsset, sellAsset, isBuying, isSelling } = usePositions();

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
    if (!formData.institutionId && formData.operation === "buy") {
      toast.error("A instituição é obrigatória para compras.");
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
    const priceCents = formatCurrencyToCents(price);
    const ticker = formData.ticker.toUpperCase();
    const institutionId = Number(formData.institutionId);

    try {
      if (formData.operation === "buy") {
        await buyAsset({
          ticker,
          data: {
            quantity,
            priceCents,
            institutionId,
            currency: formData.currency,
          },
        });
      } else {
        await sellAsset({
          ticker,
          data: {
            quantity,
            priceCents,
          },
        });
      }
      resetForm();
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao processar transação.");
    }
  };

  return {
    formData,
    updateField,
    handleSubmit,
    resetForm,
    isSubmitting: isBuying || isSelling,
  };
};
