import { alpha, createTheme, type PaletteOptions, type ThemeOptions } from "@mui/material/styles";
import type { ThemePresetId } from "./presetIds";

export type CustomPresetSurfaces = {
  /** Card / elevated panels (~30% secondary) */
  card: string;
  /** Drawer, subtle chrome */
  paperChrome: string;
  /** Top app bar (often translucent) */
  appBar: string;
};

export type CustomPresetDefinition = {
  id: ThemePresetId;
  palette: PaletteOptions;
  surfaces: CustomPresetSurfaces;
  /** Soft shadow tint (rgb base) */
  shadowTint: string;
};

const darkShadowsDeep = [
  "none",
  "0 1px 2px rgba(0,0,0,0.45)",
  "0 2px 4px rgba(0,0,0,0.45)",
  "0 4px 8px rgba(0,0,0,0.45)",
  "0 8px 16px rgba(0,0,0,0.45)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
  "0 12px 24px rgba(0,0,0,0.5)",
] as const;

const lightShadowsSoft = [
  "none",
  "0 1px 2px rgba(15,23,42,0.05)",
  "0 2px 4px rgba(15,23,42,0.05)",
  "0 4px 8px rgba(15,23,42,0.06)",
  "0 8px 16px rgba(15,23,42,0.07)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
  "0 12px 24px rgba(15,23,42,0.08)",
] as const;

const commonTypography = {
  fontFamily: '"Inter", "Geist", "system-ui", sans-serif',
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h4: { fontWeight: 700, letterSpacing: "-0.03em" },
  h5: { fontWeight: 600, letterSpacing: "-0.02em" },
  h6: { fontWeight: 600, letterSpacing: "-0.01em" },
  body1: { letterSpacing: "0.01em" },
  body2: { letterSpacing: "0.01em" },
} as const;

