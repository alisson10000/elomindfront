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
      marginBottom: 18,
      color: theme.text,
      textAlign: "center",
    },

    card: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 16,
    },

    description: {
      color: theme.muted,
      textAlign: "center",
      marginBottom: 12,
      lineHeight: 20,
    },

    logoutButton: {
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.danger ?? theme.border,
      backgroundColor: theme.danger ?? theme.card,
      alignItems: "center",
    },

    logoutButtonPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.99 }],
    },

    logoutButtonText: {
      fontSize: 16,
      fontWeight: "900",
      color: "#FFFFFF",
    },

    footerText: {
      marginTop: 14,
      color: theme.muted,
      textAlign: "center",
      lineHeight: 20,
    },
  });
}