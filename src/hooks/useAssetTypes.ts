import { assetTypeService } from "@/services/assetTypeService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { CreateAssetType, UpdateAssetType } from "@/types/assetType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAssetTypes = () => {
  const queryClient = useQueryClient();

  const {
    data: assetTypes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.ASSET_TYPES,
    queryFn: async () => assetTypeService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const createAssetTypeMutation = useMutation({
    mutationFn: (data: CreateAssetType) => {
      return assetTypeService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_TYPES });
    },
    onError: (error: Error) => {
      console.error(error.message || "Error creating asset type");
    },
  });

  const updateAssetTypeMutation = useMutation({
    mutationFn: (data: UpdateAssetType) => {
      return assetTypeService.update(Number(data.id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_TYPES });
    },
    onError: (error: Error) => {
      console.error(error.message || "Error updating asset type");
    },
  });

  const deleteAssetTypeMutation = useMutation({
    mutationFn: (id: number) => {
      return assetTypeService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_TYPES });
    },
    onError: (error: Error) => {
      console.error(error.message || "Error deleting asset type");
    },
  });

  return {
    assetTypes,
    isLoading,
    error,

    createAssetType: createAssetTypeMutation.mutateAsync,
    updateAssetType: updateAssetTypeMutation.mutateAsync,
    deleteAssetType: deleteAssetTypeMutation.mutateAsync,

    isCreating: createAssetTypeMutation.isPending,
    isUpdating: updateAssetTypeMutation.isPending,
    isDeleting: deleteAssetTypeMutation.isPending,
  };
};
