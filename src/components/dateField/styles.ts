import type { Theme } from "@mui/material/styles";

export const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    overflow: "visible",
  },

  input: (error?: string, isView?: boolean) => ({
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
      borderColor: "#D0D5DD",
    },

    // FOCUS BORDER
    "& .MuiPickersOutlinedInput-root.Mui-focused > fieldset": {
      borderColor: error ? "#EF4444" : "#D0D5DD",
      borderWidth: "1.5px",
    },

    // ERROR OVERRIDE (non-focus)
    ...(error && {
      "& .MuiPickersOutlinedInput-root > fieldset": {
        borderColor: "#EF4444",
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

    // VIEW MODE (read-only look)
    ...(isView && {
      "& .MuiPickersOutlinedInput-root": {
        padding: 0,
        pointerEvents: "none",
      },
      "& .MuiPickersOutlinedInput-root > fieldset": {
        border: "none",
      },
    }),
  }),

  popper: {
    zIndex: (theme: Theme) => theme.zIndex.modal,
  },

  desktopPaper: {
    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
    borderRadius: "12px",
  },
};