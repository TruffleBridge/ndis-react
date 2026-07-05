import type { PermissionRow } from "../types/permission";

export const PERMISSION_ACTIONS = [
  "View",
  "Create",
  "Edit",
  "Delete",
  "Export",
];

export const PERMISSION_DATA: PermissionRow[] = [
  {
    module: "Dashboard",
    permissions: {
      View: true,
      Create: false,
      Edit: true,
      Delete: true,
      Export: false,
    },
  },
  {
    module: "Verification",
    permissions: {
      View: true,
      Create: true,
      Edit: true,
      Delete: true,
      Export: false,
    },
  },
  {
    module: "Workers",
    permissions: {
      View: true,
      Create: true,
      Edit: false,
      Delete: false,
      Export: false,
    },
  },
  {
    module: "Clients",
    permissions: {
      View: false,
      Create: true,
      Edit: false,
      Delete: true,
      Export: true,
    },
  },
  {
    module: "Jobs",
    permissions: {
      View: true,
      Create: false,
      Edit: true,
      Delete: false,
      Export: false,
    },
  },
  {
    module: "Bookings",
    permissions: {
      View: true,
      Create: true,
      Edit: true,
      Delete: false,
      Export: true,
    },
  },
  {
    module: "Budget",
    permissions: {
      View: true,
      Create: true,
      Edit: false,
      Delete: true,
      Export: false,
    },
  },
  {
    module: "Roles and Permissions",
    permissions: {
      View: false,
      Create: true,
      Edit: true,
      Delete: true,
      Export: true,
    },
  },
  {
    module: "Rewards",
    permissions: {
      View: true,
      Create: false,
      Edit: true,
      Delete: false,
      Export: false,
    },
  },
  {
    module: "Subscription",
    permissions: {
      View: false,
      Create: true,
      Edit: false,
      Delete: false,
      Export: true,
    },
  },
];