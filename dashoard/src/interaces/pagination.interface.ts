export interface IPagination {
  hasMore: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}
