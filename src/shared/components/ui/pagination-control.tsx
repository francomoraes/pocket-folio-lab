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
    <div className="flex flex-col gap-3 p-3 sm:p-4 border-t sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm">
        <p className="whitespace-nowrap">
          {t("pagination.showing")}{" "}
          <strong>
            {start}-{end}
          </strong>{" "}
          {t("pagination.of")} <strong>{meta.totalItems}</strong>
        </p>
        <div className="flex items-center gap-2">
          <span className="hidden xs:inline">|</span>
          <p className="whitespace-nowrap text-xs sm:text-sm">
            {t("pagination.itemsPerPage")}
          </p>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => changeItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-16 sm:w-20 h-7 sm:h-8 text-xs sm:text-sm">
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
      <div className="w-full sm:w-auto flex justify-center">
        <Pagination>
          <PaginationContent className="gap-0 sm:gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={previousPage}
                className={
                  !meta.hasPreviousPage
                    ? "pointer-events-none opacity-50 h-8 w-8 sm:h-9 sm:w-20 text-xs sm:text-sm px-2 sm:px-4"
                    : "cursor-pointer h-8 w-8 sm:h-9 sm:w-20 text-xs sm:text-sm px-2 sm:px-4"
                }
              />
            </PaginationItem>

            {pageNumbers.map((pageNum, idx) => (
              <PaginationItem
                key={`${pageNum}-${idx}`}
                className="hidden sm:block"
              >
                {pageNum === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => goToPage(pageNum)}
                    isActive={pageNum === page}
                    className="cursor-pointer h-9 w-9 text-sm"
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Mobile: mostrar apenas página atual */}
            <PaginationItem className="sm:hidden">
              <span className="flex h-8 w-auto px-3 items-center justify-center text-xs font-medium">
                {page} / {meta.totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={nextPage}
                className={
                  !meta.hasNextPage
                    ? "pointer-events-none opacity-50 h-8 w-8 sm:h-9 sm:w-20 text-xs sm:text-sm px-2 sm:px-4"
                    : "cursor-pointer h-8 w-8 sm:h-9 sm:w-20 text-xs sm:text-sm px-2 sm:px-4"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
