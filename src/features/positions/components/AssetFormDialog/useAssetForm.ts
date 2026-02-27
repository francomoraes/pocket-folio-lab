import { usePositions } from "@/features/positions/hooks/usePositions";
import { formatCurrencyToCents } from "@/shared/utils/formatters";
import { Asset } from "@/shared/types/asset";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AssetFormData = {
  ticker: string;
  quantity: string;
  price: string;
  institutionId: number | null;
  currency: string;
  type: string;
};

const initialState: AssetFormData = {
  ticker: "",
  quantity: "",
  price: "",
  institutionId: null,
  currency: "BRL",
  type: "Ação",
};

export const useAssetForm = (asset?: Asset | null, onSuccess?: () => void) => {
  const [formData, setFormData] = useState<AssetFormData>(initialState);
  const isEditMode = !!asset;

  const { createAsset, updateAsset, isCreating, isUpdating, assets } =
    usePositions({
      skipPagination: true,
    });

  useEffect(() => {
    if (asset) {
      setFormData({
        ticker: asset.ticker,
        quantity: asset.quantity.toString(),
        price: (asset.averagePriceCents / 100).toString(),
        institutionId: asset.institution.id,
        currency: asset.currency,
        type: asset.type.name,
      });
    } else {
      setFormData(initialState);
    }
  }, [asset]);

  const updateField = (field: keyof AssetFormData, value: string) => {
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

    if (!isEditMode) {
      const ticker = formData.ticker.toUpperCase();
      const institutionId = Number(formData.institutionId);

      const existingAsset = assets?.data.find(
        (a) => a.ticker === ticker && a.institution.id === institutionId,
      );

      if (existingAsset) {
        toast.error(
          `O ativo ${ticker} já existe na instituição ${existingAsset.institution.name}. Para alterar, edite o ativo existente.`,
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

    const quantity = parseFloat(formData.quantity);
    const price = parseFloat(formData.price);
    const averagePriceCents = formatCurrencyToCents(price);
    const ticker = formData.ticker.toUpperCase();
    const institutionId = Number(formData.institutionId);

    try {
      if (isEditMode && asset) {
        await updateAsset({
          id: asset.id,
          data: {
            ticker,
            quantity,
            averagePriceCents,
            type: formData.type,
            institutionId,
            currency: formData.currency,
          },
        });
      } else {
        const payload = {
          ticker,
          quantity,
          averagePriceCents,
          type: formData.type,
          institutionId,
          currency: formData.currency,
        };
        await createAsset(payload);
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
  };
};
