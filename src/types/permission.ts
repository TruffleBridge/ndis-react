export interface PermissionRow {
  module: string;
  permissions: Record<string, boolean>;
}

export interface PermissionMatrixProps {
  title?: string;
  actions: string[];
  permissions: PermissionRow[];
  disabled?: boolean;
  onChange: (rows: PermissionRow[]) => void;
}


export interface Permission {
  id: number;
  moduleId: number;
  moduleName: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canExport: boolean;
}

export type PermissionAction =
  | 'canView'
  | 'canCreate'
  | 'canUpdate'
  | 'canDelete'
  | 'canExport';

export interface RoleData {
  id: number;
  name: string;
  description: string;
  accessLevel: string;
  status: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  permissions: Permission[];
  accessModule: string[];
}

export interface RoleApiResponse {
  status: boolean;
  message: string;
  data: RoleData;
}

export interface PermissionFlags {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canExport: boolean;
}