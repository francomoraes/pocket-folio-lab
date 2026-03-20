import { useState } from "react";
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
import { useInstitutions } from "@/features/settings/hooks/useInstitutions";
import { Institution } from "@/shared/types/institution";

export const InstitutionDialog = ({
  mode,
  institution,
  onClose,
}: {
  mode: "create" | "edit";
  institution?: Institution;
  onClose?: () => void;
}) => {
  const [open, setOpen] = useState(!!institution);
  const [name, setName] = useState(institution?.name || "");
  const { createInstitution, updateInstitution, isCreating, isUpdating } =
    useInstitutions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      await createInstitution({ name });
    } else {
      await updateInstitution({ id: institution!.id, name });
    }

    setOpen(false);
    setName("");
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setName("");
          onClose?.();
        }
      }}
    >
      <DialogTrigger asChild>
        {mode === "create" && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Instituição
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova Instituição" : "Editar Instituição"}
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
