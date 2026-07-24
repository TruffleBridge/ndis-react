import { create } from "zustand";
import dayjs from "dayjs";
import {
    createApiRequest,
    deleteApiRequest,
    getApiRequest,
    updateApiRequest,
} from "@/api/api";
import type {
    RoleListPayload,
    RoleProps,
    RoleModule,
    RoleDetails,
    CreateRolePayload,
    UpdateRolePayload,
    FormErrors,
} from "@/types/roles";
import { handleApiError } from "@/utils/errorHandler";

export type Option = { label: string; value: string };

export interface PermissionRow {
    module: string;
    moduleId?: number;
    permissions: Record<string, boolean>;
}

// Single source of truth for the matrix columns.
// "Edit" here maps to canUpdate on the API side (see ACTION_KEY_MAP).
export const PERMISSION_ACTIONS = ["View", "Create", "Edit", "Delete", "Export"] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

const ACTION_KEY_MAP: Record<PermissionAction, keyof any> = {
    View: "canView",
    Create: "canCreate",
    Edit: "canUpdate",
    Delete: "canDelete",
    Export: "canExport",
};

export const STATUS_OPTIONS: Option[] = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
];

interface RoleFormData {
    roleName: string;
    status: Option | null;
    startDate: Date | null;
    endDate: Date | null;
    selectedModules: Option[];
    permissions: PermissionRow[];
}

const emptyForm: RoleFormData = {
    roleName: "",
    status: null,
    startDate: null,
    endDate: null,
    selectedModules: [],
    permissions: [],
};

// Builds one fresh matrix row for a selected module.
// If `prefill` is passed (from an already-fetched role), checks the boxes that were true.
const buildPermissionRow = (
    opt: Option,
    prefill?: { moduleId: number; module: string; actions: PermissionAction[] }
): PermissionRow => {
    const checked = new Set(prefill?.actions ?? []);
    return {
        module: opt.label,
        moduleId: Number(opt.value),
        permissions: PERMISSION_ACTIONS.reduce(
            (acc, action) => ({ ...acc, [action]: checked.has(action) }),
            {} as Record<string, boolean>
        ),
    };
};

const buildPermissionPayload = (permissions: PermissionRow[]) =>
    permissions.map((row) => {
        const payload: Record<string, any> = { moduleId: row.moduleId! };
        PERMISSION_ACTIONS.forEach((action) => {
            payload[ACTION_KEY_MAP[action] as string] = row.permissions[action] || false;
        });
        return payload;
    });

interface RoleStore {
    roles: RoleProps[];
    modules: RoleModule[];
    roleDetails: RoleDetails | null;
    totalCount: number;

    form: RoleFormData;
    // raw checked-actions per module from the fetched role — used only to
    // rebuild matrix rows correctly when selectedModules changes
    prefillPermissions:
    | { moduleId: number; module: string; actions: PermissionAction[] }[]
    | null;

    listLoading: boolean;
    modulesLoading: boolean;
    detailsLoading: boolean;
    submitting: boolean;
    deletingId: number | null;

    error: string | null;

    getRoles: (payload: RoleListPayload) => Promise<void>;
    getModules: () => Promise<void>;
    getRoleById: (id: number) => Promise<void>;
    resetRoleDetails: () => void;

    setRoleName: (name: string) => void;
    setStatus: (status: Option | null) => void;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    setSelectedModules: (modules: Option[]) => void;
    setPermissions: (rows: PermissionRow[]) => void;
    resetForm: () => void;

    createRole: () => Promise<boolean>;
    updateRole: (roleId: number) => Promise<boolean>;
    deleteRole: (id: number) => Promise<boolean>;

    clearError: () => void;
    formErrors: FormErrors;

    validateForm: () => boolean;
    clearFieldError: (field: keyof FormErrors) => void;
}

