export type responseDataType<T> = {
  data: T;
  errorCode: string | null;
  errorMessage: string | null;
  success: boolean;
};

export type customAxiosResponseType<T> = responseDataType<T> & {
  status: number;
};

export type paginationType<T> = {
  results: T[];
  pagination: {
    hasNext: boolean;
    hasPrevious: boolean;
    totalPages: number;
    currentPage: number;
    totalCount: number;
    latestCreatedAt: string;
  };
};

export type paginationRequestType = { page: number; size?: number };

export type pageStoreType = {
  page: number;
  setPage: (page: number) => void;
};
