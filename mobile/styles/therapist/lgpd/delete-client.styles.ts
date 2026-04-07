import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

type Scheme = "light" | "dark";

export function getDeleteClientTheme(colorScheme: Scheme = "light") {
  const theme = Colors[colorScheme];

  return {
    activityIndicatorColor: theme.text,
  };
}

export function createStyles(colorScheme: Scheme = "light") {
  const theme = Colors[colorScheme];

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },

    invalidContainer: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
    },

    invalidTitle: {
      color: theme.text,
      fontWeight: "900",
    },

    invalidBackButton: {
      marginTop: 14,
      padding: 14,
    },

    invalidBackButtonText: {
      color: theme.text,
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

    headerContent: {
      flex: 1,
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

    content: {
      flex: 1,
      padding: 16,
      gap: 12,
    },

    warningCard: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    warningTitle: {
      color: theme.text,
      fontWeight: "900",
    },

    warningText: {
      color: theme.muted,
      marginTop: 8,
      lineHeight: 18,
    },

    deleteButton: {
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.danger,
      backgroundColor: theme.danger,
    },

    deleteButtonDisabled: {
      opacity: 0.7,
    },

    deleteButtonText: {
      color: "#FFF",
      fontWeight: "900",
    },
  });
}