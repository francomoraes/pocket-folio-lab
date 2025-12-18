import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function InstitutionCombobox({
  institutions,
  value,
  onChange,
}: {
  institutions: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSelect = (currentValue: string) => {
    // cmdk normaliza valores para lowercase, então precisamos encontrar o original
    const selectedInstitution = institutions.find(
      (inst) => inst.toLowerCase() === currentValue.toLowerCase(),
    );

    onChange(selectedInstitution || currentValue);
    setOpen(false);
    setSearch("");
  };

  const handleAddCustom = () => {
    if (search.trim()) {
      onChange(search.trim());
      setOpen(false);
      setSearch("");
    }
  };

  const filteredInstitutions = institutions.filter((inst) =>
    inst.toLowerCase().includes(search.toLowerCase()),
  );

  const showAddButton =
    search.trim() &&
    !filteredInstitutions.some(
      (inst) => inst.toLowerCase() === search.toLowerCase(),
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Selecione ou digite"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar ou adicionar..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {filteredInstitutions.length === 0 && !showAddButton && (
              <CommandEmpty>Nenhuma instituição encontrada.</CommandEmpty>
            )}

            {showAddButton && (
              <CommandEmpty>
                <div
                  className="cursor-pointer py-2 px-2 text-sm hover:bg-accent rounded-sm"
                  onClick={handleAddCustom}
                >
                  Adicionar "{search}"
                </div>
              </CommandEmpty>
            )}

            {filteredInstitutions.length > 0 && (
              <CommandGroup>
                {filteredInstitutions.map((institution) => (
                  <CommandItem
                    key={institution}
                    value={institution}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === institution ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {institution}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
