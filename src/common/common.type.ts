import { ComponentProps } from "react";

export type CustomVariantProps<
  T extends Record<string, Record<string, string>>
> = {
  [K in keyof T]?: keyof T[K];
};

export type CommonIconProps = ComponentProps<"svg"> & {
  size?: number;
};

export type responseDataType<T> = {
  data: T;
  errorCode: string;
  errorMessage: string;
  success: boolean;
};

export type customAxiosResponseType<T> = responseDataType<T> & {
  status: number;
};

export type apiErrorType<T = null> = responseDataType<T> & {
  status: number;
};
