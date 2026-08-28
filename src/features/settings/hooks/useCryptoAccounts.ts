import { cryptoAccountService } from "@/features/settings/services/cryptoAccountService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { ConnectCryptoAccountRequest } from "@/shared/types/cryptoAccount";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";

export const useCryptoAccounts = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();

  const invalidatePortfolioQueries = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CRYPTO_ACCOUNTS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSETS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
  };

  const {
    data: rawAccounts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.CRYPTO_ACCOUNTS,
    queryFn: async () => cryptoAccountService.list(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: options?.enabled ?? true,
  });

  const accounts = rawAccounts ?? [];

  const connectAccountMutation = useMutation({
    mutationFn: (data: ConnectCryptoAccountRequest) => {
      return cryptoAccountService.connect(data);
    },
    onSuccess: () => {
      invalidatePortfolioQueries();
      toast.success("Conta Mercado Bitcoin conectada com sucesso");
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(
          error,
          "auth.errorCodes.CRYPTO_ACCOUNT_CONNECTION_FAILED",
        ),
      );
    },
  });

  const syncAccountMutation = useMutation({
    mutationFn: (id: number) => cryptoAccountService.sync(id),
    onSuccess: () => {
      invalidatePortfolioQueries();
      toast.success("Sincronização concluída");
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "auth.errorCodes.ACCOUNT_SYNC_IN_PROGRESS"),
      );
    },
  });

  const disconnectAccountMutation = useMutation({
    mutationFn: (id: number) => cryptoAccountService.disconnect(id),
    onSuccess: () => {
      invalidatePortfolioQueries();
      toast.success("Conta desconectada com sucesso");
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "auth.errorCodes.CRYPTO_ACCOUNT_NOT_FOUND"),
      );
    },
  });

  return {
    accounts,
    isLoading,
    error,
    refetch,

    connectAccount: connectAccountMutation.mutateAsync,
    syncAccount: syncAccountMutation.mutateAsync,
    disconnectAccount: disconnectAccountMutation.mutateAsync,

    isConnecting: connectAccountMutation.isPending,
    isDisconnecting: disconnectAccountMutation.isPending,
  };
};
