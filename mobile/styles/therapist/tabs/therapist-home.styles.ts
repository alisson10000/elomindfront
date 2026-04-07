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
      fontWeight: "900",
      marginBottom: 12,
      color: theme.text,
      textAlign: "center",
    },

    subtitle: {
      color: theme.muted,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 20,
    },

    card: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 18,
      gap: 14,
    },

    cardButton: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: "center",
    },

    cardButtonPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.99 }],
    },

    cardButtonText: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.text,
      textAlign: "center",
    },

    footer: {
      marginTop: 18,
      color: theme.muted,
      textAlign: "center",
      lineHeight: 20,
    },
  });
}