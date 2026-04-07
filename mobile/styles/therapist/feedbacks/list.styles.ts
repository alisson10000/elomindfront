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

    invalidContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },

    invalidText: {
      color: theme.text,
      fontWeight: "900",
      textAlign: "center",
    },

    invalidButton: {
      marginTop: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    invalidButtonText: {
      color: theme.text,
      fontWeight: "900",
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
      justifyContent: "space-between",
      gap: 10,
    },

    cardInfo: {
      flex: 1,
    },

    cardTitle: {
      color: theme.text,
      fontWeight: "900",
      fontSize: 15,
    },

    cardDate: {
      color: theme.muted,
      marginTop: 4,
    },

    excerptText: {
      color: theme.muted,
      marginTop: 10,
    },

    hintText: {
      color: theme.muted,
      marginTop: 10,
      fontWeight: "900",
    },

    badgeBase: {
      alignSelf: "flex-start",
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
    },

    badgeApproved: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },

    badgeRejected: {
      borderColor: theme.danger,
      backgroundColor: theme.danger,
    },

    badgePending: {
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    badgeTextApproved: {
      color: "#0B1220",
      fontWeight: "900",
      fontSize: 12,
    },

    badgeTextRejected: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 12,
    },

    badgeTextPending: {
      color: theme.text,
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