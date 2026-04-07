import { StyleSheet } from "react-native";

export const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingHorizontal: 16,
      paddingBottom: 12,
      paddingTop: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      gap: 12,
    },

    headerButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    headerButtonText: {
      color: theme.text,
      fontWeight: "900",
    },

    headerContent: {
      flex: 1,
    },

    title: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "900",
    },

    subtitle: {
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
      fontWeight: "900",
      color: theme.text,
    },

    cardDescription: {
      marginTop: 6,
      color: theme.text,
    },

    cardHint: {
      marginTop: 6,
      color: theme.muted,
    },

    deleteButton: {
      marginTop: 12,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },

    deleteButtonText: {
      color: theme.text,
      fontWeight: "900",
    },

    blockedDeleteText: {
      marginTop: 10,
      color: theme.muted,
    },

    emptyContainer: {
      paddingTop: 18,
    },

    emptyText: {
      color: theme.muted,
    },
  });