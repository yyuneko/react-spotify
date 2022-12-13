import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { refreshToken } from "@service/index";

import cookie from "./cookie";

const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1",
});
// axiosInstance.defaults.withCredentials = true;
axiosInstance.interceptors.request.use((config) => {
  if (config.baseURL != "https://api.spotify.com/v1") {
    return config;
  }

  return new Promise<string>((resolve) => {
    if (!cookie.get("authorization")) {
      refreshToken().then(() => {
        resolve(cookie.get("authorization"));
      });
    } else {
      resolve(cookie.get("authorization"));
    }
  }).then((res) => {
    if (config) {
      config.headers = config.headers || {};
      config.headers.authorization = decodeURIComponent(res);
    }

    return config;
  });

});

function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return axiosInstance.get(url, config) as Promise<AxiosResponse<T>>;
}

function post<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return axiosInstance.post(url, data, config) as Promise<AxiosResponse<T>>;
}

function put<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return axiosInstance.put(url, data, config) as Promise<AxiosResponse<T>>;
}

function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return axiosInstance.delete(url, config) as Promise<AxiosResponse<T>>;
}

export default {
  get,
  post,
  put,
  del,
};
