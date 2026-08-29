// src/store/jobDetailsStore.ts

import { create } from "zustand";

import type {
  JobDetails,
  JobDetailsApiResponse,
  JobDetailsState,
} from "@/types/jobDetails";

import { getApiRequest } from "@/api/api";
import { normalizeJobDetails } from "@/pages/jobs/utils/jobDetailsMapper";

export const useJobDetailsStore = create<JobDetailsState>((set) => ({
  jobDetails: null,
  loading: false,
  error: null,

  fetchJobDetails: async (jobId: string | number) => {
    if (!jobId) {
      set({
        jobDetails: null,
        loading: false,
        error: "Job ID is missing.",
      });

      return;
    }

    set({
      loading: true,
      error: null,
    });

    try {
      const response = await getApiRequest(
        `admin/jobManagementDetail?jobId=${encodeURIComponent(String(jobId))}`
      );

      const apiResponse = response.data as JobDetailsApiResponse;
      const payload = apiResponse?.data ?? apiResponse;
      const normalizedJobDetails = normalizeJobDetails(payload as Record<string, any>);

      if (!apiResponse?.status || !normalizedJobDetails) {
        throw new Error(
          apiResponse?.message || "Unable to load job details."
        );
      }

      set({
        jobDetails: normalizedJobDetails as JobDetails,
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while loading job details.";

      set({
        jobDetails: null,
        loading: false,
        error: message,
      });
    }
  },

  resetJobDetails: () =>
    set({
      jobDetails: null,
      loading: false,
      error: null,
    }),
}));