import { StyleSheet } from "react-native";
import type { AppTheme } from "@/constants/theme";

export function makeStyles(theme: AppTheme) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },

    container: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
    },

    invalidTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "900",
      marginBottom: 12,
      textAlign: "center",
      lineHeight: 22,
    },

    title: {
      fontSize: 24,
      fontWeight: "900",
      color: theme.text,
      marginBottom: 10,
      textAlign: "center",
    },

    meta: {
      color: theme.muted,
      fontSize: 15,
      marginBottom: 18,
      textAlign: "center",
      lineHeight: 22,
    },

    metaStrong: {
      color: theme.text,
      fontWeight: "800",
    },

    infoCard: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      marginBottom: 14,
    },

    infoTitle: {
      color: theme.text,
      fontWeight: "800",
      marginBottom: 6,
    },

    infoText: {
      color: theme.muted,
      lineHeight: 20,
    },

    primaryButton: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.primary,
      alignItems: "center",
    },

    primaryButtonPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.99 }],
    },

    primaryButtonText: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.primaryText,
    },

    secondaryButton: {
      padding: 14,
      alignItems: "center",
    },

    secondaryButtonText: {
      color: theme.muted,
      fontWeight: "800",
    },

    cardButton: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: "center",
    },

    cardButtonText: {
      color: theme.text,
      fontWeight: "800",
    },
  });
}