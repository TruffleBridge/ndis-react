import type { SxProps, Theme } from "@mui/material";
import { ABOVE_MOBILE_NAV_QUERY } from "../../constants/breakpoints";

export const sidebarStyles: Record<string, SxProps<Theme>> = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: (theme: Theme) => theme.zIndex.drawer,
    backgroundColor: "transparent",
  },

  mobileOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: (theme: Theme) => theme.zIndex.drawer,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  rail: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    bgcolor: "#fff",
    borderRight: "1px solid #E6E6E6",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
  },

  brandBox: {
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    minWidth: 0,
  },

  brandName: {
    color: (theme: Theme) => theme.palette.primary.main,
    fontWeight: 600,
    fontSize: 18,
    whiteSpace: "nowrap",
  },

  navScrollArea: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    py: 1,
  },

  navItemActive: {
    borderRadius: "10px",
    minHeight: 44,
    margin: "auto",
    marginBottom: "4px !important",
    color: "#fff",
    bgcolor: (theme: Theme) => `${theme.palette.primary.main} !important`,
    "&:hover": {
      bgcolor: (theme: Theme) => `${theme.palette.primary.dark} !important`,
    },
    "&.Mui-selected:hover": {
      bgcolor: (theme: Theme) => `${theme.palette.primary.dark} !important`,
    },
  },

  navItemInactive: {
    borderRadius: "10px",
    minHeight: 44,
    margin: "auto",
    marginBottom: "4px !important",
    color: "#111827",
    bgcolor: "transparent",
    "&:hover": {
      bgcolor: (theme: Theme) => `${theme.palette.primary.main}26`,
    },
  },

  navLabel: {
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
};

export const navbarStyles: Record<string, SxProps<Theme>> = {
  appBar: {
    height: { xs: 64, sm: 72 },
    display: "flex",
    alignItems: "center",
    gap: { xs: 1, sm: 1.5 },
    px: { xs: 1, sm: 1.5, md: 2 },
    bgcolor: "#fff",
    borderBottom: "1px solid #E6E6E6",
    position: "sticky",
    top: 0,
    width: "100%",
    boxSizing: "border-box",
    zIndex: (theme: Theme) => theme.zIndex.appBar,
    flexShrink: 0,
    flexWrap: { xs: "nowrap", md: "nowrap" },
  },

  leftSection: {
    display: "flex",
    gap: { xs: 1 },
    alignItems: "center",
    flex: { xs: "1 1 auto", md: "0 0 40%" },
    minWidth: 0,
    overflow: "hidden",
  },

  pageTitle: {
    fontSize: { xs: "12px", sm: "18px" },
    fontWeight: 600,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  toggleBtn: {
    width: 40,
    height: 40,
    flexShrink: 0,
  },

  rightSection: {
    display: "flex",
    justifyContent: "flex-end",
    flex: { xs: "0 0 auto", md: "0 0 60%" },
    gap: { xs: 0.75, sm: 1, md: 2, lg: 4 },
    alignItems: "center",
    minWidth: 0,
  },

  searchWrapper: {
    flex: "1 1 0",
    minWidth: 0,
    maxWidth: { xs: 160, sm: 200, md: 280, lg: 360 },
    // display: "none",
    [ABOVE_MOBILE_NAV_QUERY]: {
      display: "block",
    },
  },

  aiInsightsBtn: {
    position: "relative",
    textTransform: "none",
    borderRadius: "14px",
    border: "none",
    fontWeight: 400,
    fontSize: 13,
    height: 42,
    px: 1.75,
    color: (theme: Theme) => theme.palette.text.secondary,
    background: "#fff",
    whiteSpace: "nowrap",
    flexShrink: 0,
    // display: "none",
    [ABOVE_MOBILE_NAV_QUERY]: {
      display: "inline-flex",
    },
    zIndex: 0,
    "& .MuiButton-startIcon": {
      marginRight: 0.75,
      display: "inline-flex",
      alignItems: "center",
      zIndex: 1,
    },
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "14px",
      padding: "1.6px",
      background:
        "linear-gradient(180deg, #AD95FB 0%, #5E40A6 26.5%, #FFC077 55.5%, #EB9481 73.5%, #C057DD 95.5%)",
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
      pointerEvents: "none",
      zIndex: 0,
    },
  },

  notifBtn: {
    borderColor: "divider",
    width: 40,
    height: 40,
    bgcolor: "#EEF0F3",
    borderRadius: "50%",
    flexShrink: 0,
  },

  userBtn: {
    width: { xs: 34, sm: 42 },
    height: { xs: 34, sm: 42 },
    fontSize: { xs: "0.8rem", sm: "0.9rem" },
    fontWeight: 600,
    border: "1px solid #E7EAEF",
    mr: '10px',
    color:'#093EB1',
    bgcolor: "#E7F4FF",
    borderRadius: "50%",
    flexShrink: 0,
  },

  userInitials: {
    color: "#093EB1",
    fontSize: 14,
    fontWeight: 600,
  },
  menu: {
    py: 1.3, alignItems: 'center', display: 'flex', gap: 1
  }
};
