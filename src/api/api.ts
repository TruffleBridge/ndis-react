import axiosInstance from "./axios";
import type { AxiosResponse } from "axios";

// GET
export const getApiRequest = (
  url: string,
  params?: any
): Promise<AxiosResponse> => {
  return axiosInstance.get(url, { params });
};

// POST
export const createApiRequest = (
  url: string,
  payload: any
): Promise<AxiosResponse> => {
  return axiosInstance.post(url, payload);
};

// PUT
export const updateApiRequest = (
  url: string,
  payload: any
): Promise<AxiosResponse> => {
  return axiosInstance.put(url, payload);
};

// DELETE
export const deleteApiRequest = (
  url: string,
  payload?: any
): Promise<AxiosResponse> => {
  return axiosInstance.delete(url, { data: payload });
};