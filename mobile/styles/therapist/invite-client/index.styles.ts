import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

type Scheme = "light" | "dark";

export function getInviteClientTheme(colorScheme: Scheme = "light") {
  const theme = Colors[colorScheme];

  return {
    placeholderColor: theme.muted,
    activityIndicatorColor: theme.text,
  };
}

export function createStyles(colorScheme: Scheme = "light") {
  const theme = Colors[colorScheme];

  return StyleSheet.create({
    keyboardAvoiding: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      padding: 24,
      flexGrow: 1,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      marginTop: 10,
    },

    backButton: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      marginRight: 12,
      marginTop: 4,
    },

    disabled: {
      opacity: 0.7,
    },

    backButtonText: {
      fontWeight: "900",
      color: theme.text,
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: theme.text,
    },

    description: {
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

    submitButton: {
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: "center",
    },

    submitButtonText: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.text,
    },

    cancelButton: {
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
    },

    cancelButtonText: {
      fontWeight: "700",
      color: theme.muted,
    },

    footer: {
      marginTop: 18,
      color: theme.muted,
      textAlign: "center",
    },
  });
}