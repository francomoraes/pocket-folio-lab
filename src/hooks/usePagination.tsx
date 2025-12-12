import { useState } from "react";

export const usePagination = ({
  initialPage = 1,
  initialItemsPerPage = 10,
  initialSortBy = "ticker",
  initialOrder = "ASC" as "ASC" | "DESC",
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
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