export function buildCustomPresetTheme(def: CustomPresetDefinition) {
  const mode = def.palette.mode!;
  const isDark = mode === "dark";
  const { surfaces, shadowTint } = def;
  const primary = def.palette.primary as { main: string };
  const pm = primary.main;

  return createTheme({
    palette: def.palette,
    shape: { borderRadius: 12 },
    typography: { ...commonTypography },
    shadows: [...(isDark ? darkShadowsDeep : lightShadowsSoft)] as unknown as ThemeOptions["shadows"],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { colorScheme: isDark ? "dark" : "light" },
          "html, body": {
            transitionProperty: "background-color, color",
            transitionDuration: "0.3s",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
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
            boxShadow: isDark ? `0 1px 2px ${alpha(shadowTint, 0.35)}` : `0 1px 2px ${alpha(shadowTint, 0.08)}`,
            "&:hover": {
              boxShadow: `0 0 0 1px ${alpha(pm, 0.35)}, 0 4px 14px ${alpha(pm, isDark ? 0.2 : 0.12)}`,
            },
          },
          outlined: {
            borderWidth: 1,
            "&:hover": { borderWidth: 1 },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: surfaces.card,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 16,
            boxShadow: isDark
              ? `0 2px 12px ${alpha(shadowTint, 0.4)}`
              : `0 2px 16px ${alpha(shadowTint, 0.06)}`,
            transition: "border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
            overflow: "hidden",
            "&:hover": {
              borderColor: isDark ? alpha("#fff", 0.12) : alpha(shadowTint, 0.14),
              boxShadow: isDark
                ? `0 12px 40px ${alpha(shadowTint, 0.55)}`
                : `0 12px 32px ${alpha(shadowTint, 0.09)}`,
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: surfaces.paperChrome,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 16,
            boxShadow: isDark
              ? `0 2px 10px ${alpha(shadowTint, 0.35)}`
              : `0 2px 14px ${alpha(shadowTint, 0.05)}`,
            transition: "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: surfaces.appBar,
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${theme.palette.divider}`,
            boxShadow: "none",
            color: theme.palette.text.primary,
            transition: "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
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
            transition: "background-color 0.3s ease, border-color 0.3s ease",
            backgroundColor: surfaces.paperChrome,
            borderRight: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
    },
  });
}

/** 60-30-10 palettes: 60% bg.default, 30% surfaces / secondary, 10% primary accent */
export const CUSTOM_PRESET_DEFINITIONS: Record<
  Exclude<ThemePresetId, "dark-default" | "light-default">,
  CustomPresetDefinition
> = {
  "dark-pro": {
    id: "dark-pro",
    shadowTint: "#0a0b0e",
    surfaces: {
      card: "#14151c",
      paperChrome: "#0f1015",
      appBar: "rgba(12, 13, 16, 0.92)",
    },
    palette: {
      mode: "dark",
      primary: { main: "#6366f1", light: "#818cf8", dark: "#4f46e5", contrastText: "#f8fafc" },
      secondary: { main: "#64748b", light: "#94a3b8", dark: "#475569", contrastText: "#f1f5f9" },
      background: { default: "#0c0d10", paper: "#111218" },
      text: { primary: "#e8eaef", secondary: "#9ca3af", disabled: "#6b7280" },
      divider: "rgba(148, 163, 184, 0.1)",
      action: { hover: alpha("#6366f1", 0.07), selected: alpha("#6366f1", 0.12) },
    },
  },
  "dark-midnight-blue": {
    id: "dark-midnight-blue",
    shadowTint: "#050a12",
    surfaces: {
      card: "#101f2e",
      paperChrome: "#0a1524",
      appBar: "rgba(7, 15, 28, 0.93)",
    },
    palette: {
      mode: "dark",
      primary: { main: "#5ab0c4", light: "#7bc4d4", dark: "#3d94a8", contrastText: "#061018" },
      secondary: { main: "#6b8fa3", light: "#8ba4b5", dark: "#4f6d7d", contrastText: "#e2edf5" },
      background: { default: "#070f1c", paper: "#0c1828" },
      text: { primary: "#e2edf5", secondary: "#8ba4b8", disabled: "#5c7384" },
      divider: "rgba(90, 176, 196, 0.12)",
      action: { hover: alpha("#5ab0c4", 0.08), selected: alpha("#5ab0c4", 0.14) },
    },
  },
  "dark-graphite": {
    id: "dark-graphite",
    shadowTint: "#0a0a0b",
    surfaces: {
      card: "#1c1c20",
      paperChrome: "#161618",
      appBar: "rgba(18, 18, 20, 0.94)",
    },
    palette: {
      mode: "dark",
      primary: { main: "#6b8afd", light: "#8fa4ff", dark: "#5468d4", contrastText: "#0c0d12" },
      secondary: { main: "#71717a", light: "#a1a1aa", dark: "#52525b", contrastText: "#fafafa" },
      background: { default: "#121214", paper: "#18181b" },
      text: { primary: "#f4f4f5", secondary: "#a1a1aa", disabled: "#71717a" },
      divider: "rgba(255, 255, 255, 0.065)",
      action: { hover: alpha("#ffffff", 0.045), selected: alpha("#6b8afd", 0.12) },
    },
  },
  "dark-royal-purple": {
    id: "dark-royal-purple",
    shadowTint: "#0a0610",
    surfaces: {
      card: "#1a1424",
      paperChrome: "#140f1c",
      appBar: "rgba(15, 10, 20, 0.94)",
    },
    palette: {
      mode: "dark",
      primary: { main: "#9d8cff", light: "#b4a8ff", dark: "#7c6ad4", contrastText: "#0f0a14" },
      secondary: { main: "#8b7fb8", light: "#a89cc9", dark: "#6b5f94", contrastText: "#f5f3ff" },
      background: { default: "#0f0a14", paper: "#160f1e" },
      text: { primary: "#ede9fe", secondary: "#b4a8d4", disabled: "#7e7199" },
      divider: "rgba(157, 140, 255, 0.12)",
      action: { hover: alpha("#9d8cff", 0.08), selected: alpha("#9d8cff", 0.14) },
    },
  },
  "dark-emerald-night": {
    id: "dark-emerald-night",
    shadowTint: "#070c0a",
    surfaces: {
      card: "#141f1a",
      paperChrome: "#0e1512",
      appBar: "rgba(11, 16, 14, 0.93)",
    },
    palette: {
      mode: "dark",
      primary: { main: "#3ecf8e", light: "#5ed9a0", dark: "#2ba870", contrastText: "#051208" },
      secondary: { main: "#6b9080", light: "#8fb5a3", dark: "#4f6b5e", contrastText: "#e8f5ef" },
      background: { default: "#0b100e", paper: "#101816" },
      text: { primary: "#e8f5ef", secondary: "#8fb5a3", disabled: "#5c7568" },
      divider: "rgba(62, 207, 142, 0.1)",
      action: { hover: alpha("#3ecf8e", 0.07), selected: alpha("#3ecf8e", 0.13) },
    },
  },
  "dark-velvet-burgundy": {
    id: "dark-velvet-burgundy",
    shadowTint: "#080506",
    surfaces: {
      card: "#1a1216",
      paperChrome: "#140e12",
      appBar: "rgba(16, 10, 13, 0.93)",
    },
    palette: {
      mode: "dark",
      primary: { main: "#c49a8c", light: "#d4b0a4", dark: "#a67d6f", contrastText: "#100a0d" },
      secondary: { main: "#9d8588", light: "#b5a0a3", dark: "#7d6a6d", contrastText: "#f2e8e8" },
      background: { default: "#100a0d", paper: "#160f14" },
      text: { primary: "#f2e8e8", secondary: "#b9a5a8", disabled: "#7d6d70" },
      divider: "rgba(196, 154, 140, 0.11)",
      action: { hover: alpha("#c49a8c", 0.07), selected: alpha("#c49a8c", 0.13) },
    },
  },
  "dark-slate-teal": {
    id: "dark-slate-teal",
    shadowTint: "#080d0e",
    surfaces: {
      card: "#162022",
      paperChrome: "#111a1c",
      appBar: "rgba(13, 19, 20, 0.93)",
    },
    palette: {
      mode: "dark",
      primary: { main: "#5cad9c", light: "#7bc4b5", dark: "#458a7c", contrastText: "#061210" },
      secondary: { main: "#6d8580", light: "#8fa9a4", dark: "#526a65", contrastText: "#e8f0ef" },
      background: { default: "#0d1314", paper: "#121a1c" },
      text: { primary: "#e8f0ef", secondary: "#8fa9a4", disabled: "#5c726d" },
      divider: "rgba(92, 173, 156, 0.1)",
      action: { hover: alpha("#5cad9c", 0.07), selected: alpha("#5cad9c", 0.13) },
    },
  },
  "dark-obsidian-amber": {
    id: "dark-obsidian-amber",
    shadowTint: "#050505",
    surfaces: {
      card: "#161616",
      paperChrome: "#111111",
      appBar: "rgba(10, 10, 10, 0.94)",
    },
    palette: {
      mode: "dark",
      primary: { main: "#d4a853", light: "#e0bc74", dark: "#b8923f", contrastText: "#0a0a0a" },
      secondary: { main: "#78736c", light: "#9c9790", dark: "#5c5852", contrastText: "#f0ebe3" },
      background: { default: "#0a0a0a", paper: "#121212" },
      text: { primary: "#f0ebe3", secondary: "#a8a29a", disabled: "#6b6560" },
      divider: "rgba(212, 168, 83, 0.1)",
      action: { hover: alpha("#d4a853", 0.07), selected: alpha("#d4a853", 0.12) },
    },
  },
  "dark-nord-frost": {
    id: "dark-nord-frost",
    shadowTint: "#080c10",
    surfaces: {
      card: "#162028",
      paperChrome: "#111920",
      appBar: "rgba(12, 18, 24, 0.93)",
    },
    palette: {
      mode: "dark",
      primary: { main: "#88b4c6", light: "#a3c8d6", dark: "#6a9aad", contrastText: "#0c1218" },
      secondary: { main: "#7a8f9c", light: "#9cb0bd", dark: "#5f7380", contrastText: "#e8eef3" },
      background: { default: "#0c1218", paper: "#111920" },
      text: { primary: "#e8eef3", secondary: "#9cb0bd", disabled: "#6a7a85" },
      divider: "rgba(136, 180, 198, 0.12)",
      action: { hover: alpha("#88b4c6", 0.07), selected: alpha("#88b4c6", 0.13) },
    },
  },
  "light-soft-white-pro": {
    id: "light-soft-white-pro",
    shadowTint: "#1a1d26",
    surfaces: {
      card: "#ffffff",
      paperChrome: "#fafbfc",
      appBar: "rgba(250, 251, 252, 0.9)",
    },
    palette: {
      mode: "light",
      primary: { main: "#546de8", light: "#7085ed", dark: "#3d56c9", contrastText: "#ffffff" },
      secondary: { main: "#64748b", light: "#94a3b8", dark: "#475569", contrastText: "#ffffff" },
      background: { default: "#f5f6f8", paper: "#ffffff" },
      text: { primary: "#1a1d26", secondary: "#6b7280", disabled: "#9ca3af" },
      divider: "rgba(26, 29, 38, 0.08)",
      action: { hover: alpha("#546de8", 0.06), selected: alpha("#546de8", 0.1) },
    },
  },
  "light-warm-beige": {
    id: "light-warm-beige",
    shadowTint: "#2d2824",
    surfaces: {
      card: "#faf7f3",
      paperChrome: "#f6f1eb",
      appBar: "rgba(250, 247, 243, 0.92)",
    },
    palette: {
      mode: "light",
      primary: { main: "#9a6b4f", light: "#b08268", dark: "#7a5540", contrastText: "#fdf8f4" },
      secondary: { main: "#8a7f72", light: "#a39689", dark: "#6b6459", contrastText: "#ffffff" },
      background: { default: "#f2ebe3", paper: "#faf5ef" },
      text: { primary: "#2d2824", secondary: "#6f6459", disabled: "#a39689" },
      divider: "rgba(111, 100, 89, 0.12)",
      action: { hover: alpha("#2d2824", 0.04), selected: alpha("#9a6b4f", 0.09) },
    },
  },
  "light-pastel-sky": {
    id: "light-pastel-sky",
    shadowTint: "#1e2a3d",
    surfaces: {
      card: "#ffffff",
      paperChrome: "#f5f8fc",
      appBar: "rgba(255, 255, 255, 0.92)",
    },
    palette: {
      mode: "light",
      primary: { main: "#5c6bc6", light: "#7885d1", dark: "#4554a8", contrastText: "#ffffff" },
      secondary: { main: "#64748b", light: "#94a3b8", dark: "#475569", contrastText: "#ffffff" },
      background: { default: "#ecf2f9", paper: "#f7f9fd" },
      text: { primary: "#1e2a3d", secondary: "#5c6b80", disabled: "#8b96a8" },
      divider: "rgba(92, 107, 198, 0.12)",
      action: { hover: alpha("#5c6bc6", 0.06), selected: alpha("#5c6bc6", 0.1) },
    },
  },
  "light-minimal-gray": {
    id: "light-minimal-gray",
    shadowTint: "#18181b",
    surfaces: {
      card: "#ffffff",
      paperChrome: "#fafafa",
      appBar: "rgba(255, 255, 255, 0.88)",
    },
    palette: {
      mode: "light",
      primary: { main: "#27272a", light: "#3f3f46", dark: "#18181b", contrastText: "#fafafa" },
      secondary: { main: "#71717a", light: "#a1a1aa", dark: "#52525b", contrastText: "#ffffff" },
      background: { default: "#f0f0f2", paper: "#fafafa" },
      text: { primary: "#18181b", secondary: "#71717a", disabled: "#a1a1aa" },
      divider: "rgba(24, 24, 27, 0.08)",
      action: { hover: alpha("#18181b", 0.04), selected: alpha("#18181b", 0.08) },
    },
  },
  "light-elegant-ivory": {
    id: "light-elegant-ivory",
    shadowTint: "#2c2825",
    surfaces: {
      card: "#fdfcfa",
      paperChrome: "#faf8f4",
      appBar: "rgba(253, 252, 250, 0.9)",
    },
    palette: {
      mode: "light",
      primary: { main: "#b8956c", light: "#c9a882", dark: "#9a7a56", contrastText: "#fdfcfa" },
      secondary: { main: "#8b8278", light: "#a39a90", dark: "#6b645c", contrastText: "#ffffff" },
      background: { default: "#f6f3eb", paper: "#fbf9f5" },
      text: { primary: "#2c2825", secondary: "#6b645c", disabled: "#9a9288" },
      divider: "rgba(107, 100, 92, 0.12)",
      action: { hover: alpha("#2c2825", 0.035), selected: alpha("#b8956c", 0.08) },
    },
  },
  "light-sage-linen": {
    id: "light-sage-linen",
    shadowTint: "#2a322c",
    surfaces: {
      card: "#fbfcf9",
      paperChrome: "#f4f6f2",
      appBar: "rgba(251, 252, 249, 0.92)",
    },
    palette: {
      mode: "light",
      primary: { main: "#5a6e5f", light: "#728a78", dark: "#46574a", contrastText: "#f7faf7" },
      secondary: { main: "#6b756e", light: "#8a928c", dark: "#525a54", contrastText: "#ffffff" },
      background: { default: "#eef2eb", paper: "#f6f8f4" },
      text: { primary: "#2a322c", secondary: "#5c6a62", disabled: "#8a948c" },
      divider: "rgba(42, 50, 44, 0.09)",
      action: { hover: alpha("#5a6e5f", 0.06), selected: alpha("#5a6e5f", 0.09) },
    },
  },
  "light-blush-quartz": {
    id: "light-blush-quartz",
    shadowTint: "#3a2c2e",
    surfaces: {
      card: "#ffffff",
      paperChrome: "#fdf9f8",
      appBar: "rgba(255, 255, 255, 0.92)",
    },
    palette: {
      mode: "light",
      primary: { main: "#9e6b73", light: "#b8888f", dark: "#7f555c", contrastText: "#ffffff" },
      secondary: { main: "#8a7577", light: "#a39092", dark: "#6d5c5e", contrastText: "#ffffff" },
      background: { default: "#faf6f5", paper: "#fffbfb" },
      text: { primary: "#3a2c2e", secondary: "#7a6568", disabled: "#a39092" },
      divider: "rgba(122, 101, 104, 0.11)",
      action: { hover: alpha("#9e6b73", 0.06), selected: alpha("#9e6b73", 0.09) },
    },
  },
  "light-sea-mist": {
    id: "light-sea-mist",
    shadowTint: "#1e3330",
    surfaces: {
      card: "#ffffff",
      paperChrome: "#f6faf9",
      appBar: "rgba(255, 255, 255, 0.9)",
    },
    palette: {
      mode: "light",
      primary: { main: "#3d8578", light: "#569e90", dark: "#2f6a60", contrastText: "#ffffff" },
      secondary: { main: "#5c756f", light: "#7a918c", dark: "#465a55", contrastText: "#ffffff" },
      background: { default: "#ecf4f2", paper: "#f5faf9" },
      text: { primary: "#1e3330", secondary: "#5c756f", disabled: "#8a9e99" },
      divider: "rgba(30, 51, 48, 0.09)",
      action: { hover: alpha("#3d8578", 0.06), selected: alpha("#3d8578", 0.09) },
    },
  },
  "light-lavender-haze": {
    id: "light-lavender-haze",
    shadowTint: "#2d2838",
    surfaces: {
      card: "#ffffff",
      paperChrome: "#f9f8fb",
      appBar: "rgba(255, 255, 255, 0.9)",
    },
    palette: {
      mode: "light",
      primary: { main: "#756496", light: "#8f7fad", dark: "#5d4f78", contrastText: "#ffffff" },
      secondary: { main: "#6f667d", light: "#8c8499", dark: "#565063", contrastText: "#ffffff" },
      background: { default: "#f2f0f6", paper: "#faf9fc" },
      text: { primary: "#2d2838", secondary: "#6b6278", disabled: "#9a92a8" },
      divider: "rgba(117, 100, 150, 0.12)",
      action: { hover: alpha("#756496", 0.06), selected: alpha("#756496", 0.09) },
    },
  },
};
