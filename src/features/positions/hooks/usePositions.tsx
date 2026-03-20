import { assetService } from "@/features/positions/services/assetService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { CreateAssetRequest, UpdateAssetRequest } from "@/shared/types/asset";
import { PaginationQuery } from "@/shared/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const usePositions = ({
  page = 1,
  itemsPerPage = 10,
  sortBy = "ticker",
  order = "ASC",
  skipPagination,
}: PaginationQuery = {}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: assets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      ...QUERY_KEYS.ASSETS,
      page,
      itemsPerPage,
      sortBy,
      order,
      skipPagination,
    ],
    queryFn: () =>
      assetService.getAssets({
        page,
        itemsPerPage,
        sortBy,
        order,
        skipPagination,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const createAssetMutation = useMutation({
    mutationFn: (data: CreateAssetRequest) => {
      return assetService.createAsset(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSETS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      toast.success(t("transaction.messages.success"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("transaction.messages.addError"));
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAssetRequest }) => {
      return assetService.updateAsset(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSETS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      toast.success(t("transaction.messages.updated"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("transaction.messages.updateError"));
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (id: number) => {
      return assetService.deleteAsset(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSETS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      toast.success(t("transaction.messages.deleted"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("transaction.messages.deleteError"));
    },
  });

  const refreshMarketPricesMutation = useMutation({
    mutationFn: () => {
      return assetService.refreshMarketPrices();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSETS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });

      if (result.usedCacheOnly) {
        toast.info(result.message);
        return;
      }

      toast.success(
        result.message || t("transaction.messages.refreshPricesSuccess"),
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t("transaction.messages.refreshPricesError"),
      );
    },
  });

  return {
    assets,
    isLoading,
    error,

    createAsset: createAssetMutation.mutateAsync,
    updateAsset: updateAssetMutation.mutateAsync,
    deleteAsset: deleteAssetMutation.mutateAsync,
    refreshMarketPrices: refreshMarketPricesMutation.mutateAsync,

    isCreating: createAssetMutation.isPending,
    isUpdating: updateAssetMutation.isPending,
    isDeleting: deleteAssetMutation.isPending,
    isRefreshingMarketPrices: refreshMarketPricesMutation.isPending,

    refetch,
  };
};
