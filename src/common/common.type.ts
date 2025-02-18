import { ComponentProps } from "react";

type CustomVariantProps<T extends Record<string, Record<string, string>>> = {
  [K in keyof T]?: keyof T[K];
};

type CommonIconProps = ComponentProps<"svg"> & {
  size?: number;
};

type responseDataType<T> = {
  data: T;
  errorCode: string | null;
  errorMessage: string | null;
  success: boolean;
};

type customAxiosResponseType<T> = responseDataType<T> & {
  status: number;
};

type paginationType<T> = {
  results: T[];
  pagination: {
    hasNext: boolean;
    hasPrevious: boolean;
    totalPages: number;
    currentPage: number;
  };
};

export type {
  CommonIconProps,
  customAxiosResponseType,
  CustomVariantProps,
  paginationType,
  responseDataType
};
