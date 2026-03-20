import { csvService } from "@/features/positions/services/csvService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useCsvUpload = () => {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => csvService.uploadCsv(file),
    onSuccess: () => {
      toast.success("Arquivo CSV enviado com sucesso!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSETS });
      setIsOpen(false);
      setFile(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao enviar o arquivo CSV.");
      console.error(error);
    },
  });

  const downloadMutation = useMutation({
    mutationFn: () => csvService.downloadTemplate(),
    onSuccess: () => {
      toast.success("Arquivo CSV baixado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao baixar o arquivo CSV.");
      console.error(error);
    },
  });

  const handleFileSelect = (selectedFile: File) => {
    uploadMutation.reset();
    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("Por favor, selecione um arquivo CSV válido.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      // 5MB
      toast.error("O arquivo CSV deve ter no máximo 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  return {
    isOpen,
    setIsOpen,
    file,
    handleFileSelect,
    handleDownloadTemplate: () => downloadMutation.mutate(),
    handleUpload: () => {
      if (!file) {
        toast.error("Nenhum arquivo selecionado");
        return;
      }
      uploadMutation.mutate(file);
    },

    isUploading: uploadMutation.isPending,
    isDownloading: downloadMutation.isPending,
    uploadError: uploadMutation.error,
    downloadError: downloadMutation.error,
  };
};
