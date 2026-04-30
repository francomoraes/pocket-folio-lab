import { assetClassService } from "@/features/settings/services/assetClassService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { CreateAssetClass, UpdateAssetClass } from "@/shared/types/assetClass";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";

export const useAssetClasses = () => {
  const queryClient = useQueryClient();

  const {
    data: rawAssetClasses,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.ASSET_CLASSES,
    queryFn: async () => assetClassService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const assetClasses = rawAssetClasses ?? [];

  const createAssetClassMutation = useMutation({
    mutationFn: (data: CreateAssetClass) => {
      return assetClassService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_CLASSES });
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(
          error,
          "auth.errorCodes.ASSET_CLASS_ALREADY_EXISTS",
        ),
      );
    },
  });

  const updateAssetClassMutation = useMutation({
    mutationFn: (data: UpdateAssetClass) => {
      return assetClassService.update(data.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_CLASSES });
    },
    onError: (error: Error) => {
      toast.error(resolveErrorMessage(error, "auth.messages.updateError"));
    },
  });

  const deleteAssetClassMutation = useMutation({
    mutationFn: (id: number) => {
      return assetClassService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_CLASSES });
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(
          error,
          "auth.errorCodes.ASSET_CLASS_HAS_ASSET_TYPES",
        ),
      );
    },
  });

  return {
    assetClasses,
    isLoading,
    error,

    createAssetClass: createAssetClassMutation.mutateAsync,
    updateAssetClass: updateAssetClassMutation.mutateAsync,
    deleteAssetClass: deleteAssetClassMutation.mutateAsync,

    isCreating: createAssetClassMutation.isPending,
    isUpdating: updateAssetClassMutation.isPending,
    isDeleting: deleteAssetClassMutation.isPending,

    refetch,
  };
};
