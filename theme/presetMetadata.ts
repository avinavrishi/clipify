import type { ThemePresetId } from "./presetIds";

export const THEME_PRESET_STORAGE_KEY = "clipify-theme-preset";

/** @deprecated legacy binary light/dark — migrated once to a preset id */
export const LEGACY_THEME_STORAGE_KEY = "clipify-theme";

export type PresetMeta = {
  label: string;
  group: "dark" | "light";
  /** Accent / CTA (≈10%) */
  accent: string;
  /** Primary background (≈60%) */
  background: string;
};

export const PRESET_META: Record<ThemePresetId, PresetMeta> = {
  "dark-default": {
    label: "Dark Default",
    group: "dark",
    accent: "#9BAB2C",
    background: "#0a0a0a",
  },
  "dark-pro": {
    label: "Dark Pro",
    group: "dark",
    accent: "#6366f1",
    background: "#0c0d10",
  },
  "dark-midnight-blue": {
    label: "Midnight Blue",
    group: "dark",
    accent: "#5ab0c4",
    background: "#070f1c",
  },
  "dark-graphite": {
    label: "Graphite Minimal",
    group: "dark",
    accent: "#6b8afd",
    background: "#121214",
  },
  "dark-royal-purple": {
    label: "Royal Purple Dark",
    group: "dark",
    accent: "#9d8cff",
    background: "#0f0a14",
  },
  "dark-emerald-night": {
    label: "Emerald Night",
    group: "dark",
    accent: "#3ecf8e",
    background: "#0b100e",
  },
  "dark-velvet-burgundy": {
    label: "Velvet Burgundy",
    group: "dark",
    accent: "#c49a8c",
    background: "#100a0d",
  },
  "dark-slate-teal": {
    label: "Slate Teal",
    group: "dark",
    accent: "#5cad9c",
    background: "#0d1314",
  },
  "dark-obsidian-amber": {
    label: "Obsidian Amber",
    group: "dark",
    accent: "#d4a853",
    background: "#0a0a0a",
  },
  "dark-nord-frost": {
    label: "Nord Frost",
    group: "dark",
    accent: "#88b4c6",
    background: "#0c1218",
  },
  "light-default": {
    label: "Light Default",
    group: "light",
    accent: "#9BAB2C",
    background: "#f4f6f8",
  },
  "light-soft-white-pro": {
    label: "Soft White Pro",
    group: "light",
    accent: "#546de8",
    background: "#f5f6f8",
  },
  "light-warm-beige": {
    label: "Warm Beige",
    group: "light",
    accent: "#9a6b4f",
    background: "#f2ebe3",
  },
  "light-pastel-sky": {
    label: "Pastel Sky",
    group: "light",
    accent: "#5c6bc6",
    background: "#ecf2f9",
  },
  "light-minimal-gray": {
    label: "Minimal Gray Light",
    group: "light",
    accent: "#27272a",
    background: "#f0f0f2",
  },
  "light-elegant-ivory": {
    label: "Elegant Ivory",
    group: "light",
    accent: "#b8956c",
    background: "#f6f3eb",
  },
  "light-sage-linen": {
    label: "Sage Linen",
    group: "light",
    accent: "#5a6e5f",
    background: "#eef2eb",
  },
  "light-blush-quartz": {
    label: "Blush Quartz",
    group: "light",
    accent: "#9e6b73",
    background: "#faf6f5",
  },
  "light-sea-mist": {
    label: "Sea Mist",
    group: "light",
    accent: "#3d8578",
    background: "#ecf4f2",
  },
  "light-lavender-haze": {
    label: "Lavender Haze",
    group: "light",
    accent: "#756496",
    background: "#f2f0f6",
  },
};

