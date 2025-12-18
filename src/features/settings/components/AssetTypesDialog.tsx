import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Plus } from "lucide-react";
import { useAssetTypes } from "@/features/settings/hooks/useAssetTypes";
import { AssetType } from "@/shared/types/assetType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useAssetClasses } from "@/features/settings/hooks/useAssetClasses";

export const AssetTypesDialog = ({
  mode,
  assetType,
  onClose,
}: {
  mode: "create" | "edit";
  assetType?: AssetType;
  onClose?: () => void;
}) => {
  const [open, setOpen] = useState(!!assetType);
  const [name, setName] = useState(assetType?.name || "");
  const [targetPercentage, setTargetPercentage] = useState(
    assetType?.targetPercentage ? assetType.targetPercentage * 100 : 0,
  );
  const [assetClassId, setAssetClassId] = useState(
    assetType?.assetClass?.id || null,
  );
  const { createAssetType, updateAssetType, isCreating, isUpdating } =
    useAssetTypes();

  const { assetClasses } = useAssetClasses();

  useEffect(() => {
    if (assetType) {
      setName(assetType.name);
      setTargetPercentage(assetType.targetPercentage * 100);
      setAssetClassId(assetType.assetClass?.id || null);
    }
  }, [assetType]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleClear = () => {
    setName("");
    setTargetPercentage(0);
    setAssetClassId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const targetPercentageDecimal = targetPercentage / 100;

    if (mode === "create") {
      await createAssetType({
        name,
        targetPercentage: targetPercentageDecimal,
        assetClassId,
      });
    } else {
      await updateAssetType({
        id: assetType!.id,
        name,
        targetPercentage: targetPercentageDecimal,
        assetClassId,
      });
    }

    handleClose();
    handleClear();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          handleClear();
          onClose?.();
        }
      }}
    >
      <DialogTrigger asChild>
        {mode === "create" && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Tipo
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo Tipo de Ativo" : "Editar Tipo de Ativo"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ações"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetPercentage">Percentual Meta (%)</Label>
            <Input
              id="targetPercentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={targetPercentage}
              onChange={(e) => setTargetPercentage(Number(e.target.value))}
              placeholder="Ex: 50"
              required
            />
          </div>
          <div className="space-y-2">
            <Select
              value={assetClassId?.toString() || ""}
              onValueChange={(v) => setAssetClassId(v ? Number(v) : null)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assetClasses.map((assetClass) => (
                  <SelectItem
                    key={assetClass.id}
                    value={assetClass.id.toString()}
                  >
                    {assetClass.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
