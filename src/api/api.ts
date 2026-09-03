import axiosInstance from "./axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

// GET
export const getApiRequest = (
  url: string,
  params?: Record<string, unknown>
): Promise<AxiosResponse> => {
  return axiosInstance.get(url, { params });
};


// POST
export const createApiRequest = (
  url: string,
  payload: unknown,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return axiosInstance.post(url, payload, config);
};


// PUT
export const updateApiRequest = (
  url: string,
  payload: unknown
): Promise<AxiosResponse> => {
  return axiosInstance.put(url, payload);
};


// DELETE
export const deleteApiRequest = (
  url: string,
  payload?: unknown
): Promise<AxiosResponse> => {
  return axiosInstance.delete(url, { data: payload });
};