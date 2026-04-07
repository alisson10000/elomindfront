import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

type Scheme = "light" | "dark";

export function createStyles(colorScheme: Scheme = "light") {
  const theme = Colors[colorScheme];

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: theme.background,
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
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    loadingText: {
      marginTop: 10,
      color: theme.muted,
    },

    listContent: {
      paddingBottom: 16,
    },

    card: {
      padding: 14,
      borderWidth: 1,
      borderRadius: 14,
      marginBottom: 10,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    cardTitle: {
      color: theme.text,
      fontWeight: "900",
      fontSize: 15,
    },

    cardEmail: {
      color: theme.muted,
      marginTop: 4,
    },

    cardCount: {
      color: theme.muted,
      marginTop: 8,
    },

    cardHint: {
      color: theme.muted,
      marginTop: 8,
      fontWeight: "900",
    },

    emptyContainer: {
      paddingTop: 18,
    },

    emptyText: {
      color: theme.muted,
    },
  });
}