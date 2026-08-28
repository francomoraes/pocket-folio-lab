import { assetTransactionService } from "@/features/positions/services/assetTransactionService";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  AssetTransactionListParams,
  CreateAssetTransactionRequest,
  UpdateAssetTransactionRequest,
} from "@/shared/types/assetTransaction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";

export const useAssetTransactions = (
  params: AssetTransactionListParams = {},
  investorId?: number,
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const baseQueryKey = investorId
    ? QUERY_KEYS.clientAssetTransactions(investorId, params)
    : QUERY_KEYS.assetTransactions(params);

  const invalidateAll = () => {
    queryClient.invalidateQueries({
      queryKey: investorId
        ? QUERY_KEYS.clientAssetTransactions(investorId)
        : QUERY_KEYS.ASSET_TRANSACTIONS,
    });
    queryClient.invalidateQueries({
      queryKey: investorId ? QUERY_KEYS.clientAssets(investorId) : QUERY_KEYS.ASSETS,
    });
    queryClient.invalidateQueries({
      queryKey: investorId ? QUERY_KEYS.clientSummary(investorId) : QUERY_KEYS.SUMMARY,
    });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
  };

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: baseQueryKey,
    queryFn: () =>
      investorId
        ? managerService.getClientTransactions(investorId, params)
        : assetTransactionService.getTransactions(params),
    staleTime: 60 * 1000,
    retry: 2,
  });

  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateAssetTransactionRequest) => {
      return investorId
        ? managerService.createClientTransaction(investorId, data)
        : assetTransactionService.createTransaction(data);
    },
    onSuccess: () => {
      invalidateAll();
      toast.success(t("transaction.messages.operationCreated"));
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "transaction.messages.operationCreateError"),
      );
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateAssetTransactionRequest;
    }) => {
      return investorId
        ? managerService.updateClientTransaction(investorId, id, data)
        : assetTransactionService.updateTransaction(id, data);
    },
    onSuccess: () => {
      invalidateAll();
      toast.success(t("transaction.messages.operationUpdated"));
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "transaction.messages.operationUpdateError"),
      );
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: number) => {
      return investorId
        ? managerService.deleteClientTransaction(investorId, id)
        : assetTransactionService.deleteTransaction(id);
    },
    onSuccess: () => {
      invalidateAll();
      toast.success(t("transaction.messages.operationDeleted"));
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "transaction.messages.operationDeleteError"),
      );
    },
  });

  return {
    transactions,
    isLoading,
    error,

    createTransaction: createTransactionMutation.mutateAsync,
    updateTransaction: updateTransactionMutation.mutateAsync,
    deleteTransaction: deleteTransactionMutation.mutateAsync,

    isCreating: createTransactionMutation.isPending,
    isUpdating: updateTransactionMutation.isPending,
    isDeleting: deleteTransactionMutation.isPending,

    refetch,
  };
};
