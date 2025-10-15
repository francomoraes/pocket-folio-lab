import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Transaction, OperationType, AssetClass, AssetType } from "@/types/investment";
import { toast } from "sonner";

interface TransactionDialogProps {
  onAddTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => void;
}

export const TransactionDialog = ({ onAddTransaction }: TransactionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [operation, setOperation] = useState<OperationType>("buy");
  const [ticker, setTicker] = useState("");
  const [assetClass, setAssetClass] = useState<AssetClass>("stocks");
  const [assetType, setAssetType] = useState<AssetType>("stock");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const resetForm = () => {
    setOperation("buy");
    setTicker("");
    setAssetClass("stocks");
    setAssetType("stock");
    setQuantity("");
    setPrice("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticker || !quantity || !price) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    onAddTransaction({
      ticker: ticker.toUpperCase(),
      operation,
      assetClass,
      assetType,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      date,
    });

    toast.success("Transação adicionada com sucesso");
    resetForm();
    setOpen(false);
  };

  const getAssetTypeOptions = () => {
    if (assetClass === "stocks") return [{ value: "stock", label: "Ação" }];
    if (assetClass === "fiis") return [{ value: "fii", label: "FII" }];
    return [
      { value: "post_fixed", label: "Pós-fixado" },
      { value: "inflation", label: "Inflação" },
      { value: "pre_fixed", label: "Prefixado" },
    ];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <RadioGroup value={operation} onValueChange={(v) => setOperation(v as OperationType)}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy" className="cursor-pointer font-normal">Compra</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell" className="cursor-pointer font-normal">Venda</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticker">Ticker</Label>
            <Input
              id="ticker"
              placeholder="PETR4"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="uppercase"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetClass">Classe</Label>
            <Select value={assetClass} onValueChange={(v) => {
              setAssetClass(v as AssetClass);
              if (v === "stocks") setAssetType("stock");
              else if (v === "fiis") setAssetType("fii");
              else setAssetType("post_fixed");
            }}>
              <SelectTrigger id="assetClass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stocks">Ações</SelectItem>
                <SelectItem value="fiis">FIIs</SelectItem>
                <SelectItem value="fixed_income">Renda Fixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetType">Tipo</Label>
            <Select value={assetType} onValueChange={(v) => setAssetType(v as AssetType)}>
              <SelectTrigger id="assetType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAssetTypeOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              placeholder="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="28.50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
