export interface PaginationQuery {
  page?: number;
  itemsPerPage?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  skipPagination?: boolean;
}
