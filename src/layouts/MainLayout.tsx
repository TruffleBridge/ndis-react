import { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
import { SideNavbar, TopNavbar } from "@/components";
import { layoutStyles as S } from "./styles";
import { MOBILE_NAV_QUERY } from "@/constants/breakpoints";
import { Outlet } from "react-router-dom";

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
