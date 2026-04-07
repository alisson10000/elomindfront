import { StyleSheet } from "react-native";
import type { AppTheme } from "@/constants/theme";

export function makeStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
      backgroundColor: theme.background,
    },

    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 24,
      color: theme.text,
      textAlign: "center",
    },

    cardButton: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: "center",
      marginBottom: 12,
    },

    primaryButton: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.primary,
      alignItems: "center",
      marginBottom: 12,
    },

    buttonPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.99 }],
    },

    cardButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },

    primaryButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.primaryText,
    },

    footerText: {
      marginTop: 14,
      color: theme.muted,
      textAlign: "center",
      lineHeight: 20,
    },
  });
}