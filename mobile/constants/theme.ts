<<<<<<< HEAD
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
=======
/**
 * EloMind Theme
 * - Light: clean + calm (azul claro no fundo, verde pastel nas ações)
 * - Dark: confortável para leitura, mantendo o "verde EloMind"
 */

import { Platform } from "react-native";

// 🎨 Paleta EloMind (baseada no seu login)
const ELO = {
  primary: "#9FD4B1",     // verde do botão
  background: "#F3F6FF",  // fundo azul clarinho
  card: "#FFFFFF",        // card branco
  input: "#F8FAFC",       // input cinza muito claro
  border: "#E4E7EC",      // bordas suaves
  text: "#0B1220",        // texto principal (bem escuro)
  muted: "#667085",       // texto secundário
  icon: "#98A2B3",        // ícones neutros

  // 🔴 ações destrutivas
  danger: "#E11D48",      // vermelho elegante (light)
  dangerDark: "#FB7185",  // vermelho suave (dark)
};

export const Colors = {
  light: {
    // Base
    primary: ELO.primary,
    background: ELO.background,
    card: ELO.card,
    input: ELO.input,
    border: ELO.border,
    text: ELO.text,
    muted: ELO.muted,

    // Actions
    danger: ELO.danger,

    // Compat / template Expo (Tabs, etc.)
    tint: ELO.primary,
    icon: ELO.icon,
    tabIconDefault: ELO.icon,
    tabIconSelected: ELO.primary,
  },

  dark: {
    // Dark (mantém identidade EloMind, mas com contraste melhor)
    primary: "#7FC8A9",     // verde EloMind um pouco mais forte no dark
    background: "#0F172A",  // azul bem escuro
    card: "#111827",        // card escuro
    input: "#0B1220",       // input mais escuro
    border: "#1F2937",      // borda
    text: "#F9FAFB",        // texto claro
    muted: "#9CA3AF",       // texto secundário

    // Actions
    danger: ELO.dangerDark,

    tint: "#7FC8A9",
    icon: "#9CA3AF",
    tabIconDefault: "#6B7280",
    tabIconSelected: "#7FC8A9",
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
<<<<<<< HEAD
  android: {
    sans: "sans-serif",
    serif: "serif",
    rounded: "sans-serif",
    mono: "monospace",
  },
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
<<<<<<< HEAD
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
=======
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
