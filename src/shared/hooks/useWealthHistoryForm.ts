import { useWealthHistory } from "@/shared/hooks/useWealthHistory";
import { WealthHistory } from "@/shared/types/wealthHistory";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type WealthHistoryFormData = {
  date: string;
  totalWealthCents: string;
};

const initialState: WealthHistoryFormData = {
  date: new Date().toISOString().split("T")[0],
  totalWealthCents: "",
};

export const useWealthHistoryForm = (
  item?: WealthHistory | null,
  onSuccess?: () => void,
) => {
  const [formData, setFormData] = useState<WealthHistoryFormData>(initialState);
  const isEditMode = !!item;

  const { createWealthHistory, updateWealthHistory, isCreating, isUpdating } =
    useWealthHistory();

  useEffect(() => {
    if (item) {
      setFormData({
        date: item.date,
        totalWealthCents: (item.totalWealthCents / 100).toString(),
      });
    } else {
      setFormData(initialState);
    }
  }, [item]);

  const updateField = (field: keyof WealthHistoryFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.date.trim()) {
      toast.error("A data é obrigatória.");
      return false;
    }
    if (
      !formData.totalWealthCents.trim() ||
      parseFloat(formData.totalWealthCents) < 0
    ) {
      toast.error("O valor do patrimônio deve ser maior ou igual a zero");
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

    const totalWealthCents = Math.round(
      parseFloat(formData.totalWealthCents) * 100,
    );

    try {
      if (isEditMode) {
        updateWealthHistory(
          {
            id: item!.id,
            data: {
              date: formData.date,
              totalWealthCents,
            },
          },
          {
            onSuccess: () => {
              onSuccess?.();
            },
          } as any,
        );
      } else {
        createWealthHistory(
          {
            date: formData.date,
            totalWealthCents,
          },
          {
            onSuccess: () => {
              onSuccess?.();
            },
          } as any,
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
