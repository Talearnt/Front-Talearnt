import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { customAxiosResponseType } from "@common/common.type";

export const useQueryWithInitial = <T>(
  initialData: T,
  options: UseQueryOptions<customAxiosResponseType<T>>
): {
  data: customAxiosResponseType<T>;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  status: "error" | "pending" | "success";
} => {
  const { data, isSuccess, ...value } = useQuery(options);

  return {
    data: isSuccess
      ? {
          data: data.data,
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
    isSuccess,
    ...value
  };
};
