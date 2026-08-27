import type { ReactNode } from "react";

export interface NavItem {
  label: string;
  path: string;
  disabled?: boolean
}

/** Route prefixes that belong to a parent nav item (longest match wins). */
const ROUTE_ALIASES: Record<string, string> = {
  "/create-worker": "/workers",
  "/create-client": "/clients",
  "/create-roles": "/roles-permission",
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/" },
  { label: "Verification Queue", path: "/verification-queue" },
  { label: "Workers", path: "/workers" },
  { label: "Jobs", path: "/jobs" },
  { label: "Clients", path: "/clients" },
  { label: "Roles and Permission", path: "/roles-permission" },
  { label: "Subscription", path: "/subscription", disabled: false },
  { label: "Bookings", path: "/bookings", disabled: true },
  { label: "Budget", path: "/budget", disabled: true },
  { label: "Rewards", path: "/rewards", disabled: true },
];

const sortedNavItems = [...NAV_ITEMS].sort(
  (a, b) => b.path.length - a.path.length,
);

/**
 * Resolve the active nav item from the current pathname.
 * Sub-routes (e.g. /create-worker) map to their parent section.
 */
export function getActiveNavItem(pathname: string): NavItem | undefined {
  const normalized = pathname.split("?")[0].split("#")[0].toLowerCase();
  const resolvedPath = ROUTE_ALIASES[normalized] ?? normalized;

  return sortedNavItems.find(
    (item) =>
      resolvedPath === item.path ||
      resolvedPath.startsWith(`${item.path}/`),
  );
}

// constants/navigation.ts (existing file la add pannunga)

// label -> API moduleName mapping (spelling mismatch handle panna)
export const NAV_MODULE_MAP: Record<string, string> = {
  Dashboard: "Dashboard",
  "Verification Queue": "Verification",
  Workers: "Workers",
  Jobs: "Jobs",
  Clients: "Clients",
  Bookings: "Bookings",
  Budget: "Budget",
  "Roles and Permission": "Roles & Permission",
  Rewards: "Rewards",
  Subscription: "Subscription", // API la illana, default hide aagum
};

/** Navbar title derived from the current route. */
export function getNavTitle(pathname: string): string {
  return getActiveNavItem(pathname)?.label ?? "Dashboard";
}

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  return getActiveNavItem(pathname)?.path === item.path;
}

export type NavIconRenderer = (active: boolean) => ReactNode;
