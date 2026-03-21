/** All supported UI theme presets (`theme-${id}` on <html>) */
export const THEME_PRESET_IDS = [
  "dark-default",
  "dark-pro",
  "dark-midnight-blue",
  "dark-graphite",
  "dark-royal-purple",
  "dark-emerald-night",
  "dark-velvet-burgundy",
  "dark-slate-teal",
  "dark-obsidian-amber",
  "dark-nord-frost",
  "light-default",
  "light-soft-white-pro",
  "light-warm-beige",
  "light-pastel-sky",
  "light-minimal-gray",
  "light-elegant-ivory",
  "light-sage-linen",
  "light-blush-quartz",
  "light-sea-mist",
  "light-lavender-haze",
] as const;

export type ThemePresetId = (typeof THEME_PRESET_IDS)[number];

export const DEFAULT_THEME_PRESET_ID: ThemePresetId = "dark-default";

/** Map removed preset ids → replacement (localStorage migration) */
export const DEPRECATED_THEME_PRESET_MAP: Record<string, ThemePresetId> = {
  "dark-blue-neon": "dark-midnight-blue",
  "dark-purple": "dark-royal-purple",
  "dark-minimal-gray": "dark-graphite",
  "light-soft-beige": "light-warm-beige",
  "light-pastel-blue": "light-pastel-sky",
  "light-modern-white": "light-soft-white-pro",
};

export function isThemePresetId(value: string | null | undefined): value is ThemePresetId {
  return !!value && (THEME_PRESET_IDS as readonly string[]).includes(value);
}

export function presetColorMode(id: ThemePresetId): "light" | "dark" {
  return id.startsWith("light-") ? "light" : "dark";
}

export function resolveStoredPresetId(raw: string | null): ThemePresetId {
  if (!raw) return DEFAULT_THEME_PRESET_ID;
  if (isThemePresetId(raw)) return raw;
  const migrated = DEPRECATED_THEME_PRESET_MAP[raw];
  return migrated ?? DEFAULT_THEME_PRESET_ID;
}