export const THEME_BOOT_BODY: Record<ThemePresetId, { bg: string; fg: string }> = {
  "dark-default": { bg: "#0a0a0a", fg: "#fafafa" },
  "dark-pro": { bg: "#0c0d10", fg: "#e8eaef" },
  "dark-midnight-blue": { bg: "#070f1c", fg: "#e2edf5" },
  "dark-graphite": { bg: "#121214", fg: "#f4f4f5" },
  "dark-royal-purple": { bg: "#0f0a14", fg: "#ede9fe" },
  "dark-emerald-night": { bg: "#0b100e", fg: "#e8f5ef" },
  "dark-velvet-burgundy": { bg: "#100a0d", fg: "#f2e8e8" },
  "dark-slate-teal": { bg: "#0d1314", fg: "#e8f0ef" },
  "dark-obsidian-amber": { bg: "#0a0a0a", fg: "#f0ebe3" },
  "dark-nord-frost": { bg: "#0c1218", fg: "#e8eef3" },
  "light-default": { bg: "#f4f6f8", fg: "#0f172a" },
  "light-soft-white-pro": { bg: "#f5f6f8", fg: "#1a1d26" },
  "light-warm-beige": { bg: "#f2ebe3", fg: "#2d2824" },
  "light-pastel-sky": { bg: "#ecf2f9", fg: "#1e2a3d" },
  "light-minimal-gray": { bg: "#f0f0f2", fg: "#18181b" },
  "light-elegant-ivory": { bg: "#f6f3eb", fg: "#2c2825" },
  "light-sage-linen": { bg: "#eef2eb", fg: "#2a322c" },
  "light-blush-quartz": { bg: "#faf6f5", fg: "#3a2c2e" },
  "light-sea-mist": { bg: "#ecf4f2", fg: "#1e3330" },
  "light-lavender-haze": { bg: "#f2f0f6", fg: "#2d2838" },
};

type CssVarBundle = Record<string, string>;

/** Extra semantic tokens for forms/tables (beyond PRESET_META) */
const PRESET_CSS_SEMANTIC: Record<
  Exclude<ThemePresetId, "dark-default" | "light-default">,
  {
    muted: string;
    border: string;
    inputBg: string;
    inputBorder: string;
    inputBorderHover: string;
    tableRowHover: string;
    tableBorder: string;
    tableHead: string;
  }
