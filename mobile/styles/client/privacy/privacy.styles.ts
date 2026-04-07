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
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    backButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    backButtonText: {
      color: theme.text,
      fontWeight: "900",
    },

    headerTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "900",
    },

    headerSubtitle: {
      color: theme.muted,
      marginTop: 2,
    },

    container: {
      flex: 1,
      padding: 16,
      gap: 12,
    },

    loadingContainer: {
      paddingTop: 10,
      alignItems: "center",
    },

    loadingText: {
      marginTop: 10,
      color: theme.muted,
    },

    card: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    cardTitle: {
      color: theme.text,
      fontWeight: "900",
    },

    textMuted: {
      color: theme.muted,
      marginTop: 8,
    },

    strong: {
      color: theme.text,
      fontWeight: "900",
    },

    button: {
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    buttonDanger: {
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.danger,
      backgroundColor: theme.danger,
    },

    buttonDisabled: {
      opacity: 0.7,
    },

    buttonText: {
      color: theme.text,
      fontWeight: "900",
    },

    buttonDangerText: {
      color: "#FFFFFF",
      fontWeight: "900",
    },

    footerText: {
      color: theme.muted,
      lineHeight: 18,
    },
  });
}