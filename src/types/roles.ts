export interface RoleModule {
    id: number;
    moduleName: string;
}

export interface RolePermission {
    moduleId: number;
    module: string;
    actions: string[]; // e.g. ["view", "create", "update"]
}

export interface RoleDetails {
    roleId?: number;
    name: string;
    description?: string;
    accessLevel: string;
    status: boolean;
    startDate: string | null;
    endDate: string | null;
    permissions: RolePermission[];
}

export interface RoleProps {
    id: number;
    name: string;
    accessLevel: string;
    status: boolean;
    startDate: string | null;
    endDate: string | null;
}

export interface RoleListPayload {
    limit?: number;
    offset?: number;
    search?: string;
}

export interface PermissionPayload {
    moduleId: number;
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canExport: boolean;
}

export interface CreateRolePayload {
    name: string;
    description?: string;
    accessLevel?: string;
    status: boolean;
    startDate: string | null;
    endDate: string | null;
    permissions: PermissionPayload[];
}

export interface UpdateRolePayload extends CreateRolePayload {
    roleId: number;
}