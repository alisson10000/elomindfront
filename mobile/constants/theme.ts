import { Platform } from "react-native";

export type AppTheme = {
  primary: string;
  primaryStrong: string;
  primaryText: string;

  background: string;
  surface: string;
  card: string;
  input: string;
  border: string;

  text: string;
  muted: string;
  placeholder: string;
  icon: string;

  danger: string;

  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;

  shadow: string;
};

const ELO = {
  primary: "#9FD4B1",
  primaryStrong: "#86C39C",
  primaryText: "#FFFFFF",

  background: "#F3F6FF",
  surface: "#EEF2F7",
  card: "#FFFFFF",
  input: "#F8FAFC",
  border: "#E4E7EC",

  text: "#0B1220",
  muted: "#667085",
  placeholder: "#98A2B3",
  icon: "#98A2B3",

  danger: "#E11D48",
  dangerDark: "#FB7185",
};

export const Colors: Record<"light" | "dark", AppTheme> = {
  light: {
    primary: ELO.primary,
    primaryStrong: ELO.primaryStrong,
    primaryText: ELO.primaryText,

    background: ELO.background,
    surface: ELO.surface,
    card: ELO.card,
    input: ELO.input,
    border: ELO.border,

    text: ELO.text,
    muted: ELO.muted,
    placeholder: ELO.placeholder,
    icon: ELO.icon,

    danger: ELO.danger,

    tint: ELO.primary,
    tabIconDefault: ELO.icon,
    tabIconSelected: ELO.primary,

    shadow: "rgba(0,0,0,0.08)",
  },

  dark: {
    primary: "#7FC8A9",
    primaryStrong: "#69B894",
    primaryText: "#FFFFFF",

    background: "#0F172A",
    surface: "#172033",
    card: "#111827",
    input: "#0B1220",
    border: "#1F2937",

    text: "#F9FAFB",
    muted: "#9CA3AF",
    placeholder: "#6B7280",
    icon: "#9CA3AF",

    danger: ELO.dangerDark,

    tint: "#7FC8A9",
    tabIconDefault: "#6B7280",
    tabIconSelected: "#7FC8A9",

    shadow: "rgba(0,0,0,0.30)",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  android: {
    sans: "sans-serif",
    serif: "serif",
    rounded: "sans-serif",
    mono: "monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});