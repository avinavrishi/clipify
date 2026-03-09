"use client";

import "./globals.css";
import React from "react";
import { QueryClientProvider } from "../providers/QueryClientProvider";
import { AuthProvider } from "../providers/AuthProvider";
import { AuthModalProvider } from "../providers/AuthModalProvider";
import { AuthModal } from "../components/AuthModal";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

/* 60-30-10: 60% black, 30% olive green accent, 10% other (white/gray) */
const OLIVE_MAIN = "#9BAB2C";
const OLIVE_LIGHT = "#B8C94A";
const OLIVE_DARK = "#7A8A1F";

const theme = createTheme({
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
  },
  shape: {
    borderRadius: 12,
  },
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
  shadows: [
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
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
          transition: "all 0.2s ease",
        },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: `0 0 0 1px ${OLIVE_MAIN}40` },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1f1f1f",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          overflow: "hidden",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(26, 26, 26, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
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
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider>
            <AuthProvider>
            <AuthModalProvider>
              {children}
              <AuthModal />
            </AuthModalProvider>
          </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
