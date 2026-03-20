import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TableHead } from "@/shared/components/ui/table";
import { cn } from "@/lib/utils";

type SortOrder = "ASC" | "DESC";

interface SortableTableHeadProps {
  label: string;
  sortKey: string;
  currentSortBy: string;
  currentOrder: SortOrder;
  onSort: (sortKey: string) => void;
  className?: string;
}

export const SortableTableHead = ({
  label,
  sortKey,
  currentSortBy,
  currentOrder,
  onSort,
  className,
}: SortableTableHeadProps) => {
  const isActive = currentSortBy === sortKey;

  return (
    <TableHead className={className}>
      <Button
        type="button"
        variant="ghost"
        className={cn(
          "h-auto p-0 font-medium text-muted-foreground hover:bg-transparent hover:text-foreground",
          isActive && "text-foreground",
        )}
        onClick={() => onSort(sortKey)}
      >
        <span>{label}</span>
        {isActive ? (
          currentOrder === "ASC" ? (
            <ArrowUp className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : (
            <ArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" aria-hidden="true" />
        )}
      </Button>
    </TableHead>
  );
};
