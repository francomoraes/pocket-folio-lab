import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Plus } from "lucide-react";
import { OperationType } from "@/shared/types/investment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePositions } from "@/features/positions/hooks/usePositions";
import { useInstitutions } from "@/features/settings/hooks/useInstitutions";
import { useTransactionForm } from "@/features/positions/components/TransactionDialog/useTransactionForm";

export const TransactionDialog = () => {
  const [open, setOpen] = useState(false);

  const { formData, updateField, handleSubmit, resetForm, isSubmitting } =
    useTransactionForm(() => setOpen(false));

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const { institutions } = useInstitutions();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Operação</Label>
            <RadioGroup
              value={formData.operation}
              onValueChange={(value) =>
                updateField("operation", value as OperationType)
              }
            >
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy" className="cursor-pointer font-normal">
                    Compra
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell" className="cursor-pointer font-normal">
                    Venda
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticker">Ticker</Label>
            <Input
              id="ticker"
              placeholder="PETR4"
              value={formData.ticker}
              onChange={(e) => updateField("ticker", e.target.value)}
              className="uppercase"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              placeholder="100"
              value={formData.quantity}
              onChange={(e) => updateField("quantity", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="28.50"
              value={formData.price}
              onChange={(e) => updateField("price", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Select
              value={
                formData.institutionId ? formData.institutionId.toString() : ""
              }
              onValueChange={(v) => updateField("institutionId", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {institutions?.map((institution) => (
                  <SelectItem
                    key={institution.id}
                    value={institution.id.toString()}
                  >
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Select
              value={formData.currency}
              onValueChange={(v) => updateField("currency", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">BRL (Real)</SelectItem>
                <SelectItem value="USD">USD (Dólar)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
