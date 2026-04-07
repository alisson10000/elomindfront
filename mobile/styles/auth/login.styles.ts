import { StyleSheet } from "react-native";
import type  {AppTheme} from "@/constants/theme";

export function makeStyles(theme: AppTheme) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },

    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.background,
    },

    card: {
      borderRadius: 22,
      padding: 20,
      borderWidth: 1,
      backgroundColor: theme.card,
      borderColor: theme.border,

      shadowColor: theme.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },

      elevation: 6,
    },

    logo: {
      width: "100%",
      height: 150,
      marginBottom: 6,
    },

    title: {
      fontSize: 26,
      fontWeight: "800",
      textAlign: "center",
      marginTop: 2,
      color: theme.text,
    },

    subtitle: {
      fontSize: 14,
      textAlign: "center",
      marginTop: 8,
      marginBottom: 18,
      lineHeight: 20,
      color: theme.muted,
    },

    form: {
      marginTop: 6,
    },

    label: {
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 8,
      color: theme.text,
    },

    labelSpacing: {
      marginTop: 14,
    },

    input: {
      height: 50,
      borderWidth: 1,
      paddingHorizontal: 14,
      borderRadius: 14,
      fontSize: 15,
      backgroundColor: theme.input,
      borderColor: theme.border,
      color: theme.text,
    },

    button: {
      marginTop: 18,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      backgroundColor: theme.primary,

      shadowColor: theme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 10 },
      elevation: 5,
    },

    buttonPressed: {
      transform: [{ scale: 0.99 }],
      opacity: 0.95,
    },

    buttonDisabled: {
      opacity: 0.6,
    },

    buttonText: {
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 0.2,
      color: theme.primaryText,
    },

    footer: {
      marginTop: 14,
      fontSize: 12,
      textAlign: "center",
      lineHeight: 16,
      color: theme.muted,
    },

    rememberRow: {
      marginTop: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      borderWidth: 1,
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },

    rememberText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.text,
    },
  });
}