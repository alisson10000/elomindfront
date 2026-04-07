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

    scrollContent: {
      padding: 16,
      gap: 12,
    },

    loadingContainer: {
      paddingTop: 30,
      alignItems: "center",
    },

    loadingText: {
      marginTop: 10,
      color: theme.muted,
    },

    card: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 14,
    },

    metaText: {
      color: theme.muted,
    },

    metaStrong: {
      color: theme.text,
      fontWeight: "900",
    },

    spacingTop6: {
      marginTop: 6,
    },

    spacingTop8: {
      marginTop: 8,
    },

    spacingTop12: {
      marginTop: 12,
    },

    sectionTitle: {
      color: theme.text,
      fontWeight: "900",
    },

    sectionContent: {
      color: theme.muted,
      marginTop: 8,
    },

    subSectionContent: {
      color: theme.muted,
      marginTop: 6,
    },

    refreshButton: {
      marginTop: 6,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    refreshButtonDisabled: {
      opacity: 0.7,
    },

    refreshButtonText: {
      color: theme.text,
      fontWeight: "900",
    },
  });
}