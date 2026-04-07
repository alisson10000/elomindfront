import { StyleSheet } from "react-native";
import type { AppTheme } from "@/constants/theme";

export function makeStyles(theme: AppTheme) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingHorizontal: 16,
      paddingTop: 56,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
      flexDirection: "row",
      alignItems: "center",
      zIndex: 10,
      elevation: 10,
    },

    backButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    backButtonText: {
      color: theme.text,
      fontWeight: "900",
    },

    title: {
      flex: 1,
      textAlign: "center",
      color: theme.text,
      fontSize: 16,
      fontWeight: "900",
      marginRight: 84,
    },

    content: {
      padding: 16,
      paddingBottom: 28,
    },

    description: {
      color: theme.muted,
      marginBottom: 14,
      lineHeight: 20,
    },

    label: {
      color: theme.text,
      fontWeight: "700",
    },

    input: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      marginTop: 8,
      marginBottom: 14,
      borderColor: theme.border,
      backgroundColor: theme.input,
      color: theme.text,
      minHeight: 120,
    },

    primaryButton: {
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: theme.primary,
    },

    primaryButtonDisabled: {
      opacity: 0.7,
    },

    primaryButtonText: {
      color: theme.primaryText,
      fontWeight: "900",
      fontSize: 16,
    },

    secondaryButton: {
      marginTop: 10,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    secondaryButtonText: {
      color: theme.text,
      fontWeight: "800",
    },
  });
}