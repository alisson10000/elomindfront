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

    cardTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    cardInfo: {
      flex: 1,
    },

    clientName: {
      fontWeight: "900",
      color: theme.text,
      fontSize: 16,
    },

    clientEmail: {
      color: theme.muted,
      marginTop: 4,
    },

    actions: {
      marginTop: 12,
      gap: 10,
    },

    defaultActionButton: {
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    defaultActionButtonDisabled: {
      opacity: 0.7,
    },

    defaultActionButtonText: {
      color: theme.text,
      fontWeight: "900",
    },

    lgpdButton: {
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.danger,
      backgroundColor: theme.card,
    },

    lgpdButtonText: {
      color: theme.danger,
      fontWeight: "900",
    },

    toggleButtonActive: {
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.danger,
      backgroundColor: theme.danger,
    },

    toggleButtonInactive: {
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },

    toggleButtonTextActive: {
      color: "#FFFFFF",
      fontWeight: "900",
    },

    toggleButtonTextInactive: {
      color: "#0B1220",
      fontWeight: "900",
    },

    statusPillActive: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },

    statusPillInactive: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.danger,
      backgroundColor: theme.danger,
    },

    statusTextActive: {
      color: "#0B1220",
      fontWeight: "900",
      fontSize: 12,
    },

    statusTextInactive: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 12,
    },

    emptyContainer: {
      paddingTop: 18,
    },

    emptyText: {
      color: theme.muted,
    },
  });
}