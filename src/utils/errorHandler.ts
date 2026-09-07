import { useToast } from "@/store/toastStore";

export const handleApiError = (
  error: unknown,
  fallback = "Something went wrong"
) => {
  const apiError = error as {
    response?: { data?: { message?: unknown; error?: unknown } };
    message?: unknown;
  };
  const message =
    (typeof apiError.response?.data?.message === "string" && apiError.response.data.message) ||
    (typeof apiError.response?.data?.error === "string" && apiError.response.data.error) ||
    (typeof apiError.message === "string" && apiError.message) ||
    fallback;

  useToast.getState().showError(message);

  return message;
};
