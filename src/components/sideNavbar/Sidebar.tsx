import React from "react";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ClientIcon,
  WorkerIcon,
  VerificationIcon,
  LogoSupportIcon,
  JobIcon,
  BookingIcon,
  BudgetIcon,
  RoleIcon,
  HomeIcon,
  SubscriptionIcon,
  RewardIcon,
} from "@/assets/index";
import { sidebarStyles as S } from "@/components/topNavbar/styles";
import {
  NAV_ITEMS,
  NAV_MODULE_MAP,
  isNavItemActive,
  type NavIconRenderer,
} from "@/constants/navigation";
import usePermissionStore from "@/store/usePermissionStore";
import { useAuthStore } from "@/store/auth";

export const COLLAPSED_WIDTH = 72;
export const EXPANDED_WIDTH = 248;

interface NavItemWithIcon {
  label: string;
  icon: NavIconRenderer;
  path: string;
  disabled?: boolean;
}

export interface SideNavbarProps {
  open?: boolean;
  onToggle?: (next: boolean) => void;
  isMobileNav?: boolean;
}

const NAV_ITEMS_WITH_ICONS: NavItemWithIcon[] = NAV_ITEMS.map((item) => {
  const iconMap: Record<string, NavIconRenderer> = {
    Dashboard: (a) => <HomeIcon color={a ? "#fff" : "#222124"} />,
    "Verification Queue": (a) => <VerificationIcon color={a ? "#fff" : "#222124"} />,
    Workers: (a) => <WorkerIcon color={a ? "#fff" : "#222124"} />,
    Jobs: (a) => <JobIcon color={a ? "#fff" : "#222124"} />,
    Clients: (a) => <ClientIcon color={a ? "#fff" : "#222124"} />,
    Bookings: (a) => <BookingIcon color={a ? "#fff" : "#222124"} />,
    Budget: (a) => <BudgetIcon color={a ? "#fff" : "#222124"} />,
    "Roles and Permission": (a) => <RoleIcon color={a ? "#fff" : "#222124"} />,
    Rewards: (a) => <RewardIcon color={a ? "#fff" : "#222124"} />,
    Subscription: (a) => <SubscriptionIcon color={a ? "#fff" : "#222124"} />,
  };

  return {
    ...item,
    icon: iconMap[item.label] ?? (() => null),
  };
});

export const SideNavbar = ({
  open: openProp,
  onToggle,
  isMobileNav = false,
}: SideNavbarProps) => {
  const [openState, setOpenState] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // 🔑 permissions store 
  const permissions = usePermissionStore((s) => s.permissions);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const fetchRolePermissions = usePermissionStore((s) => s.fetchRolePermissions);


  const isControlled = openProp !== undefined;
  const open = isControlled ? (openProp as boolean) : openState;

  const setOpen = (next: boolean) => {
    if (!isControlled) setOpenState(next);
    onToggle?.(next);
  };

  const isDrawerOpen = open;
  const railWidth = isMobileNav
    ? EXPANDED_WIDTH
    : open
      ? EXPANDED_WIDTH
      : COLLAPSED_WIDTH;
  const showLabels = isMobileNav ? isDrawerOpen : open;

  // 🔑 canView false ah irukura modules ah filter panni remove pannurom
  const visibleNavItems = React.useMemo(() => {
    debugger;
    return NAV_ITEMS_WITH_ICONS.filter((item) => {
      const moduleName = NAV_MODULE_MAP[item.label] ?? item.label;
      const perm = permissions.find(
        (p) => p.moduleName?.toLowerCase() === moduleName.toLowerCase()
      );
      return perm?.canView === true;
    });
  }, [permissions]);

  const handleSideRoute = async (e: any, item: any) => {
    debugger;
    e.stopPropagation();
    setOpen(false);
    navigate(item.path);
    const res_ = await refreshToken();
    if (res_) {
      return fetchRolePermissions();
    }
  }

  return (
    <>
      {isMobileNav && isDrawerOpen && (
        <Box onClick={() => setOpen(false)} sx={S.mobileOverlay} />
      )}

      {!isMobileNav && open && (
        <Box onClick={() => setOpen(false)} sx={S.overlay} />
      )}

      <Box
        onMouseLeave={() => !isControlled && !isMobileNav && open && setOpen(false)}
        sx={{
          ...S.rail,
          width: railWidth,
          transform: isMobileNav && !isDrawerOpen ? "translateX(-100%)" : "translateX(0)",
          boxShadow: isDrawerOpen ? "0 12px 32px rgba(0,0,0,.18)" : "none",
          transition: (t) =>
            t.transitions.create(["width", "box-shadow", "transform"], {
              easing: t.transitions.easing.easeInOut,
              duration: 300,
            }),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: showLabels ? "space-between" : "center",
            px: showLabels ? 2 : 0,
            height: 72,
            flexShrink: 0,
          }}
        >
          <Box sx={S.brandBox}>
            <LogoSupportIcon />
            {showLabels && (
              <Typography component="span" sx={S.brandName}>
                Nimora
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ borderColor: theme.palette.custom?.[300] ?? "#E6E6E6" }} />

        <Box
          onClick={() => !isMobileNav && !open && setOpen(true)}
          sx={S.navScrollArea}
        >
          <List sx={{ px: showLabels ? 1 : 0.75 }}>
            {visibleNavItems.map((item) => {
              const active = isNavItemActive(location.pathname, item);

              return (
                <ListItemButton
                  key={item.path}
                  selected={active}
                  onClick={(e) => handleSideRoute(e, item)}
                  disabled={item?.disabled}
                  sx={{
                    ...(active ? S.navItemActive : S.navItemInactive),
                    width: showLabels ? "100%" : "80%",
                    justifyContent: showLabels ? "flex-start" : "center",
                    px: showLabels ? 1.5 : 0,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: showLabels ? 1.5 : 0,
                      justifyContent: "center",
                      color: "inherit",
                    }}
                  >
                    {item.icon(active)}
                  </ListItemIcon>

                  {showLabels && (
                    <Typography
                      component="span"
                      sx={{
                        ...S.navLabel,
                        color: active ? "#FFFFFF" : "#222124",
                      }}
                    >
                      {item.label}
                    </Typography>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Box>
    </>
  );
};