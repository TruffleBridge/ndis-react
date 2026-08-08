import usePermissionStore from '../store/usePermissionStore';
import type { PermissionFlags } from '../types/permission';

export const usePermission = (moduleName: string): PermissionFlags => {
    // const getModulePermission = usePermissionStore((s) => s.getModulePermission);
    const permissions = usePermissionStore((s) => s.permissions);
    // const perm = getModulePermission(moduleName);
    // const loading = usePermissionStore((s) => s.loading);

    const perm = permissions.find(
        (p) => p.moduleName?.toLowerCase() === moduleName.toLowerCase()
    );


    return {
        // loading,
        canView: perm?.canView || false,
        canCreate: perm?.canCreate || false,
        canUpdate: perm?.canUpdate || false,
        canDelete: perm?.canDelete || false,
        canExport: perm?.canExport || false,
    };
};