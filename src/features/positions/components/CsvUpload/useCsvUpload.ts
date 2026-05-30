import { csvService } from "@/features/positions/services/csvService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useCsvUpload = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => csvService.uploadCsv(file),
    onSuccess: (data) => {
      const { autoCreated } = data;
      const totalCreated =
        autoCreated.institutions.length +
        autoCreated.assetClasses.length +
        autoCreated.assetTypes.length;

      const message =
        totalCreated > 0
          ? `${t("csv.upload.uploadedSuccess")} ${t("csv.upload.autoCreatedSummary", { count: totalCreated })}`
          : t("csv.upload.uploadedSuccess");

      toast.success(message);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSETS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INSTITUTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_CLASSES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_TYPES });
      setIsOpen(false);
      setFile(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("csv.upload.uploadError"));
      console.error(error);
    },
  });

  const downloadMutation = useMutation({
    mutationFn: () => csvService.downloadTemplate(),
    onSuccess: () => {
      toast.success(t("csv.upload.downloadedSuccess"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("csv.upload.downloadError"));
      console.error(error);
    },
  });

  const handleFileSelect = (selectedFile: File) => {
    uploadMutation.reset();
    if (!selectedFile.name.endsWith(".csv")) {
      toast.error(t("csv.upload.invalidFile"));
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      // 5MB
      toast.error(t("csv.upload.maxSize"));
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
        toast.error(t("csv.upload.noFileSelected"));
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
