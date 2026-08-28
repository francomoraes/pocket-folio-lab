import { assetService } from "@/features/positions/services/assetService";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { CreateAssetRequest, UpdateAssetRequest } from "@/shared/types/asset";
import { PaginationQuery } from "@/shared/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";

export const usePositions = (
  {
    page = 1,
    itemsPerPage = 10,
    sortBy = "ticker",
    order = "ASC",
    skipPagination,
    includeZeroQuantity = true,
  }: PaginationQuery = {},
  investorId?: number,
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const baseQueryKey = investorId
    ? QUERY_KEYS.clientAssets(investorId)
    : QUERY_KEYS.ASSETS;

  const {
    data: assets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      ...baseQueryKey,
      page,
      itemsPerPage,
      sortBy,
      order,
      skipPagination,
      includeZeroQuantity,
    ],
    queryFn: () =>
      investorId
        ? managerService.getClientAssets(investorId, {
            page,
            itemsPerPage,
            sortBy,
            order,
            skipPagination,
            includeZeroQuantity,
          })
        : assetService.getAssets({
            page,
            itemsPerPage,
            sortBy,
            order,
            skipPagination,
            includeZeroQuantity,
          }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const createAssetMutation = useMutation({
    mutationFn: (data: CreateAssetRequest) => {
      return investorId
        ? managerService.createClientAsset(investorId, data)
        : assetService.createAsset(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseQueryKey });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      toast.success(t("transaction.messages.success"));
    },
    onError: (error: Error) => {
      toast.error(resolveErrorMessage(error, "transaction.messages.addError"));
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAssetRequest }) => {
      return investorId
        ? managerService.updateClientAsset(investorId, id, data)
        : assetService.updateAsset(id, data);
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
        ? managerService.deleteClientAsset(investorId, id)
        : assetService.deleteAsset(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseQueryKey });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      queryClient.invalidateQueries({
        queryKey: investorId
          ? QUERY_KEYS.clientAssetTransactions(investorId)
          : QUERY_KEYS.ASSET_TRANSACTIONS,
      });
      toast.success(t("transaction.messages.deleted"));
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "transaction.messages.deleteError"),
      );
    },
  });

  const retryPriceMutation = useMutation({
    mutationFn: (id: number) => {
      return investorId
        ? managerService.retryClientAssetPrice(investorId, id)
        : assetService.retryPrice(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseQueryKey });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      toast.success(t("transaction.messages.retryPriceSuccess"));
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "transaction.messages.retryPriceError"),
      );
    },
  });

  const refreshMarketPricesMutation = useMutation({
    mutationFn: () => {
      return investorId
        ? managerService.refreshClientMarketPrices(investorId)
        : assetService.refreshMarketPrices();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: baseQueryKey });
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
    retryPrice: retryPriceMutation.mutateAsync,
    refreshMarketPrices: refreshMarketPricesMutation.mutateAsync,

    isCreating: createAssetMutation.isPending,
    isUpdating: updateAssetMutation.isPending,
    isDeleting: deleteAssetMutation.isPending,
    isRetryingPrice: retryPriceMutation.isPending,
    isRefreshingMarketPrices: refreshMarketPricesMutation.isPending,

    refetch,
  };
};
