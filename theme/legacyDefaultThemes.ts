/**
 * Frozen themes — **Dark Default** and **Light Default** match the original app exactly (do not edit).
 */
import { alpha, createTheme, type ThemeOptions } from "@mui/material/styles";

export const OLIVE_MAIN = "#9BAB2C";
export const OLIVE_LIGHT = "#B8C94A";
export const OLIVE_DARK = "#7A8A1F";

const darkShadows = [
  "none",
  "0 1px 2px rgba(0,0,0,0.4)",
  "0 2px 4px rgba(0,0,0,0.4)",
  "0 4px 8px rgba(0,0,0,0.4)",
  "0 8px 16px rgba(0,0,0,0.4)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.45)",
] as const;

const lightShadows = [
  "none",
  "0 1px 2px rgba(15,23,42,0.06)",
  "0 2px 4px rgba(15,23,42,0.06)",
  "0 4px 8px rgba(15,23,42,0.08)",
  "0 8px 16px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
  "0 12px 24px rgba(15,23,42,0.1)",
] as const;

/** Original dark theme — unchanged */
export function createDarkDefaultTheme() {
  return createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: OLIVE_MAIN,
        light: OLIVE_LIGHT,
        dark: OLIVE_DARK,
        contrastText: "#0a0a0a",
      },
      secondary: {
        main: "#94a3b8",
        light: "#cbd5e1",
        dark: "#64748b",
        contrastText: "#0a0a0a",
      },
      background: {
        default: "#0a0a0a",
        paper: "#141414",
      },
      text: {
        primary: "#fafafa",
        secondary: "#94a3b8",
        disabled: "#64748b",
      },
      divider: "rgba(255, 255, 255, 0.06)",
      action: {
        hover: alpha("#ffffff", 0.05),
        selected: alpha(OLIVE_MAIN, 0.15),
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", "Geist", "system-ui", sans-serif',
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h4: { fontWeight: 700, letterSpacing: "-0.03em" },
      h5: { fontWeight: 600, letterSpacing: "-0.02em" },
      h6: { fontWeight: 600, letterSpacing: "-0.01em" },
      body1: { letterSpacing: "0.01em" },
      body2: { letterSpacing: "0.01em" },
    },
    shadows: [...darkShadows] as unknown as ThemeOptions["shadows"],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { colorScheme: "dark" },
          "html, body": {
            transitionProperty: "background-color, color",
            transitionDuration: "0.25s",
            transitionTimingFunction: "ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 12,
            transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
          },
          contained: {
            boxShadow: "none",
            "&:hover": { boxShadow: `0 0 0 1px ${alpha(OLIVE_MAIN, 0.25)}` },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.mode === "dark" ? "#1f1f1f" : theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 16,
            boxShadow: theme.palette.mode === "dark" ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "0 2px 12px rgba(15, 23, 42, 0.06)",
            transition: "border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",
            overflow: "hidden",
            "&:hover": {
              borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : alpha("#0f172a", 0.12),
              boxShadow:
                theme.palette.mode === "dark" ? "0 8px 24px rgba(0, 0, 0, 0.3)" : "0 8px 24px rgba(15, 23, 42, 0.08)",
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 16,
            boxShadow: theme.palette.mode === "dark" ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "0 2px 12px rgba(15, 23, 42, 0.06)",
            transition: "background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor:
              theme.palette.mode === "dark" ? "rgba(26, 26, 26, 0.95)" : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${theme.palette.divider}`,
            boxShadow: "none",
            color: theme.palette.text.primary,
            transition: "background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease",
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: 8,
            transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "color 0.2s ease, background-color 0.2s ease",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            transition: "background-color 0.25s ease, border-color 0.25s ease",
            backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
    },
  });
}

/** Original light theme — unchanged */
export function createLightDefaultTheme() {
  return createTheme({
    palette: {
      mode: "light",
      primary: {
        main: OLIVE_MAIN,
        light: OLIVE_LIGHT,
        dark: OLIVE_DARK,
        contrastText: "#0a0a0a",
      },
      secondary: {
        main: "#64748b",
        light: "#94a3b8",
        dark: "#475569",
        contrastText: "#ffffff",
      },
      background: {
        default: "#f4f6f8",
        paper: "#ffffff",
      },
      text: {
        primary: "#0f172a",
        secondary: "#64748b",
        disabled: "#94a3b8",
      },
      divider: "rgba(15, 23, 42, 0.08)",
      action: {
        hover: alpha("#0f172a", 0.04),
        selected: alpha(OLIVE_MAIN, 0.12),
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", "Geist", "system-ui", sans-serif',
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h4: { fontWeight: 700, letterSpacing: "-0.03em" },
      h5: { fontWeight: 600, letterSpacing: "-0.02em" },
      h6: { fontWeight: 600, letterSpacing: "-0.01em" },
      body1: { letterSpacing: "0.01em" },
      body2: { letterSpacing: "0.01em" },
    },
    shadows: [...lightShadows] as unknown as ThemeOptions["shadows"],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { colorScheme: "light" },
          "html, body": {
            transitionProperty: "background-color, color",
            transitionDuration: "0.25s",
            transitionTimingFunction: "ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 12,
            transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
          },
          contained: {
            boxShadow: "none",
            "&:hover": { boxShadow: `0 0 0 1px ${alpha(OLIVE_MAIN, 0.25)}` },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.mode === "dark" ? "#1f1f1f" : theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 16,
            boxShadow: theme.palette.mode === "dark" ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "0 2px 12px rgba(15, 23, 42, 0.06)",
            transition: "border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",
            overflow: "hidden",
            "&:hover": {
              borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : alpha("#0f172a", 0.12),
              boxShadow:
                theme.palette.mode === "dark" ? "0 8px 24px rgba(0, 0, 0, 0.3)" : "0 8px 24px rgba(15, 23, 42, 0.08)",
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 16,
            boxShadow: theme.palette.mode === "dark" ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "0 2px 12px rgba(15, 23, 42, 0.06)",
            transition: "background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor:
              theme.palette.mode === "dark" ? "rgba(26, 26, 26, 0.95)" : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${theme.palette.divider}`,
            boxShadow: "none",
            color: theme.palette.text.primary,
            transition: "background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease",
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: 8,
            transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "color 0.2s ease, background-color 0.2s ease",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            transition: "background-color 0.25s ease, border-color 0.25s ease",
            backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
    },
  });
}
