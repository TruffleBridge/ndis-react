export const styles = {
  box: (error?: string, hasPreview?: boolean) => ({
    border: `1.5px dashed ${error ? "#EF4444" : "#D1D5DB"}`,
    mb: 2,
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: '100%',
    gap: 0.75,
    cursor: hasPreview ? "default" : "pointer",
    bgcolor: "#FFFFFF",
    minHeight: "88px",
    maxHeight: '119px',
    overflow: "hidden",
    position: "relative",
    "&:hover": {
      bgcolor: hasPreview ? "#FFFFFF" : "#F3F4F6",
    },
  }),

  preview: {
    width: "100%",
    height: "106px",
    objectFit: "cover",
  },

  uploadText: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1650CF",
    // textDecoration: "underline",
    // textUnderlineOffset: "2px",
  },

  icon: {
    fontSize: 22,
    color: "#9CA3AF",
  },

  deleteBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    bgcolor: "rgba(0,0,0,0.55)",
    color: "#fff",
    p: "3px",
    "&:hover": {
      bgcolor: "rgba(0,0,0,0.75)",
    },
  },

  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: '100%'
  },
};