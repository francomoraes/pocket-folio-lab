import { fixedIncomeAssetService } from "@/features/positions/services/fixedIncomeassetService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  CreateFixedIncomeAsset,
  UpdateFixedIncomeAsset,
} from "@/shared/types/fixedIncomeAsset";
import { PaginationQuery } from "@/shared/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useFixedIncomePositions = ({
  page = 1,
  itemsPerPage = 10,
  sortBy = "description",
  order = "ASC",
  skipPagination,
}: PaginationQuery = {}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: fixedIncomeAssets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      ...QUERY_KEYS.FIXED_INCOME_ASSETS,
      page,
      itemsPerPage,
      sortBy,
      order,
      skipPagination,
    ],
    queryFn: () =>
      fixedIncomeAssetService.getAssets({
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
      return fixedIncomeAssetService.createAsset(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FIXED_INCOME_ASSETS,
      });
      toast.success(t("transaction.messages.created"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("transaction.messages.addError"));
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
      return fixedIncomeAssetService.updateAsset(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FIXED_INCOME_ASSETS,
      });
      toast.success(t("transaction.messages.updated"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("transaction.messages.updateError"));
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (id: number) => {
      return fixedIncomeAssetService.deleteAsset(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FIXED_INCOME_ASSETS,
      });
      toast.success(t("transaction.messages.deleted"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("transaction.messages.deleteError"));
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
