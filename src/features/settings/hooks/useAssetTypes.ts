import { assetTypeService } from "@/features/settings/services/assetTypeService";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { CreateAssetType, UpdateAssetType } from "@/shared/types/assetType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";

export const useAssetTypes = (
  investorId?: number,
  options?: { enabled?: boolean },
) => {
  const queryClient = useQueryClient();

  const queryKey = investorId
    ? QUERY_KEYS.clientAssetTypes(investorId)
    : QUERY_KEYS.ASSET_TYPES;
  const operationLogsKey = investorId
    ? QUERY_KEYS.clientOperationLogs(investorId)
    : QUERY_KEYS.myOperationLogs();

  const {
    data: rawAssetTypes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () =>
      investorId
        ? managerService.listClientAssetTypes(investorId)
        : assetTypeService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: options?.enabled ?? true,
  });

  const assetTypes = rawAssetTypes ?? [];

  const createAssetTypeMutation = useMutation({
    mutationFn: (data: CreateAssetType) => {
      return investorId
        ? managerService.createClientAssetType(investorId, data)
        : assetTypeService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      queryClient.invalidateQueries({ queryKey: operationLogsKey });
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "auth.errorCodes.ASSET_TYPE_ALREADY_EXISTS"),
      );
    },
  });

  const updateAssetTypeMutation = useMutation({
    mutationFn: (data: UpdateAssetType) => {
      return investorId
        ? managerService.updateClientAssetType(investorId, Number(data.id), data)
        : assetTypeService.update(Number(data.id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      queryClient.invalidateQueries({ queryKey: operationLogsKey });
    },
    onError: (error: Error) => {
      toast.error(resolveErrorMessage(error, "auth.messages.updateError"));
    },
  });

  const deleteAssetTypeMutation = useMutation({
    mutationFn: (id: number) => {
      return investorId
        ? managerService.deleteClientAssetType(investorId, id)
        : assetTypeService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
      queryClient.invalidateQueries({ queryKey: operationLogsKey });
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "auth.errorCodes.ASSET_TYPE_HAS_ASSETS"),
      );
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
