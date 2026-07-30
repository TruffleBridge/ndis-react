import { create } from "zustand";
import type { NotificationData } from "@/types/notification";
import { createApiRequest, updateApiRequest } from "@/api/api";

const LIMIT = 10;

interface NotificationState {
    notifications: NotificationData[];
    totalCount: number;
    offset: number;
    limit: number;
    search: string;
    loading: boolean;
    hasMore: boolean;
    error: string | null;

    fetchNotifications: (reset?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    setSearch: (search: string) => void;
    markAsRead: (id: string | number) => Promise<void>;
    reset: () => void;
}

const initialState = {
    notifications: [] as NotificationData[],
    totalCount: 0,
    offset: 0,
    limit: LIMIT,
    search: "",
    loading: false,
    hasMore: true,
    error: null as string | null,
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
    ...initialState,

    fetchNotifications: async (reset = false) => {
        if (get().loading) return; // prevent duplicate calls
        const offset = reset ? 0 : get().offset;
        set({ loading: true, error: null });
        try {
            const res = await createApiRequest('/notification/list', { offset, limit: get().limit });
            const res_ = res?.data?.data ?? res?.data
            if (!res.status) throw new Error(res_?.message);

            const { result, totalCount } = res_;
            const mappedNotifications = result.map((item: any) => ({
                id: item.id,
                title: item.notification?.eventMaster?.name ?? "",
                message: item.notification?.message ?? "",
                isRead: item.readStatus,
                createdAt: item.createdAt,
                metadata: item.notification?.metadata,
            }));
            set((state) => ({
                notifications: reset
                    ? mappedNotifications
                    : [...state.notifications, ...mappedNotifications],
                totalCount,
                offset: offset + result.length,
                hasMore: result.length === state.limit, // stop when API returns < limit
                loading: false,
            }));
        } catch (err: any) {
            set({ loading: false, error: err.message ?? "Failed to fetch notifications" });
        }
    },

    loadMore: async () => {
        const { hasMore, loading } = get();
        if (!hasMore || loading) return;
        await get().fetchNotifications(false);
    },

    setSearch: (search) => {
        set({ search, offset: 0, hasMore: true, notifications: [] });
        get().fetchNotifications(true);
    },

    markAsRead: async (id) => {
        // optimistic update
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            ),
        }));
        try {
            const res = await updateApiRequest('/notification/updateReadStatus', {
                "notificationId": id,
                "readStatus": true
            });
            const res_ = res?.data?.data ?? res?.data

            if (!res.status) throw new Error(res_?.message);
        } catch (err) {
            // rollback if API rejects (e.g. "Notification not found")
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, isRead: false } : n
                ),
            }));
            console.error(err);
        }
    },

    reset: () => set(initialState),
}));