> = {
  "dark-pro": {
    muted: "#9ca3af",
    border: "rgba(148, 163, 184, 0.1)",
    inputBg: "rgba(255, 255, 255, 0.04)",
    inputBorder: "rgba(148, 163, 184, 0.2)",
    inputBorderHover: "rgba(148, 163, 184, 0.32)",
    tableRowHover: "rgba(255, 255, 255, 0.035)",
    tableBorder: "rgba(148, 163, 184, 0.1)",
    tableHead: "#9ca3af",
  },
  "dark-midnight-blue": {
    muted: "#8ba4b8",
    border: "rgba(90, 176, 196, 0.12)",
    inputBg: "rgba(255, 255, 255, 0.035)",
    inputBorder: "rgba(139, 164, 184, 0.22)",
    inputBorderHover: "rgba(90, 176, 196, 0.28)",
    tableRowHover: "rgba(255, 255, 255, 0.04)",
    tableBorder: "rgba(90, 176, 196, 0.1)",
    tableHead: "#8ba4b8",
  },
  "dark-graphite": {
    muted: "#a1a1aa",
    border: "rgba(255, 255, 255, 0.065)",
    inputBg: "rgba(255, 255, 255, 0.04)",
    inputBorder: "rgba(161, 161, 170, 0.22)",
    inputBorderHover: "rgba(107, 138, 253, 0.25)",
    tableRowHover: "rgba(255, 255, 255, 0.04)",
    tableBorder: "rgba(255, 255, 255, 0.07)",
    tableHead: "#a1a1aa",
  },
  "dark-royal-purple": {
    muted: "#b4a8d4",
    border: "rgba(157, 140, 255, 0.12)",
    inputBg: "rgba(255, 255, 255, 0.04)",
    inputBorder: "rgba(180, 168, 212, 0.22)",
    inputBorderHover: "rgba(157, 140, 255, 0.3)",
    tableRowHover: "rgba(255, 255, 255, 0.04)",
    tableBorder: "rgba(157, 140, 255, 0.1)",
    tableHead: "#b4a8d4",
  },
  "dark-emerald-night": {
    muted: "#8fb5a3",
    border: "rgba(62, 207, 142, 0.1)",
    inputBg: "rgba(255, 255, 255, 0.035)",
    inputBorder: "rgba(143, 181, 163, 0.22)",
    inputBorderHover: "rgba(62, 207, 142, 0.26)",
    tableRowHover: "rgba(255, 255, 255, 0.035)",
    tableBorder: "rgba(62, 207, 142, 0.09)",
    tableHead: "#8fb5a3",
  },
  "dark-velvet-burgundy": {
    muted: "#b9a5a8",
    border: "rgba(196, 154, 140, 0.11)",
    inputBg: "rgba(255, 255, 255, 0.035)",
    inputBorder: "rgba(185, 165, 168, 0.22)",
    inputBorderHover: "rgba(196, 154, 140, 0.28)",
    tableRowHover: "rgba(255, 255, 255, 0.035)",
    tableBorder: "rgba(196, 154, 140, 0.09)",
    tableHead: "#b9a5a8",
  },
  "dark-slate-teal": {
    muted: "#8fa9a4",
    border: "rgba(92, 173, 156, 0.1)",
    inputBg: "rgba(255, 255, 255, 0.035)",
    inputBorder: "rgba(143, 169, 164, 0.2)",
    inputBorderHover: "rgba(92, 173, 156, 0.26)",
    tableRowHover: "rgba(255, 255, 255, 0.035)",
    tableBorder: "rgba(92, 173, 156, 0.09)",
    tableHead: "#8fa9a4",
  },
  "dark-obsidian-amber": {
    muted: "#a8a29a",
    border: "rgba(212, 168, 83, 0.1)",
    inputBg: "rgba(255, 255, 255, 0.04)",
    inputBorder: "rgba(168, 162, 154, 0.2)",
    inputBorderHover: "rgba(212, 168, 83, 0.26)",
    tableRowHover: "rgba(255, 255, 255, 0.04)",
    tableBorder: "rgba(255, 255, 255, 0.07)",
    tableHead: "#a8a29a",
  },
  "dark-nord-frost": {
    muted: "#9cb0bd",
    border: "rgba(136, 180, 198, 0.12)",
    inputBg: "rgba(255, 255, 255, 0.035)",
    inputBorder: "rgba(156, 176, 189, 0.22)",
    inputBorderHover: "rgba(136, 180, 198, 0.28)",
    tableRowHover: "rgba(255, 255, 255, 0.04)",
    tableBorder: "rgba(136, 180, 198, 0.1)",
    tableHead: "#9cb0bd",
  },
  "light-soft-white-pro": {
    muted: "#6b7280",
    border: "rgba(26, 29, 38, 0.08)",
    inputBg: "rgba(255, 255, 255, 0.92)",
    inputBorder: "rgba(26, 29, 38, 0.12)",
    inputBorderHover: "rgba(84, 109, 232, 0.22)",
    tableRowHover: "rgba(84, 109, 232, 0.05)",
    tableBorder: "rgba(26, 29, 38, 0.08)",
    tableHead: "#6b7280",
  },
  "light-warm-beige": {
    muted: "#6f6459",
    border: "rgba(111, 100, 89, 0.12)",
    inputBg: "rgba(255, 255, 255, 0.85)",
    inputBorder: "rgba(111, 100, 89, 0.18)",
    inputBorderHover: "rgba(154, 107, 79, 0.28)",
    tableRowHover: "rgba(154, 107, 79, 0.06)",
    tableBorder: "rgba(111, 100, 89, 0.1)",
    tableHead: "#6f6459",
  },
  "light-pastel-sky": {
    muted: "#5c6b80",
    border: "rgba(92, 107, 198, 0.12)",
    inputBg: "rgba(255, 255, 255, 0.95)",
    inputBorder: "rgba(30, 42, 61, 0.12)",
    inputBorderHover: "rgba(92, 107, 198, 0.22)",
    tableRowHover: "rgba(92, 107, 198, 0.06)",
    tableBorder: "rgba(30, 42, 61, 0.09)",
    tableHead: "#5c6b80",
  },
  "light-minimal-gray": {
    muted: "#71717a",
    border: "rgba(24, 24, 27, 0.08)",
    inputBg: "rgba(255, 255, 255, 0.95)",
    inputBorder: "rgba(24, 24, 27, 0.12)",
    inputBorderHover: "rgba(24, 24, 27, 0.2)",
    tableRowHover: "rgba(24, 24, 27, 0.04)",
    tableBorder: "rgba(24, 24, 27, 0.08)",
    tableHead: "#71717a",
  },
  "light-elegant-ivory": {
    muted: "#6b645c",
    border: "rgba(107, 100, 92, 0.12)",
    inputBg: "rgba(255, 255, 254, 0.92)",
    inputBorder: "rgba(107, 100, 92, 0.15)",
    inputBorderHover: "rgba(184, 149, 108, 0.28)",
    tableRowHover: "rgba(184, 149, 108, 0.07)",
    tableBorder: "rgba(107, 100, 92, 0.1)",
    tableHead: "#6b645c",
  },
  "light-sage-linen": {
    muted: "#5c6a62",
    border: "rgba(42, 50, 44, 0.09)",
    inputBg: "rgba(255, 255, 255, 0.9)",
    inputBorder: "rgba(42, 50, 44, 0.12)",
    inputBorderHover: "rgba(90, 110, 95, 0.22)",
    tableRowHover: "rgba(90, 110, 95, 0.05)",
    tableBorder: "rgba(42, 50, 44, 0.08)",
    tableHead: "#5c6a62",
  },
  "light-blush-quartz": {
    muted: "#7a6568",
    border: "rgba(122, 101, 104, 0.11)",
    inputBg: "rgba(255, 255, 255, 0.92)",
    inputBorder: "rgba(122, 101, 104, 0.14)",
    inputBorderHover: "rgba(158, 107, 115, 0.24)",
    tableRowHover: "rgba(158, 107, 115, 0.06)",
    tableBorder: "rgba(122, 101, 104, 0.09)",
    tableHead: "#7a6568",
  },
  "light-sea-mist": {
    muted: "#5c756f",
    border: "rgba(30, 51, 48, 0.09)",
    inputBg: "rgba(255, 255, 255, 0.94)",
    inputBorder: "rgba(30, 51, 48, 0.12)",
    inputBorderHover: "rgba(61, 133, 120, 0.22)",
    tableRowHover: "rgba(61, 133, 120, 0.05)",
    tableBorder: "rgba(30, 51, 48, 0.08)",
    tableHead: "#5c756f",
  },
  "light-lavender-haze": {
    muted: "#6b6278",
    border: "rgba(117, 100, 150, 0.12)",
    inputBg: "rgba(255, 255, 255, 0.92)",
    inputBorder: "rgba(45, 40, 56, 0.1)",
    inputBorderHover: "rgba(117, 100, 150, 0.22)",
    tableRowHover: "rgba(117, 100, 150, 0.06)",
    tableBorder: "rgba(45, 40, 56, 0.08)",
    tableHead: "#6b6278",
  },
};

