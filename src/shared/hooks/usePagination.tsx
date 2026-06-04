import { useState } from "react";

const STORAGE_KEY = "pagination-items-per-page";

function readStoredItemsPerPage(defaultValue: number): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = Number(stored);
  return stored && !isNaN(parsed) && parsed > 0 ? parsed : defaultValue;
}

export const usePagination = ({
  initialPage = 1,
  initialItemsPerPage = 10,
  initialSortBy = "ticker",
  initialOrder = "ASC" as "ASC" | "DESC",
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(() =>
    readStoredItemsPerPage(initialItemsPerPage),
  );
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [order, setOrder] = useState<"ASC" | "DESC">(initialOrder);

  const [meta, setMeta] = useState<{
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);

  const nextPage = () => {
    if (meta?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (meta?.hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (!meta) return;
    const validPage = Math.min(Math.max(1, pageNumber), meta.totalPages);
    setPage(validPage);
  };

  const changeItemsPerPage = (newItemsPerPage: number) => {
    localStorage.setItem(STORAGE_KEY, String(newItemsPerPage));
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setOrder((prevOrder) => (prevOrder === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(column);
      setOrder("ASC");
    }
  };

  return {
    page,
    itemsPerPage,
    sortBy,
    order,

    meta,
    setMeta,

    nextPage,
    previousPage,
    goToPage,
    changeItemsPerPage,
    toggleSort,
  };
};
