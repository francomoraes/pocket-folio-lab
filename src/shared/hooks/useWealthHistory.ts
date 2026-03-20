import { wealthHistoryService } from "@/shared/services/wealthHistoryService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  CreateWealthHistoryRequest,
  UpdateWealthHistoryRequest,
  WealthHistory,
} from "@/shared/types/wealthHistory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useWealthHistory = () => {
  const queryClient = useQueryClient();

  const {
    data: wealthHistory,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["wealthHistory"],
    queryFn: () => wealthHistoryService.getWealthHistory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const createWealthHistoryMutation = useMutation({
    mutationFn: (data: CreateWealthHistoryRequest) => {
      return wealthHistoryService.createWealthHistory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wealthHistory"] });
      toast.success("Registro de patrimônio adicionado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao adicionar registro de patrimônio.");
    },
  });

  const updateWealthHistoryMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateWealthHistoryRequest;
    }) => {
      return wealthHistoryService.updateWealthHistory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wealthHistory"] });
      toast.success("Registro de patrimônio atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar registro de patrimônio.");
    },
  });

  const deleteWealthHistoryMutation = useMutation({
    mutationFn: (id: number) => {
      return wealthHistoryService.deleteWealthHistory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wealthHistory"] });
      toast.success("Registro de patrimônio excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir registro de patrimônio.");
    },
  });

  return {
    wealthHistory,
    isLoading,
    error,
    refetch,
    createWealthHistory: createWealthHistoryMutation.mutate,
    isCreating: createWealthHistoryMutation.isPending,
    updateWealthHistory: updateWealthHistoryMutation.mutate,
    isUpdating: updateWealthHistoryMutation.isPending,
    deleteWealthHistory: deleteWealthHistoryMutation.mutate,
    isDeleting: deleteWealthHistoryMutation.isPending,
  };
};
