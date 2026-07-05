import type { SxProps, Theme } from "@mui/material";

export const layoutStyles: Record<string, SxProps<Theme>> = {
  root: {
    display: "flex",
    height: "100vh",
    maxHeight: "100vh",
    width: "100%",
    overflow: "hidden",
  },

  main: {
    flex: 1,
    minWidth: 0,
    width: "100%",
    height: "100vh",
    maxHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  content: {
    p: { xs: 1.5, sm: 2 },
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    overflowY: "auto",
    overflowX: "hidden",
    WebkitOverflowScrolling: "touch",
  },
};
