import { create } from "zustand";
import { getApiRequest } from "@/api/api";

const DEFAULT_LIMIT = 5;

export interface ServiceOption {
    id: number;
    serviceCategoryId: number;
    name: string;
}

export interface AutocompleteOption {
    value: string;
    label: string;
}

interface CategoryState {
    options: ServiceOption[];
    offset: number;
    limit: number;
    hasMore: boolean;
    loading: boolean;
    search: string;
    totalCount: number;
}

/* =====================================================================
   Everything below this line (services) is UNCHANGED from the original
   ===================================================================== */

const defaultCategoryState = (): CategoryState => ({
    options: [],
    offset: 0,
    limit: DEFAULT_LIMIT,
    hasMore: true,
    loading: false,
    search: "",
    totalCount: 0,
});

/* =====================================================================
   NEW: types for languages & qualifications lookups
   ===================================================================== */

export interface LookupOption {
    id: number;
    name: string;
}

interface LookupState {
    options: LookupOption[];
    offset: number;
    limit: number;
    hasMore: boolean;
    loading: boolean;
    search: string;
    totalCount: number;
}

const defaultLookupState = (): LookupState => ({
    options: [],
    offset: 0,
    limit: 10,
    hasMore: true,
    loading: false,
    search: "",
    totalCount: 0,
});

interface LookupStore {
    // ---------- existing (services) ----------
    services: Record<number, CategoryState>;

    fetchServices: (
        serviceCategoryId: number,
        opts?: { reset?: boolean }
    ) => Promise<void>;

    queryServices: (
        serviceCategoryId: number,
        opts?: {
            search?: string;
            reset?: boolean;
        }
    ) => void;

    getOptions: (serviceCategoryId: number) => AutocompleteOption[];

    // ---------- NEW: languages ----------
    languages: LookupState;
    fetchLanguages: () => Promise<void>;
    getLanguageOptions: () => AutocompleteOption[];

    // ---------- NEW: qualifications ----------
    qualifications: LookupState;
    fetchQualifications: (opts?: { reset?: boolean }) => Promise<void>;
    queryQualifications: (opts?: { search?: string; reset?: boolean }) => void;
    getQualificationOptions: () => AutocompleteOption[];
}

export const useLookupStore = create<LookupStore>((set, get) => ({
    services: {},

    fetchServices: async (serviceCategoryId, opts) => {
        const reset = opts?.reset ?? false;

        const current =
            get().services[serviceCategoryId] ?? defaultCategoryState();

        if (current.loading) return;

        if (!reset && !current.hasMore) return;

        const offset = reset ? 0 : current.offset;

        set((state) => ({
            services: {
                ...state.services,
                [serviceCategoryId]: {
                    ...current,
                    loading: true,
                },
            },
        }));

        try {
            const response = await getApiRequest("lookup/getServices", {
                offset,
                limit: current.limit,
                serviceCategoryId,
                ...(current.search ? { search: current.search } : {}),
            });

            const fetched: ServiceOption[] = response.data?.data ?? [];

            const totalCount = response.data?.totalCount ?? 0;

            set((state) => {
                const previous =
                    state.services[serviceCategoryId] ?? defaultCategoryState();

                const mergedOptions = reset
                    ? fetched
                    : [...previous.options, ...fetched];

                const newOffset = offset + fetched.length;

                return {
                    services: {
                        ...state.services,
                        [serviceCategoryId]: {
                            ...previous,
                            options: mergedOptions,
                            offset: newOffset,
                            totalCount,
                            hasMore: newOffset < totalCount,
                            loading: false,
                        },
                    },
                };
            });
        } catch (error) {
            set((state) => ({
                services: {
                    ...state.services,
                    [serviceCategoryId]: {
                        ...(state.services[serviceCategoryId] ??
                            defaultCategoryState()),
                        loading: false,
                    },
                },
            }));
        }
    },

    queryServices: (serviceCategoryId, opts) => {
        const current =
            get().services[serviceCategoryId] ?? defaultCategoryState();

        const searchChanged =
            opts?.search !== undefined && opts.search !== current.search;

        if (searchChanged) {
            set((state) => ({
                services: {
                    ...state.services,
                    [serviceCategoryId]: {
                        ...current,
                        search: opts.search ?? "",
                        offset: 0,
                        hasMore: true,
                    },
                },
            }));
        }

        get().fetchServices(serviceCategoryId, {
            reset: opts?.reset || searchChanged,
        });
    },

    getOptions: (serviceCategoryId) => {
        const state = get().services[serviceCategoryId];

        if (!state) return [];

        return state.options.map((item) => ({
            value: String(item.id),
            label: item.name,
        }));
    },

    /* =================================================================
       NEW: languages (api/lookup/getLanguages) - single call, no paging
       ================================================================= */
    languages: defaultLookupState(),

    fetchLanguages: async () => {
        const current = get().languages;

        if (current.loading) return;
        if (current.options.length > 0) return; // already loaded once

        set((state) => ({
            languages: { ...state.languages, loading: true },
        }));

        try {
            const response = await getApiRequest("lookup/getLanguages");

            const fetched: LookupOption[] =
                response.data?.data?.languages ?? [];

            set((state) => ({
                languages: {
                    ...state.languages,
                    options: fetched,
                    totalCount: fetched.length,
                    hasMore: false,
                    loading: false,
                },
            }));
        } catch (error) {
            set((state) => ({
                languages: { ...state.languages, loading: false },
            }));
        }
    },

    getLanguageOptions: () => {
        return get().languages.options.map((item) => ({
            value: String(item.id),
            label: item.name,
        }));
    },

    /* =================================================================
       NEW: qualifications (api/lookup/getQualification) - paginated
       ================================================================= */
    qualifications: defaultLookupState(),

    fetchQualifications: async (opts) => {
        const reset = opts?.reset ?? false;
        const current = get().qualifications;

        if (current.loading) return;
        if (!reset && !current.hasMore) return;

        const offset = reset ? 0 : current.offset;

        set((state) => ({
            qualifications: { ...state.qualifications, loading: true },
        }));

        try {
            const response = await getApiRequest("lookup/getQualification", {
                offset,
                limit: current.limit,
                ...(current.search ? { search: current.search } : {}),
            });

            const fetched: LookupOption[] = response.data?.data ?? [];
            const totalCount: number = response.data?.totalCount ?? 0;
            const newOffset = offset + fetched.length;

            set((state) => {
                const previous = state.qualifications;

                const mergedOptions = reset
                    ? fetched
                    : [...previous.options, ...fetched];

                return {
                    qualifications: {
                        ...previous,
                        options: mergedOptions,
                        offset: newOffset,
                        totalCount,
                        hasMore: newOffset < totalCount,
                        loading: false,
                    },
                };
            });
        } catch (error) {
            set((state) => ({
                qualifications: { ...state.qualifications, loading: false },
            }));
        }
    },

    queryQualifications: (opts) => {
        const current = get().qualifications;

        const searchChanged =
            opts?.search !== undefined && opts.search !== current.search;

        if (searchChanged) {
            set(() => ({
                qualifications: {
                    ...current,
                    search: opts.search ?? "",
                    offset: 0,
                    hasMore: true,
                },
            }));
        }

        get().fetchQualifications({
            reset: opts?.reset || searchChanged,
        });
    },

    getQualificationOptions: () => {
        return get().qualifications.options.map((item) => ({
            value: String(item.id),
            label: item.name,
        }));
    },
}));