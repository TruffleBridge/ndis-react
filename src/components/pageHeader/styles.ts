import type { SxProps, Theme } from "@mui/material";

export const styles: Record<string, SxProps<Theme>> = {
  root: {
    display: "flex",
    alignItems: 'center',
    height: 62,
    gap: 1.5,
    px: 3,
    py: "14px",
    bgcolor: "#FFFFFF",
    borderRadius: '8px',
    border: "1px solid #E5E7EB",
    textAlign: 'left',
    boxShadow: "0px 8px 24px rgba(11,124,119,0.08)"
  },

  title: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#111827",
  },

  subtitle: {
    fontSize: "14px",
    color: "#7F7F7F",
    mt: "1px",
    fontWeight: 400
  },
};