export function getPresetCssVariables(id: ThemePresetId): CssVarBundle {
  const m = PRESET_META[id];
  const boot = THEME_BOOT_BODY[id];

  if (id === "dark-default") {
    return {
      "--app-bg": "#0a0a0a",
      "--app-fg": "#fafafa",
      "--app-muted": "#94a3b8",
      "--app-border": "rgba(255, 255, 255, 0.06)",
      "--app-input-bg": "rgba(255, 255, 255, 0.05)",
      "--app-input-border": "rgba(255, 255, 255, 0.2)",
      "--app-input-border-hover": "rgba(255, 255, 255, 0.4)",
      "--app-table-row-hover": "rgba(255, 255, 255, 0.04)",
      "--app-table-border": "rgba(255, 255, 255, 0.08)",
      "--app-table-head": "#a3a3a3",
      "--app-focus-ring": "#9bab2c",
    };
  }
  if (id === "light-default") {
    return {
      "--app-bg": "#f4f6f8",
      "--app-fg": "#0f172a",
      "--app-muted": "#64748b",
      "--app-border": "rgba(15, 23, 42, 0.08)",
      "--app-input-bg": "rgba(15, 23, 42, 0.03)",
      "--app-input-border": "rgba(15, 23, 42, 0.18)",
      "--app-input-border-hover": "rgba(15, 23, 42, 0.28)",
      "--app-table-row-hover": "rgba(15, 23, 42, 0.04)",
      "--app-table-border": "rgba(15, 23, 42, 0.1)",
      "--app-table-head": "#64748b",
      "--app-focus-ring": "#9bab2c",
    };
  }

  const s = PRESET_CSS_SEMANTIC[id];
  return {
    "--app-bg": m.background,
    "--app-fg": boot.fg,
    "--app-muted": s.muted,
    "--app-border": s.border,
    "--app-input-bg": s.inputBg,
    "--app-input-border": s.inputBorder,
    "--app-input-border-hover": s.inputBorderHover,
    "--app-table-row-hover": s.tableRowHover,
    "--app-table-border": s.tableBorder,
    "--app-table-head": s.tableHead,
    "--app-focus-ring": m.accent,
  };
}
