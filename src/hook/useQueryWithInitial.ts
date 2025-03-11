import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query/src/types";

import { customAxiosResponseType } from "@common/common.type";

export const useQueryWithInitial = <T>(
  initialData: T,
  options: UseQueryOptions<
    customAxiosResponseType<T>,
    customAxiosResponseType<null>
  >
): Omit<
  UseQueryResult<customAxiosResponseType<T>, customAxiosResponseType<null>>,
  "isLoading"
> & {
  data: customAxiosResponseType<T>;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  status: "error" | "pending" | "success";
} => {
  const { data, ...value } = useQuery<
    customAxiosResponseType<T>,
    customAxiosResponseType<null>
  >(options);

  const isSuccess = value.isSuccess && value.fetchStatus === "idle";
  const isLoading = value.isLoading || value.isFetching;

  return {
    data: isSuccess
      ? {
          data: (data as customAxiosResponseType<T>).data,
          errorCode: null,
          errorMessage: null,
          success: true,
          status: 0
        }
      : {
          data: initialData,
          errorCode: null,
          errorMessage: null,
          success: true,
          status: 0
        },
    ...value,
    isSuccess,
    isLoading
  };
};
