import { create } from "zustand";
import type { JobDetailsState } from "@/types/jobDetails";
import { getApiRequest } from "@/api/api";

export const useJobDetailsStore = create<JobDetailsState>((set) => ({
  jobDetails: null,
  loading: false,
  error: null,

  fetchJobDetails: async (jobId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await getApiRequest(`jobDetails/${jobId}`);
      set({ jobDetails: response.data, loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Something went wrong while loading job details.",
        loading: false,
      });
    }
  },

  resetJobDetails: () => set({ jobDetails: null, error: null, loading: false }),
}));
