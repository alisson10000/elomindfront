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

    scrollContent: {
      padding: 24,
      flexGrow: 1,
    },

    invalidContainer: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
    },

    invalidTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: theme.text,
      marginBottom: 10,
    },

    invalidText: {
      color: theme.muted,
      marginBottom: 16,
    },

    invalidButton: {
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: "center",
    },

    invalidButtonText: {
      fontWeight: "900",
      color: theme.text,
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
    },

    card: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      gap: 12,
    },

    label: {
      fontWeight: "800",
      color: theme.text,
    },

    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      color: theme.text,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 12,
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