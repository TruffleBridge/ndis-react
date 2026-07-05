import type { SxProps, Theme } from "@mui/material";

export const styles: Record<string, SxProps<Theme>> = {
  card: {
    border: "1px solid #BEC9C6",
    borderRadius: "12px",
    bgcolor: "#FFFFFF",
    mb: 2,
    width:'100%'
  },

  header: {
    textAlign: 'left',
    padding: '14px 0px 14px 14px',
    background: '#F1F2F3',
    // borderBottom: '1px solid #E5E7EB',
    borderTopRightRadius: '12px',
    borderTopLeftRadius: '12px'
  },

  title: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#101828",
  },

  subtitle: {
    fontSize: "11px",
    color: "#6B7280",
    mt: "2px",
  },
};