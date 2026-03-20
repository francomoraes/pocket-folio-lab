import { wealthHistoryService } from "@/shared/services/wealthHistoryService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  CreateWealthHistoryRequest,
  UpdateWealthHistoryRequest,
  WealthHistory,
} from "@/shared/types/wealthHistory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useWealthHistory = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: wealthHistory,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["wealthHistory"],
    queryFn: () => wealthHistoryService.getWealthHistory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const createWealthHistoryMutation = useMutation({
    mutationFn: (data: CreateWealthHistoryRequest) => {
      return wealthHistoryService.createWealthHistory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wealthHistory"] });
      toast.success(t("dashboard.wealthHistory.messages.created"));
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t("dashboard.wealthHistory.messages.createError"),
      );
    },
  });

  const updateWealthHistoryMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateWealthHistoryRequest;
    }) => {
      return wealthHistoryService.updateWealthHistory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wealthHistory"] });
      toast.success(t("dashboard.wealthHistory.messages.updated"));
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t("dashboard.wealthHistory.messages.updateError"),
      );
    },
  });

  const deleteWealthHistoryMutation = useMutation({
    mutationFn: (id: number) => {
      return wealthHistoryService.deleteWealthHistory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wealthHistory"] });
      toast.success(t("dashboard.wealthHistory.messages.deleted"));
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t("dashboard.wealthHistory.messages.deleteError"),
      );
    },
  });

  return {
    wealthHistory,
    isLoading,
    error,
    refetch,
    createWealthHistory: createWealthHistoryMutation.mutate,
    isCreating: createWealthHistoryMutation.isPending,
    updateWealthHistory: updateWealthHistoryMutation.mutate,
    isUpdating: updateWealthHistoryMutation.isPending,
    deleteWealthHistory: deleteWealthHistoryMutation.mutate,
    isDeleting: deleteWealthHistoryMutation.isPending,
  };
};
