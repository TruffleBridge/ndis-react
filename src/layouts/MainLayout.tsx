import { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { SideNavbar, TopNavbar } from "@/components";
import { layoutStyles as S } from "./styles";
import { MOBILE_NAV_QUERY } from "@/constants/breakpoints";
import usePermissionStore from '@/store/usePermissionStore';
import NotificationParent from "./components/notificationparent";
import { useProfileStore } from "@/store/useProfilestore";
import { useAuthStore } from "@/store/auth";


const COLLAPSED_WIDTH = 72;

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobileNav = useMediaQuery(MOBILE_NAV_QUERY);
  const location = useLocation();

  useEffect(() => {
    if (isMobileNav) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobileNav]);

  const fetchRolePermissions = usePermissionStore((s) => s.fetchRolePermissions);
  const initForm = useProfileStore((s) => s.initForm);


  const accessToken = useAuthStore((s) => s.accessToken);
  useEffect(() => {
    if (accessToken) {
      fetchRolePermissions();
    }
  }, [accessToken, fetchRolePermissions]);

  useEffect(() => {
    initForm();
  }, [initForm])


  return (
    <Box sx={S.root}>
      <SideNavbar
        open={sidebarOpen}
        onToggle={setSidebarOpen}
        isMobileNav={isMobileNav}
      />

      <Box
        sx={{
          ...S.main,
          ml: isMobileNav ? 0 : `${COLLAPSED_WIDTH}px`,
        }}
      >
        <TopNavbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          notificationChildren={
            <NotificationParent />
          }
        />

        <Box sx={S.content}>
          <div>
            <Outlet />
          </div>
        </Box>
      </Box>
    </Box>
  );
}
