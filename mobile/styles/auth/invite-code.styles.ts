import { StyleSheet } from "react-native";
import type { AppTheme } from "@/constants/theme";

export function makeStyles(theme: AppTheme) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },

    keyboard: {
      flex: 1,
    },

    container: {
      flex: 1,
      padding: 24,
      backgroundColor: theme.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },

    backButton: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      marginRight: 12,
    },

    backButtonDisabled: {
      opacity: 0.7,
    },

    backButtonText: {
      fontWeight: "900",
      color: theme.text,
    },

    title: {
      fontSize: 18,
      fontWeight: "900",
      color: theme.text,
    },

    subtitle: {
      color: theme.muted,
      marginBottom: 18,
      lineHeight: 20,
    },

    card: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      gap: 12,

      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },

    label: {
      fontWeight: "800",
      color: theme.text,
    },

    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.input,
      color: theme.text,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 12,
      fontSize: 15,
    },

    primaryButton: {
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.primary,
      alignItems: "center",
    },

    primaryButtonPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.99 }],
    },

    primaryButtonDisabled: {
      opacity: 0.7,
    },

    primaryButtonText: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.primaryText,
    },

    secondaryButton: {
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
    },

    secondaryButtonText: {
      fontWeight: "700",
      color: theme.muted,
    },
  });
}