import { create } from "zustand";

interface ToastState {
  open: boolean;
  message: string;
  showError: (message: string) => void;
  closeToast: () => void;
}

export const useToast = create<ToastState>((set) => ({
  open: false,
  message: "",

  showError: (message) =>
    set({
      open: true,
      message,
    }),

  closeToast: () =>
    set({
      open: false,
      message: "",
    }),
}));
