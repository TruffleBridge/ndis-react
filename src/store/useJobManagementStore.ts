import { createApiRequest } from "@/api/api";
import type { JobManagement, JobProps } from "@/types/jobManagement";
import { create } from "zustand";

interface JobManagementState {
    jobs: JobProps[];
    totalCount: number;
    loading: boolean;
    error: string | null;

    fetchJobs: () => Promise<void>;
}

const formatTime = (time: string) =>
    new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

const mapJobs = (rows: JobManagement[]): JobProps[] =>
    rows.map((job) => {
        const session = job.session[0];

        return {
            jobId: job.jobId,
            avatar: job.client.profilePicture ?? undefined,
            name: job.client.fullName,
            workerName: job.worker?.fullName ?? "-",
            serviceType: job.serviceType ?? "-",
            serviceDate: session?.serviceDate ?? "-",
            shiftTime: session
                ? `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`
                : "-",
            location: `${job.location.city}, ${job.location.state}`,
            jobStatus: job.jobStatus,
            paymentStatus: job.paymentStatus,
        };
    });

export const useJobManagementStore = create<JobManagementState>((set) => ({
    jobs: [],
    totalCount: 0,
    loading: false,
    error: null,

    fetchJobs: async () => {
        set({ loading: true, error: null });

        try {
            const res = await createApiRequest('/admin/jobManagementList', {});

            set({
                jobs: mapJobs(res.data.rows),
                totalCount: res.data.totalCount,
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