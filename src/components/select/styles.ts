export const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    mb: 1
  },

  input: (error?: string, disabled?: boolean, isView?: boolean) => ({
    "& .MuiTypography-root": {
      lineHeight: 1.43,
      marginBottom: "4px"
    },
    "& .MuiOutlinedInput-root": {
      fontSize: "14px",
      color: "#111827",
      bgcolor: disabled ? "#F4F4F4 !important" : "#FFFFFF",
      borderRadius: "8px",
      height: 42,
      ...isView && { p: 0 },
      "& fieldset": {
        border: isView && 'none',
        borderWidth: '1.4px',
        borderColor: "#D0D5DD",
      },
      '& .MuiAutocomplete-endAdornment': {
        display: isView ? 'none' : 'flex'
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: error ? "#EF4444" : "#D0D5DD",
      },

      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: error ? "#D1D5DB" : "#D1D5DB",
      },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: error ? "#EF4444" : "#086D63",
        borderWidth: "1.5px",
      },
    },

    "& input::placeholder": {
      color: "#7F7F7F",
      opacity: 1,
      fontSize: "14px",
    },
  }),

  option: {
    fontSize: "13px",
    color: "#111827",
  },

  popup: {
    "& .MuiAutocomplete-popupIndicator": {
      color: "#9CA3AF",
    },
    "& .MuiAutocomplete-clearIndicator": {
      color: "#9CA3AF",
    },
  },
};