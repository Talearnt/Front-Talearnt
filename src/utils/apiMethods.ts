import Axios from "axios";

import { checkObjectType } from "./checkObjectType";

const baseURL = "http://3.35.198.221/";
const instance = Axios.create({
  baseURL,
  headers: {
    Accept: "application/json"
  }
});

type responseDataType<T> = {
  data: T;
  errorCode: string;
  errorMessage: string;
  success: boolean;
};

type customAxiosResponseType<T> = {
  data: responseDataType<T>;
  status: number;
};

export const getAPI = async <T>(
  url: string,
  queryData?: Record<string, string | number | Record<string, unknown>>
): Promise<customAxiosResponseType<T>> => {
  let queryParameter = "";

  if (queryData) {
    queryParameter = Object.keys(queryData)
      .reduce(
        (acc, cur) =>
          `${acc}${cur}=${
            checkObjectType(queryData[cur])
              ? JSON.stringify(queryData[cur])
              : String(queryData[cur])
          }&`,
        "?"
      )
      .slice(0, -1);
  }
  const { data, status } = await instance.get<responseDataType<T>>(
    `${url}${queryParameter}`
  );

  return { data, status };
};

export const postAPI = async <T>(
  url: string,
  body?: Record<string, string | number | Record<string, unknown> | unknown[]>
): Promise<customAxiosResponseType<T>> => {
  const { data, status } = await instance.post<responseDataType<T>>(url, body);
  return { data, status };
};

export const putAPI = async <T>(
  url: string,
  body?: Record<string, string | number | Record<string, unknown> | unknown[]>
): Promise<customAxiosResponseType<T>> => {
  const { data, status } = await instance.put<responseDataType<T>>(url, body);
  return { data, status };
};

export const patchAPI = async <T>(
  url: string,
  body?: Record<string, string | number | Record<string, unknown> | unknown[]>
): Promise<customAxiosResponseType<T>> => {
  const { data, status } = await instance.put<responseDataType<T>>(url, body);
  return { data, status };
};

export const deleteAPI = async <T>(
  url: string
): Promise<customAxiosResponseType<T>> => {
  const { data, status } = await instance.delete<responseDataType<T>>(url);
  return { data, status };
};
