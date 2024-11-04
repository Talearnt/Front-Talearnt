export type responseDataType<T> = {
  data: T;
  errorCode: string;
  errorMessage: string;
  success: boolean;
};

export type customAxiosResponseType<T> = {
  data: responseDataType<T>;
  status: number;
};

export type apiErrorType<T = null> = responseDataType<T> & {
  status: number;
};