export const useRoles = create<RoleStore>((set, get) => ({
    roles: [],
    modules: [],
    roleDetails: null,
    totalCount: 0,

    form: emptyForm,
    prefillPermissions: null,

    listLoading: false,
    modulesLoading: false,
    detailsLoading: false,
    submitting: false,
    deletingId: null,

    error: null,
    formErrors: {},

    validateForm: () => {
        const { form } = get();

        const errors: FormErrors = {};

        if (!form.roleName.trim()) {
            errors.roleName = "Role name is required";
        }

        if (!form.status) {
            errors.status = "Status is required";
        }

        if (form.selectedModules.length === 0) {
            errors.selectedModules = "Select at least one module";
        }

        const hasInvalidPermission = form.permissions.some((row) =>
            !Object.values(row.permissions).some(Boolean)
        );

        if (hasInvalidPermission) {
            errors.permissions =
                "Select at least one permission for every module";
        }

        set({ formErrors: errors });

        return Object.keys(errors).length === 0;
    },

    clearFieldError: (field) =>
        set((state) => ({
            formErrors: {
                ...state.formErrors,
                [field]: undefined,
            },
        })),


    getRoles: async (payload) => {
        try {
            set({ listLoading: true, error: null });
            const res = await createApiRequest("/roles/list", payload);
            if (res.data.status) {
                set({
                    roles: res.data.data.rows,
                    totalCount: res.data.data.totalCount,
                });
            }
        } catch (error: any) {
            set({ error: error?.message ?? "Failed to fetch roles" });
        } finally {
            set({ listLoading: false });
        }
    },

    getModules: async () => {
        if (get().modules.length) return;
        try {
            set({ modulesLoading: true, error: null });
            const res = await getApiRequest("/roles/modules");
            if (res.data.status) {
                set({ modules: res.data.data });
            }
        } catch (error: any) {
            set({ error: error?.message ?? "Failed to fetch modules" });
        } finally {
            set({ modulesLoading: false });
        }
    },

    getRoleById: async (id) => {
        try {
            set({ detailsLoading: true, error: null });
            const res = await getApiRequest(`/roles/${id}`);
            if (res.data.status) {
                const roleDetails: RoleDetails = res.data.data;

                const prefillPermissions =
                    (roleDetails.permissions ?? []).map((p: any) => ({
                        moduleId: p.moduleId,
                        module: p.moduleName,
                        actions: PERMISSION_ACTIONS.filter(
                            (action) => !!p[ACTION_KEY_MAP[action] as string]
                        ),
                    })) ?? [];

                const selectedModules: Option[] = prefillPermissions.map((p) => ({
                    label: p.module,
                    value: String(p.moduleId),
                }));

                const permissions: PermissionRow[] = prefillPermissions.map((p) =>
                    buildPermissionRow({ label: p.module, value: String(p.moduleId) }, p)
                );

                set({
                    roleDetails,
                    prefillPermissions,
                    form: {
                        roleName: roleDetails.name,
                        status: {
                            label: roleDetails.status ? "Active" : "Inactive",
                            value: String(roleDetails.status),
                        },
                        startDate: roleDetails.startDate ? new Date(roleDetails.startDate) : null,
                        endDate: roleDetails.endDate ? new Date(roleDetails.endDate) : null,
                        selectedModules,
                        permissions,
                    },
                });
            }
        } catch (error: any) {
            set({ error: error?.message ?? "Failed to fetch role" });
        } finally {
            set({ detailsLoading: false });
        }
    },

    resetRoleDetails: () =>
        set({ roleDetails: null, prefillPermissions: null, form: emptyForm }),

    setRoleName: (roleName) =>
        set((state) => ({
            form: { ...state.form, roleName },
            formErrors: {
                ...state.formErrors,
                roleName: undefined,
            },
        })),

    setStatus: (status) =>
        set((state) => ({
            form: { ...state.form, status },
            formErrors: {
                ...state.formErrors,
                status: undefined,
            },
        })),

    setStartDate: (startDate) =>
        set((state) => ({ form: { ...state.form, startDate } })),

    setEndDate: (endDate) =>
        set((state) => ({ form: { ...state.form, endDate } })),

    // Keeps rows still selected, drops deselected, adds newly selected —
    // merging in prefill checks if this role/module was previously fetched.
    setSelectedModules: (selectedModules) => {
        const { form, prefillPermissions } = get();
        const selectedIds = new Set(selectedModules.map((m) => Number(m.value)));

        const kept = form.permissions.filter(
            (r) => r.moduleId != null && selectedIds.has(r.moduleId)
        );
        const keptIds = new Set(kept.map((r) => r.moduleId));

        const added = selectedModules
            .filter((opt) => !keptIds.has(Number(opt.value)))
            .map((opt) =>
                buildPermissionRow(
                    opt,
                    prefillPermissions?.find((p) => p.moduleId === Number(opt.value))
                )
            );

        set({
            form: {
                ...form,
                selectedModules,
                permissions: [...kept, ...added],
            },
            formErrors: {
                ...get().formErrors,
                selectedModules: undefined,
            },
        });
    },

    setPermissions: (permissions) =>
        set((state) => ({
            form: { ...state.form, permissions },
            formErrors: {
                ...state.formErrors,
                permissions: undefined,
            },
        })),

    resetForm: () => set({
        form: emptyForm,
        prefillPermissions: null,
        formErrors: {},
    }),

    createRole: async () => {
        if (!get().validateForm()) {
            return false;
        }
        const { form, modules } = get();
        try {
            set({ submitting: true, error: null });
            const payload = {
                name: form.roleName,
                status: form.status?.value === "true",
                description: "",
                accessLevel:
                    modules.length === form.selectedModules.length ? "FULL" : "LIMITED",
                ...(form.startDate && {
                    startDate: dayjs(form.startDate).format("YYYY-MM-DD"),
                }),

                ...(form.endDate && {
                    endDate: dayjs(form.endDate).format("YYYY-MM-DD"),
                }),

                permissions: buildPermissionPayload(form.permissions),
            } as CreateRolePayload;


            const res = await createApiRequest("/roles/create", payload);
            return !!res.data.status;
        } catch (error: any) {
            const message = handleApiError(error, "Failed to create role");
            set({ error: message ?? "Failed to create role" });
            return false;
        } finally {
            set({ submitting: false });
        }
    },

    updateRole: async (roleId) => {
        if (!get().validateForm()) {
            return false;
        }
        const { form, modules, roleDetails } = get();
        try {
            set({ submitting: true, error: null });
            const payload = {
                // ...roleDetails,
                roleId,
                description: roleDetails?.description ?? '',
                name: form.roleName,
                status: form.status?.value === "true",
                accessLevel:
                    modules.length === form.selectedModules.length ? "FULL" : "LIMITED",
                ...(form.startDate && {
                    startDate: dayjs(form.startDate).format("YYYY-MM-DD"),
                }),

                ...(form.endDate && {
                    endDate: dayjs(form.endDate).format("YYYY-MM-DD"),
                }),
                permissions: buildPermissionPayload(form.permissions),
            } as UpdateRolePayload;

            const res = await updateApiRequest("/roles/update", payload);
            return !!res.data.status;
        } catch (error: any) {
            const message = handleApiError(error, "Failed to update role");
            set({ error: message ?? "Failed to update role" });
            return false;
        } finally {
            set({ submitting: false });
        }
    },

    deleteRole: async (id) => {
        try {
            set({ deletingId: id, error: null });
            const res = await deleteApiRequest("/roles", { roleId: id });
            if (res.data.status) {
                set((state) => ({ roles: state.roles.filter((r) => r.id !== id) }));
            }
            return !!res.data.status;
        } catch (error: any) {
            const message = handleApiError(error, "Failed to delete role");
            set({ error: message ?? "Failed to delete role" });
            return false;
        } finally {
            set({ deletingId: null });
        }
    },

    clearError: () => set({ error: null }),
}));