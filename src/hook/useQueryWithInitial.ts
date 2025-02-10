import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useQueryWithInitial = <T>(
  initialData: T,
  options: UseQueryOptions<T>
): {
  data: T;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  status: "error" | "pending" | "success";
} => {
  const { data, isSuccess, ...value } = useQuery(options);

  return { data: isSuccess ? data : initialData, isSuccess, ...value };
};
