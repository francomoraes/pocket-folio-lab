import { useAssetTransactions } from "@/features/positions/hooks/useAssetTransactions";
import { usePositions } from "@/features/positions/hooks/usePositions";
import { formatCurrencyToCents } from "@/shared/utils/formatters";
import {
  AssetTransaction,
  AssetTransactionType,
} from "@/shared/types/assetTransaction";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NEW_ASSET = "new";

type AssetTransactionFormData = {
  type: AssetTransactionType;
  date: string;
  quantity: string;
  unitPrice: string;
  fees: string;
  totalAmount: string;
  selectedAssetId: string;
  ticker: string;
  assetTypeName: string;
  institutionId: number | null;
  currency: string;
};

const todayIsoDate = () => new Date().toISOString().split("T")[0];

const initialState: AssetTransactionFormData = {
  type: "buy",
  date: todayIsoDate(),
  quantity: "",
  unitPrice: "",
  fees: "",
  totalAmount: "",
  selectedAssetId: "",
  ticker: "",
  assetTypeName: "",
  institutionId: null,
  currency: "BRL",
};

export const useAssetTransactionForm = (
  transaction?: AssetTransaction | null,
  assetId?: number,
  onSuccess?: () => void,
  investorId?: number,
) => {
  const [formData, setFormData] = useState<AssetTransactionFormData>(initialState);
  const isEditMode = !!transaction;
  const needsAssetSelection = !isEditMode && !assetId;
  const isCreatingNewAsset =
    needsAssetSelection && formData.selectedAssetId === NEW_ASSET;

  const { createTransaction, updateTransaction, isCreating, isUpdating } =
    useAssetTransactions({}, investorId);

  const { assets } = usePositions(
    { skipPagination: true },
    investorId,
  );
  const existingAssets = assets?.data ?? [];

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...initialState,
        type: transaction.type,
        date: transaction.date.slice(0, 10),
        quantity: transaction.quantity?.toString() ?? "",
        unitPrice:
          transaction.unitPriceCents !== null
            ? (transaction.unitPriceCents / 100).toString()
            : "",
        fees: transaction.feesCents ? (transaction.feesCents / 100).toString() : "",
        totalAmount:
          transaction.type === "dividend"
            ? (transaction.totalAmountCents / 100).toString()
            : "",
      });
    } else {
      setFormData(initialState);
    }
  }, [transaction]);

  const updateField = (
    field: keyof AssetTransactionFormData,
    value: string | number | null,
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value } as AssetTransactionFormData;
      if (field === "type" && value !== "buy" && prev.selectedAssetId === NEW_ASSET) {
        next.selectedAssetId = "";
      }
      return next;
    });
  };

  const resetForm = () => setFormData(initialState);

  const validateForm = (): boolean => {
    if (needsAssetSelection) {
      if (!formData.selectedAssetId) {
        toast.error("Selecione um ativo.");
        return false;
      }
      if (isCreatingNewAsset) {
        if (!formData.ticker.trim()) {
          toast.error("O ticker é obrigatório.");
          return false;
        }
        if (!formData.assetTypeName.trim()) {
          toast.error("O tipo de ativo é obrigatório.");
          return false;
        }
        if (!formData.institutionId) {
          toast.error("A instituição é obrigatória.");
          return false;
        }
      }
    }

    if (!formData.date) {
      toast.error("A data é obrigatória.");
      return false;
    }

    if (new Date(formData.date) > new Date()) {
      toast.error("Não é possível lançar uma operação com data futura.");
      return false;
    }

    if (formData.type === "dividend") {
      if (!formData.totalAmount.trim() || parseFloat(formData.totalAmount) <= 0) {
        toast.error("O valor recebido deve ser maior que zero.");
        return false;
      }
    } else {
      if (!formData.quantity.trim() || parseFloat(formData.quantity) <= 0) {
        toast.error("A quantidade deve ser maior que zero.");
        return false;
      }
      if (!formData.unitPrice.trim() || parseFloat(formData.unitPrice) < 0) {
        toast.error("O preço unitário deve ser maior ou igual a zero.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    const operationFields =
      formData.type === "dividend"
        ? {
            type: "dividend" as const,
            date: formData.date,
            totalAmountCents: formatCurrencyToCents(parseFloat(formData.totalAmount)),
          }
        : {
            type: formData.type as "buy" | "sell",
            date: formData.date,
            quantity: parseFloat(formData.quantity),
            unitPriceCents: formatCurrencyToCents(parseFloat(formData.unitPrice)),
            ...(formData.fees.trim() && {
              feesCents: formatCurrencyToCents(parseFloat(formData.fees)),
            }),
          };

    try {
      if (isEditMode && transaction) {
        await updateTransaction({ id: transaction.id, data: operationFields });
      } else if (assetId) {
        await createTransaction({ assetId, ...operationFields });
      } else if (isCreatingNewAsset) {
        await createTransaction({
          ticker: formData.ticker.toUpperCase(),
          assetTypeName: formData.assetTypeName,
          institutionId: Number(formData.institutionId),
          currency: formData.currency as "BRL" | "USD",
          ...operationFields,
        });
      } else {
        await createTransaction({
          assetId: Number(formData.selectedAssetId),
          ...operationFields,
        });
      }
      resetForm();
      onSuccess?.();
    } catch (error) {}
  };

  return {
    formData,
    updateField,
    handleSubmit,
    resetForm,
    isSubmitting: isCreating || isUpdating,
    isEditMode,
    needsAssetSelection,
    isCreatingNewAsset,
    existingAssets,
  };
};
