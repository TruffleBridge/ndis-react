// src/store/auditStore.ts
import { create } from "zustand";

// ⚠️ Adjust this import to match your project's existing axios instance path.

import type {
    AuditLogItem,
    AuditLogFilters,
    AuditPagination,
} from "@/types/audit";
import { getApiRequest } from "@/api/api";
import { handleApiError } from "@/utils/errorHandler";

const DEFAULT_PAGINATION: AuditPagination = {
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
};

interface AuditStoreState {
    // Flow 1 — global logs
    auditLogs: AuditLogItem[];
    pagination: AuditPagination;
    filters: AuditLogFilters;
    loading: boolean;
    error: string | null;

    // Flow 2 — entity history
    entityHistory: AuditLogItem[];
    entityHistoryLoading: boolean;
    entityHistoryError: string | null;

    // Flow 3 — user history
    userHistory: AuditLogItem[];
    userHistoryLoading: boolean;
    userHistoryError: string | null;

    // Actions
    setFilters: (filters: Partial<AuditLogFilters>) => void;
    resetFilters: () => void;
    fetchAuditLogs: (overrideFilters?: Partial<AuditLogFilters>) => Promise<void>;
    fetchEntityHistory: (entityType: string, entityId: number | string) => Promise<void>;
    fetchUserHistory: (userId: number | string) => Promise<void>;
    clearEntityHistory: () => void;
    clearUserHistory: () => void;
}

const INITIAL_FILTERS: AuditLogFilters = {
    page: 1,
    limit: 20,
};

export const useAuditStore = create<AuditStoreState>((set, get) => ({
    auditLogs: [],
    pagination: DEFAULT_PAGINATION,
    filters: INITIAL_FILTERS,
    loading: false,
    error: null,

    entityHistory: [],
    entityHistoryLoading: false,
    entityHistoryError: null,

    userHistory: [],
    userHistoryLoading: false,
    userHistoryError: null,

    setFilters: (filters) => {
        set((state) => ({
            filters: { ...state.filters, ...filters },
        }));
    },

    resetFilters: () => set({ filters: INITIAL_FILTERS }),

    // ---- FLOW 1: GET /api/admin/auditLogs ----
    fetchAuditLogs: async (overrideFilters) => {
        const mergedFilters = { ...get().filters, ...overrideFilters };
        set({ loading: true, error: null, filters: mergedFilters });

        try {
            const response = await getApiRequest(
                "admin/auditLogs",
                { mergedFilters }
            );

            const { items, pagination } = response?.data?.data ?? response?.data;

            set({
                auditLogs: items,
                pagination,
                loading: false,
            });
        } catch (err: any) {
            const message = handleApiError(err, "Failed to fetch audit logs");
            set({
                loading: false,
                error: message,
            });
        }
    },

    // ---- FLOW 2: GET /api/admin/auditLogs/entity/{entityType}/{entityId} ----
    fetchEntityHistory: async (entityType, entityId) => {
        set({ entityHistoryLoading: true, entityHistoryError: null });

        try {
            const response = await getApiRequest(`admin/auditLogs/entity/${entityType}/${entityId}`);

            set({
                entityHistory: response.data.data.items,
                entityHistoryLoading: false,
            });
        } catch (err: any) {
            const message = handleApiError(err, "Failed to fetch entity history");
            set({
                entityHistoryLoading: false,
                entityHistoryError: message,
            });
        }
    },

    // ---- FLOW 3: GET /api/admin/auditLogs/user/{userId} ----
    fetchUserHistory: async (userId) => {
        set({ userHistoryLoading: true, userHistoryError: null });

        try {
            const response = await getApiRequest(`admin/auditLogs/user/${userId}`);

            set({
                userHistory: response.data.data.items,
                userHistoryLoading: false,
            });
        } catch (err: any) {
            const message = handleApiError(err, "Failed to fetch user history");
            set({
                userHistoryLoading: false,
                userHistoryError: message,
            });
        }
    },

    clearEntityHistory: () => set({ entityHistory: [], entityHistoryError: null }),
    clearUserHistory: () => set({ userHistory: [], userHistoryError: null }),
}));