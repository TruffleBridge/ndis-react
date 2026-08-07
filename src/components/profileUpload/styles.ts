export const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: {
      xs: 84,
      sm: 96,
      md: 112,
    },
    height: {
      xs: 84,
      sm: 96,
      md: 112,
    },
  },

  avatarBox: (
    error?: boolean,
    hasPreview?: boolean
  ) => ({
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: hasPreview
      ? "default"
      : "pointer",
    bgcolor: "primary.main",
    color: "#fff",
    border: "3px solid",
    borderColor: error
      ? "#EF4444"
      : "custom.800",
    transition: "0.2s ease",
    "&:hover": {
      opacity: hasPreview ? 1 : 0.85,
    },
  }),

  preview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  uploadContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 0.5,
  },

  uploadIcon: {
    fontSize: {
      xs: 22,
      sm: 26,
    },
    color: "#fff",
  },

  uploadText: {
    fontSize: {
      xs: 13,
      sm: 15,
    },
    fontWeight: 600,
    color: "#fff",
  },

  deleteBtn: {
    position: "absolute",
    top: {
      xs: 4,
      sm: 6,
    },

    right: {
      xs: 4,
      sm: 6,
    },
    width: {
      xs: 26,
      sm: 30,
    },
    height: {
      xs: 26,
      sm: 30,
    },
    bgcolor: "rgba(0,0,0,0.6)",

    "& svg": {
      fontSize: {
        xs: 15,
        sm: 18,
      },
    },
    "&:hover": {
      bgcolor: "rgba(0,0,0,0.8)",
    },
  },

};