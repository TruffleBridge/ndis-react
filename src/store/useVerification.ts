import { create } from "zustand";
import { createApiRequest } from "../api/api";
import type {
    VerificationQueueItem, VerificationQueuePayload
} from "../types/verificationQueue";

interface VerificationQueueStore {
    loading: boolean;
    workers: VerificationQueueItem[];
    total: number;

    getVerificationQueue: (
        payload: VerificationQueuePayload
    ) => Promise<void>;
}

export const useVerificationQueueStore =
    create<VerificationQueueStore>((set) => ({
        loading: false,
        workers: [],
        total: 0,

        getVerificationQueue: async (payload) => {
            try {
                set({ loading: true });

                const res = await createApiRequest(
                    "/admin/verificationQueue",
                    payload
                );

                set({
                    workers: res.data.data,
                    total: res.data.total,
                });
            } catch (err) {
                console.log(err);
            } finally {
                set({
                    loading: false,
                });
            }
        },
    }));