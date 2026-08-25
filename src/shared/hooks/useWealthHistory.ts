import { wealthHistoryService } from "@/shared/services/wealthHistoryService";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  CreateWealthHistoryRequest,
  UpdateWealthHistoryRequest,
  WealthHistory,
} from "@/shared/types/wealthHistory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";

export const useWealthHistory = (investorId?: number) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const queryKey = investorId
    ? QUERY_KEYS.clientWealthHistory(investorId)
    : (["wealthHistory"] as const);

  const {
    data: wealthHistory,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () =>
      investorId
        ? managerService.getClientWealthHistory(investorId)
        : wealthHistoryService.getWealthHistory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const createWealthHistoryMutation = useMutation({
    mutationFn: (data: CreateWealthHistoryRequest) => {
      return investorId
        ? managerService.createClientWealthHistory(investorId, data)
        : wealthHistoryService.createWealthHistory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(t("dashboard.wealthHistory.messages.created"));
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(
          error,
          "dashboard.wealthHistory.messages.createError",
        ),
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
      return investorId
        ? managerService.updateClientWealthHistory(investorId, id, data)
        : wealthHistoryService.updateWealthHistory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(t("dashboard.wealthHistory.messages.updated"));
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(
          error,
          "dashboard.wealthHistory.messages.updateError",
        ),
      );
    },
  });

  const deleteWealthHistoryMutation = useMutation({
    mutationFn: (id: number) => {
      return investorId
        ? managerService.deleteClientWealthHistory(investorId, id)
        : wealthHistoryService.deleteWealthHistory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(t("dashboard.wealthHistory.messages.deleted"));
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(
          error,
          "dashboard.wealthHistory.messages.deleteError",
        ),
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
