import Axios from "axios";

import { checkObjectType } from "./checkObjectType";

const baseURL = "";
const instance = Axios.create({
  baseURL,
  headers: {
    Accept: "application/json"
  }
});

export const getAPI = async <T>(
  url: string,
  data?: Record<string, string | number | Record<string, unknown>>
): Promise<T> => {
  let queryParameter = "";

  if (data) {
    queryParameter = Object.keys(data)
      .reduce(
        (acc, cur) =>
          `${acc}${cur}=${
            checkObjectType(data[cur])
              ? JSON.stringify(data[cur])
              : String(data[cur])
          }&`,
        "?"
      )
      .slice(0, -1);
  }

  return (await instance.get<T>(`${url}${queryParameter}`)).data;
};

export const postAPI = async <T>(
  url: string,
  data?: Record<string, string | number | Record<string, unknown> | unknown[]>
): Promise<T> => (await instance.post<T>(url, data)).data;

export const putAPI = async <T>(
  url: string,
  data?: Record<string, string | number | Record<string, unknown> | unknown[]>
): Promise<T> => (await instance.put<T>(url, data)).data;

export const patchAPI = async <T>(
  url: string,
  data?: Record<string, string | number | Record<string, unknown> | unknown[]>
): Promise<T> => (await instance.patch<T>(url, data)).data;
