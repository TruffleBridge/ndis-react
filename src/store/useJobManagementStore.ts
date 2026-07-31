import { createApiRequest } from "@/api/api";
import type { JobManagement, JobProps } from "@/types/jobManagement";
import { create } from "zustand";

interface JobManagementState {
    jobs: JobProps[];
    totalCount: number;
    loading: boolean;
    error: string | null;

    fetchJobs: (payload: any) => Promise<void>;
}

const mapJobs = (rows: JobManagement[]): JobProps[] =>
    rows.map((job) => {

        return {
            id: job?.jobId,
            jobId: "J" + job?.jobId,
            avatar: job?.client.profilePicture ?? undefined,
            name: job?.client?.fullName,
            businessName: job?.businessName ?? '-',
            workerName: job?.worker?.fullName ?? "-",
            serviceType: job?.serviceType ?? "-",
            shiftTimeAndDate: job?.session,
            // serviceDate: session?.serviceDate ?? "-",
            // shiftTime: session
            //     ? `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`
            //     : "-",
            location: `${job?.location.city}, ${job?.location.state}`,
            jobStatus: job?.jobStatus,
            paymentStatus: job?.paymentStatus,
        };
    });

export const useJobManagementStore = create<JobManagementState>((set) => ({
    jobs: [],
    totalCount: 0,
    loading: false,
    error: null,

    fetchJobs: async (payload) => {
        set({ loading: true, error: null });

        try {
            const res = await createApiRequest('/admin/jobManagementList', {
                "offset": payload?.offset ?? 0,
                "limit": payload?.limit ?? 10,
                "search": payload?.search ?? "",
                ...(payload?.filter && { filters: payload?.filter })
            });

            set({
                jobs: mapJobs(res?.data?.data?.rows ?? res?.data?.rows),
                totalCount: res?.data?.data?.totalCount ?? res.data.totalCount,
                loading: false,
            });
        } catch (error: any) {
            set({
                loading: false,
                error: error.message,
            });
        }
    },
}));