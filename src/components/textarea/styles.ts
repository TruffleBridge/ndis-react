export const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
  },

  input: (error?: string) => ({
    fontSize: "13px",
    color: "#111827",
    bgcolor: "#FFFFFF",
    borderRadius: "6px",
    alignItems: "flex-start",

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: error ? "#EF4444" : "#E5E7EB",
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: error ? "#D1D5DB" : "#D1D5DB",
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: error ? "#2563EB" : "#EF4444",
      borderWidth: "1.5px",
    },

    "& textarea": {
      // padding: "7.5px 12px",
      fontSize: "13px",
    },

    "& textarea::placeholder": {
      color: "#9CA3AF",
      opacity: 1,
    },
  }),
};