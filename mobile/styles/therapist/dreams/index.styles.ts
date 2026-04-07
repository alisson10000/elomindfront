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
      padding: 24,
      justifyContent: "center",
    },

    invalidTitle: {
      color: theme.text,
      fontWeight: "900",
      marginBottom: 12,
    },

    invalidButton: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: "center",
    },

    invalidButtonText: {
      color: theme.text,
      fontWeight: "800",
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

    scrollContent: {
      padding: 16,
      paddingBottom: 28,
    },

    loadingContainer: {
      paddingTop: 10,
      alignItems: "center",
    },

    loadingText: {
      marginTop: 10,
      color: theme.muted,
    },

    listContainer: {
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

    cardMutedText: {
      color: theme.muted,
    },

    cardDescription: {
      color: theme.text,
      marginTop: 6,
      lineHeight: 20,
    },

    cardTags: {
      color: theme.muted,
      marginTop: 10,
    },

    cardNotes: {
      color: theme.muted,
      marginTop: 6,
    },
  });
}