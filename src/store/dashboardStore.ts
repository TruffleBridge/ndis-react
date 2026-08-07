import { create } from "zustand";
import type {
    DashboardSummary,
    LiveActivityListData,
} from "@/types/dashboard";
import { createApiRequest } from "@/api/api";
import { handleApiError } from "@/utils/errorHandler";

interface DashboardStore {
    summary: DashboardSummary | null;
    liveActivities: LiveActivityListData | null;

    liveActivityPage: number;
    liveActivityHasMore: boolean;
    liveActivityLoading: boolean;

    loading: boolean;
    error: string | null;

    getDashboardSummary: () => Promise<void>;
    getLiveActivityList: (params?: any, append?: boolean) => Promise<void>;
    loadMoreLiveActivities: () => Promise<void>;
    resetLiveActivities: () => void;
}

const LIVE_ACTIVITY_LIMIT = 10;

export const useDashboardStore = create<DashboardStore>((set, get) => ({
    summary: null,
    liveActivities: null,

    liveActivityPage: 1,
    liveActivityHasMore: true,
    liveActivityLoading: false,

    loading: false,
    error: null,

    getDashboardSummary: async () => {
        try {
            set({ loading: true, error: null });

            const response = await createApiRequest("admin/dashboard/summary", {});
            const res_ = response?.data?.data ?? response?.data;

            if (response.data.status) {
                set({
                    summary: res_,
                });
            }
        } catch (error: any) {
            const message = handleApiError(error, "Failed to fetch summary");
            set({
                error: message,
            });
        } finally {
            set({ loading: false });
        }
    },

    // append = true -> existing rows kum kuda puthu rows sethukum (infinite scroll)
    // append = false -> fresh load / reset (initial mount, filter change etc)
    getLiveActivityList: async (params = {}, append = false) => {
        try {
            set({ liveActivityLoading: true, error: null });

            const page = params?.page ?? 1;

            const response = await createApiRequest("admin/liveActivityList", {
                offset: page * 10,
                limit: LIVE_ACTIVITY_LIMIT,
            });

            const res_ = response?.data?.data ?? response?.data;

            if (response.data.status) {
                set((state) => {
                    const newRows = res_?.rows ?? [];

                    const mergedRows = append
                        ? [...(state.liveActivities?.rows ?? []), ...newRows]
                        : newRows;

                    const totalCount = res_?.totalCount ?? res_?.total;

                    let hasMore = false;

                    if (typeof totalCount === "number") {
                        hasMore = mergedRows.length < totalCount;
                    } else {
                        hasMore = newRows.length === LIVE_ACTIVITY_LIMIT;
                    }

                    return {
                        liveActivities: {
                            ...res_,
                            rows: mergedRows,
                        },
                        liveActivityPage: page,
                        liveActivityHasMore: hasMore,
                    };
                });
            }
        } catch (error: any) {
            const message = handleApiError(error, "Failed to fetch live activity list");
            set({
                error: message,
            });
        } finally {
            set({ liveActivityLoading: false });
        }
    },

    loadMoreLiveActivities: async () => {
        const { liveActivityHasMore, liveActivityLoading, liveActivityPage, getLiveActivityList } = get();

        if (!liveActivityHasMore || liveActivityLoading) return;

        const nextPage = liveActivityPage + 1;

        await getLiveActivityList({ page: nextPage }, true);
    },

    resetLiveActivities: () => {
        set({
            liveActivities: null,
            liveActivityPage: 1,
            liveActivityHasMore: true,
        });
    },
}));