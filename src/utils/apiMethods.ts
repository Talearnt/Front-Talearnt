import Axios, { AxiosError, AxiosRequestConfig } from "axios";

import { customAxiosResponseType, responseDataType } from "@common/common.type";

import { checkObjectType } from "./checkObjectType";

const baseURL = "http://3.35.198.221/";

const instance = Axios.create({
  baseURL,
  headers: {
    Accept: "application/json"
  }
});

instance.interceptors.response.use(
  res => res,
  async (error: AxiosError<responseDataType<unknown>>) => {
    if (!error.response) {
      return error;
    }

    const { data, status } = error.response;

    return Promise.reject({ ...data, status });
  }
);

export const getAPI = async <T>(
  url: string,
  queryData?: Record<
    string,
    string | number | Record<string, unknown> | undefined
  >
): Promise<customAxiosResponseType<T>> => {
  let queryParameter = "";

  if (queryData) {
    queryParameter = Object.keys(queryData)
      .reduce((acc, cur) => {
        const value = queryData[cur];

        if (value === undefined) {
          return acc;
        }

        return `${acc}${cur}=${
          checkObjectType(queryData[cur])
            ? JSON.stringify(queryData[cur])
            : String(queryData[cur])
        }&`;
      }, "?")
      .slice(0, -1);
  }
  const { data, status } = await instance.get<responseDataType<T>>(
    `${url}${queryParameter}`
  );

  return { ...data, status };
};

export const postAPI = async <T>(
  url: string,
  body?: Record<string, string | number | Record<string, unknown> | unknown[]>,
  config?: AxiosRequestConfig
): Promise<customAxiosResponseType<T>> => {
  const { data, status } = await instance.post<responseDataType<T>>(
    url,
    body,
    config
  );
  return { ...data, status };
};

export const putAPI = async <T>(
  url: string,
  body?: Record<string, string | number | Record<string, unknown> | unknown[]>
): Promise<customAxiosResponseType<T>> => {
  const { data, status } = await instance.put<responseDataType<T>>(url, body);

  return { ...data, status };
};

export const patchAPI = async <T>(
  url: string,
  body?: Record<string, string | number | Record<string, unknown> | unknown[]>
): Promise<customAxiosResponseType<T>> => {
  const { data, status } = await instance.put<responseDataType<T>>(url, body);

  return { ...data, status };
};

export const deleteAPI = async <T>(
  url: string
): Promise<customAxiosResponseType<T>> => {
  const { data, status } = await instance.delete<responseDataType<T>>(url);

  return { ...data, status };
};
