import { useToast } from "@/store/toastStore";

export const handleApiError = (
  error: any,
  fallback = "Something went wrong"
) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

  useToast.getState().showError(message);

  return message;
};
