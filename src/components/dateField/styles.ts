import type { Theme } from "@mui/material/styles";

export const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    overflow: "visible",
  },

  input: (error?: string) => ({
    width: "100%",

    // PICKER ROOT (DatePicker input)
    "& .MuiPickersOutlinedInput-root": {
      fontSize: "14px",
      color: "#111827",
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      height: 42,
    },

    // DEFAULT BORDER
    "& .MuiPickersOutlinedInput-root > fieldset": {
      borderColor: "#D0D5DD",
      borderWidth: "1.4px",
    },

    // HOVER BORDER (FIXED ✔)
    "& .MuiPickersOutlinedInput-root:hover > fieldset": {
      borderColor: error ? "#d32f2f" : "#D0D5DD",
    },

    // FOCUS BORDER
    "& .MuiPickersOutlinedInput-root.Mui-focused > fieldset": {
      borderColor: error ? "#d32f2f" : "#D0D5DD",
      borderWidth: "1.4px",
    },

    // ERROR OVERRIDE (non-focus)
    ...(error && {
      "& .MuiPickersOutlinedInput-root > fieldset": {
        borderColor: "#EF4444",
        borderWidth: "1.4px",
      },
    }),

    // INPUT TEXT
    "& input": {
      fontSize: "13px",
      padding: "7.5px 12px",
      color: "#111827",
    },

    "& input::placeholder": {
      color: "#7F7F7F",
      opacity: 1,
    },

    // ICON ADORNMENT (CALENDAR ICON)
    "& .MuiInputAdornment-root .MuiIconButton-root": {
      color: "#9CA3AF",
      padding: "4px",
      display: "none", // ✔ hide icon in view mode
    },
  }),

  popper: {
    zIndex: (theme: Theme) => theme.zIndex.modal,
  },

  desktopPaper: {
    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
    borderRadius: "12px",
  },
};