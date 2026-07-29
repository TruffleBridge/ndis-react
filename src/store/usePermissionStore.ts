import { create } from 'zustand';
import type {
    Permission,
    RoleData,
    PermissionAction,
} from '../types/permission';
import { getApiRequest } from '@/api/api';
import { handleApiError } from '@/utils/errorHandler';

interface PermissionState {
    role: RoleData | null;
    permissions: Permission[];
    accessModules: string[];
    loading: boolean;
    error: string | null;

    fetchRolePermissions: () => Promise<void>;
    getModulePermission: (moduleName: string) => Permission | undefined;
    hasPermission: (moduleName: string, action?: PermissionAction) => boolean;
    resetPermissions: () => void;
}

const usePermissionStore = create<PermissionState>((set, get) => ({
    role: null,
    permissions: [],
    accessModules: [],
    loading: false,
    error: null,

    fetchRolePermissions: async () => {
        set({ loading: true, error: null });
        try {
            const res = await getApiRequest('/roles/');
            const res_ = res?.data?.data ?? res?.data;
            if (res?.status) {
                set({
                    role: res.data,
                    permissions: res_?.permissions || [],
                    accessModules: res_?.accessModule || [],
                    loading: false,
                });
            } else {
                set({ loading: false, error: res_?.message || res_ || 'Failed to fetch roles' });
            }
        } catch (err: any) {
            const message = handleApiError(err ?? err?.data, "Something went wrong. Please try again.");
            set({ loading: false, error: message || 'Something went wrong' });
        }
    },

    getModulePermission: (moduleName) => {
        const { permissions } = get();
        return permissions.find(
            (p) => p.moduleName?.toLowerCase() === moduleName?.toLowerCase()
        );
    },

    hasPermission: (moduleName, action = 'canView') => {
        const perm = get().getModulePermission(moduleName);
        return perm ? !!perm[action] : false;
    },

    resetPermissions: () => set({ role: null, permissions: [], accessModules: [] }),
}));

export default usePermissionStore;