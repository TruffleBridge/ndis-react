export const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },

  box: (error?: string, dragging?: boolean) => ({
    border: `1.5px dashed ${error ? "#EF4444" : dragging ? "#2563EB" : "#D1D5DB"
      }`,
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    py: 2,
    px: 1.5,
    cursor: "pointer",
    height:"100%",
    bgcolor: dragging ? "#EFF6FF" : "#FFFFFF",
    transition: "border-color 0.15s, background-color 0.15s",
    "&:hover": {
      bgcolor: "#F3F4F6",
    },
  }),

  uploadedBox: {
    border: "1.5px solid #D1FAE5",
    borderRadius: "8px",
    bgcolor: "#F0FDF4",
    px: 2,
    py: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1,
    minHeight: "96px",
  },

  fileName: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#065F46",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  fileSize: {
    fontSize: "11px",
    color: "#6EE7B7",
  },

  icon: {
    fontSize: 20,
    color: "#9CA3AF",
  },
};