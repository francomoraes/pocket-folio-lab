import { assetService } from "@/services/assetService";
import {
  BuyAssetRequest,
  SellAssetRequest,
  UpdateAssetRequest,
} from "@/types/asset";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const ASSETS_QUERY_KEY = ["assets"];

export const usePositions = () => {
  const queryClient = useQueryClient();

  const {
    data: assets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ASSETS_QUERY_KEY,
    queryFn: () => assetService.getAssets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const buyAssetMutation = useMutation({
    mutationFn: ({
      ticker,
      data,
    }: {
      ticker: string;
      data: BuyAssetRequest;
    }) => {
      return assetService.buyAsset(ticker, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success("Ativo comprado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao comprar ativo.");
    },
  });

  const sellAssetMutation = useMutation({
    mutationFn: ({
      ticker,
      data,
    }: {
      ticker: string;
      data: SellAssetRequest;
    }) => {
      return assetService.sellAsset(ticker, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success("Ativo vendido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao vender ativo.");
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAssetRequest }) => {
      return assetService.updateAsset(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success("Ativo atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar ativo.");
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (id: number) => {
      return assetService.deleteAsset(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success("Ativo excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir ativo.");
    },
  });

  const refreshMarketPricesMutation = useMutation({
    mutationFn: () => {
      return assetService.refreshMarketPrices();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success("Preços de mercado atualizados com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar preços de mercado.");
    },
  });

  return {
    assets,
    isLoading,
    error,

    buyAsset: buyAssetMutation.mutateAsync,
    sellAsset: sellAssetMutation.mutateAsync,
    updateAsset: updateAssetMutation.mutateAsync,
    deleteAsset: deleteAssetMutation.mutateAsync,
    refreshMarketPrices: refreshMarketPricesMutation.mutateAsync,

    isBuying: buyAssetMutation.isPending,
    isSelling: sellAssetMutation.isPending,
    isUpdating: updateAssetMutation.isPending,
    isDeleting: deleteAssetMutation.isPending,
    isRefreshingMarketPrices: refreshMarketPricesMutation.isPending,

    refetch,
  };
};
