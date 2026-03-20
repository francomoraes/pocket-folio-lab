import { useCsvUpload } from "@/features/positions/components/CsvUpload/useCsvUpload";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export const CsvUploadDialog = () => {
  const {
    isOpen,
    setIsOpen,
    file,
    handleFileSelect,
    handleDownloadTemplate,
    handleUpload,
    isUploading,
    isDownloading,
  } = useCsvUpload();
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 w-full sm:w-min">
          <Plus className="h-4 w-4" />
          {t("csv.upload.title")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("csv.upload.title")}</DialogTitle>
          <DialogDescription>{t("csv.upload.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("csv.upload.dragDrop")}
          </p>
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            disabled={isDownloading}
          >
            {isDownloading
              ? t("common.status.loading")
              : t("csv.upload.downloadTemplate")}
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("csv.upload.selectFile")}
          </label>
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                handleFileSelect(selectedFile);
              }
            }}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t("common.buttons.cancel")}
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading
              ? t("csv.upload.uploading")
              : t("common.buttons.import")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
