import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useTranslation } from "react-i18next";

interface PaginationControlsProps {
  pagination: {
    page: number;
    itemsPerPage: number;
    meta: {
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    } | null;
    nextPage: () => void;
    previousPage: () => void;
    goToPage: (page: number) => void;
    changeItemsPerPage: (limit: number) => void;
  };
}

const getPageNumbers = (
  current: number,
  total: number,
): (number | "ellipsis")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  pages.push(1);

  if (current > 3) {
    pages.push("ellipsis");
  }

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  pages.push(total);

  return pages;
};

export const PaginationControls = ({ pagination }: PaginationControlsProps) => {
  const {
    page,
    itemsPerPage,
    meta,
    nextPage,
    previousPage,
    goToPage,
    changeItemsPerPage,
  } = pagination;
  const { t } = useTranslation();

  if (!meta || meta.totalItems === 0) return null;

  const start = (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, meta.totalItems);
  const pageNumbers = getPageNumbers(page, meta.totalPages);

  return (
    <div className="flex flex-col gap-4 p-4 border-t sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 text-sm">
        <p className="min-w-max">
          {t("pagination.showing")}{" "}
          <strong>
            {" "}
            {start}-{end}
          </strong>{" "}
          {t("pagination.of")} <strong> {meta.totalItems}</strong>{" "}
          {t("pagination.total")}
        </p>
        |
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap">{t("pagination.itemsPerPage")}</p>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => changeItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navegação */}
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={previousPage}
                className={
                  !meta.hasPreviousPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {pageNumbers.map((pageNum, idx) => (
              <PaginationItem key={`${pageNum}-${idx}`}>
                {pageNum === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => goToPage(pageNum)}
                    isActive={pageNum === page}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={nextPage}
                className={
                  !meta.hasNextPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
