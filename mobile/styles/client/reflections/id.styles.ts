import { StyleSheet } from "react-native";

export const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
      flexDirection: "row",
      alignItems: "center",
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

    headerTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "900",
    },

    headerSubtitle: {
      color: theme.muted,
      marginTop: 2,
    },

    scrollContent: {
      padding: 16,
      paddingBottom: 28,
    },

    createdAtText: {
      color: theme.muted,
      marginBottom: 12,
    },

    sectionGroup: {
      gap: 12,
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
      marginBottom: 8,
    },

    cardText: {
      color: theme.text,
      lineHeight: 20,
    },

    mutedCardText: {
      color: theme.muted,
      lineHeight: 20,
    },

    feedbackSection: {
      marginTop: 18,
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

    actionButton: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: "center",
      justifyContent: "center",
    },

    actionButtonText: {
      color: theme.text,
      fontWeight: "800",
    },

    strongActionButtonText: {
      color: theme.text,
      fontWeight: "900",
    },

    infoTextCenter: {
      color: theme.muted,
      textAlign: "center",
      lineHeight: 20,
    },

    invalidContainer: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
    },

    invalidTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "900",
      marginBottom: 12,
      lineHeight: 22,
    },

    primaryGhostButton: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: "center",
      justifyContent: "center",
    },

    primaryGhostButtonText: {
      color: theme.text,
      fontWeight: "800",
    },
  });