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
      padding: 16,
      justifyContent: "center",
    },

    card: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      padding: 18,

      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 2,
    },

    logo: {
      width: 140,
      height: 60,
      alignSelf: "center",
      marginBottom: 10,
    },

    title: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.text,
      textAlign: "center",
    },

    subtitle: {
      marginTop: 8,
      color: theme.muted,
      textAlign: "center",
    },

    form: {
      marginTop: 16,
    },

    label: {
      fontWeight: "800",
      color: theme.text,
      marginBottom: 6,
    },

    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.input,
      color: theme.text,
      padding: 12,
      borderRadius: 12,
    },

    primaryButton: {
      marginTop: 14,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: theme.primary,
    },

    primaryButtonPressed: {
      opacity: 0.9,
    },

    primaryButtonDisabled: {
      opacity: 0.7,
    },

    primaryButtonText: {
      color: theme.primaryText,
      fontWeight: "900",
    },

    secondaryButton: {
      marginTop: 10,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.input,
      alignItems: "center",
    },

    secondaryButtonText: {
      fontWeight: "900",
      color: theme.text,
    },
  });
}