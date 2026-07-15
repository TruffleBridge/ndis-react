import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      100?: string;
      200?: string;
      300?: string;
      400?: string;
      500?: string;
      600?: string;
    };
  }
}

const PRIMARY = "#086D63";
const PRIMARY_DARK = "#065A52";
const PRIMARY_LIGHT = "#0A8579";

export const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY,
      dark: PRIMARY_DARK,
      light: PRIMARY_LIGHT,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#1a1a2e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#7F7F7F",
    },
    custom: {
      100: "#222124",
      200: "#7F7F7F",
      300: "#E6E6E6",
      400: "#D0D5DD",
      500: "#64748B",
      600: PRIMARY
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontSize: "40px", fontWeight: 700 },
    h2: { fontSize: "32px", fontWeight: 600 },
    h3: { fontSize: "28px", fontWeight: 600 },
    h4: { fontSize: "24px", fontWeight: 600 },
    h5: { fontSize: "20px", fontWeight: 600 },
    h6: { fontSize: "16px", fontWeight: 600 },
    body1: { fontSize: "14px", fontWeight: 400 },
    body2: { fontSize: "12px", fontWeight: 400 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Inter", sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: PRIMARY,
          "&:hover": {
            color: PRIMARY_DARK,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: `${PRIMARY}1A`,
          color: PRIMARY,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: PRIMARY,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        colorPrimary: {
          color: PRIMARY,
        },
      },
    },
  },
});

export default theme;
