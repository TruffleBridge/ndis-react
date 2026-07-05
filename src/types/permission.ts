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