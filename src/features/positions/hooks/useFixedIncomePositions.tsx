import { fixedIncomeAssetService } from "@/features/positions/services/fixedIncomeassetService";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  CreateFixedIncomeAsset,
  UpdateFixedIncomeAsset,
} from "@/shared/types/fixedIncomeAsset";
import { PaginationQuery } from "@/shared/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";

export const useFixedIncomePositions = (
  {
    page = 1,
    itemsPerPage = 10,
    sortBy = "description",
    order = "ASC",
    skipPagination,
  }: PaginationQuery = {},
  investorId?: number,
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const baseQueryKey = investorId
    ? QUERY_KEYS.clientFixedIncome(investorId)
    : QUERY_KEYS.FIXED_INCOME_ASSETS;

  const {
    data: fixedIncomeAssets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [...baseQueryKey, page, itemsPerPage, sortBy, order, skipPagination],
    queryFn: () =>
      investorId
        ? managerService.getClientFixedIncomeAssets(investorId, {
            page,
            itemsPerPage,
            sortBy,
            order,
            skipPagination,
          })
        : fixedIncomeAssetService.getAssets({
            page,
            itemsPerPage,
            sortBy,
            order,
            skipPagination,
          }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const createFixedIncomeAssetMutation = useMutation({
    mutationFn: ({ data }: { data: CreateFixedIncomeAsset }) => {
      return investorId
        ? managerService.createClientFixedIncomeAsset(investorId, data)
        : fixedIncomeAssetService.createAsset(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseQueryKey });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      toast.success(t("transaction.messages.created"));
    },
    onError: (error: Error) => {
      toast.error(resolveErrorMessage(error, "transaction.messages.addError"));
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateFixedIncomeAsset;
    }) => {
      return investorId
        ? managerService.updateClientFixedIncomeAsset(investorId, id, data)
        : fixedIncomeAssetService.updateAsset(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseQueryKey });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      toast.success(t("transaction.messages.updated"));
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "transaction.messages.updateError"),
      );
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (id: number) => {
      return investorId
        ? managerService.deleteClientFixedIncomeAsset(investorId, id)
        : fixedIncomeAssetService.deleteAsset(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseQueryKey });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      toast.success(t("transaction.messages.deleted"));
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "transaction.messages.deleteError"),
      );
    },
  });

  return {
    fixedIncomeAssets,
    isLoading,
    error,

    createFixedIncomeAsset: createFixedIncomeAssetMutation.mutateAsync,
    updateFixedIncomeAsset: updateAssetMutation.mutateAsync,
    deleteFixedIncomeAsset: deleteAssetMutation.mutateAsync,

    isCreatingFixedIncomeAsset: createFixedIncomeAssetMutation.isPending,
    isUpdatingFixedIncomeAsset: updateAssetMutation.isPending,
    isDeletingFixedIncomeAsset: deleteAssetMutation.isPending,

    refetch,
  };
};
