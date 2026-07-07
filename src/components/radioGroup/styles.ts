import type { SxProps, Theme } from "@mui/material";

export const styles: Record<string, SxProps<Theme>> = {
  label: {
    color: "#222124",
    mb: 0.75,
    fontSize: "14px",
    fontWeight: 500,
    textAlign: 'start',
  },

  group: {
    '& .MuiFormControlLabel-root': {
      gap: 1.2,
      ml: "-4px"
    },
    "& .MuiSvgIcon-root": {
      fontSize: 24,
    },
  },

  radio: {
    color: "#1442A7",
    "&.Mui-checked": {
      color: "#1442A7",
    },
    p: "3px",
  },

  optionLabel: {
    fontSize: "14px",
    color: "#222124",
    fontWeight: 400,
  },
};