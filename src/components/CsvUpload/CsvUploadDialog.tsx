import { useCsvUpload } from "@/components/CsvUpload/useCsvUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" />
          Importar Dados CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Carteira via CSV</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV com suas posições
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Não tem o arquivo? Baixe o template:
          </p>
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            disabled={isDownloading}
          >
            {isDownloading ? "Baixando..." : "Baixar Template CSV"}
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Selecione o arquivo CSV:
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
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Enviando..." : "Fazer Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
