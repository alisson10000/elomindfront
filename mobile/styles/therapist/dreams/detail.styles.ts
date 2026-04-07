import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

type Scheme = "light" | "dark";

export function createStyles(colorScheme: Scheme = "light") {
  const theme = Colors[colorScheme];

  return StyleSheet.create({
    keyboardAvoiding: {
      flex: 1,
      backgroundColor: theme.background,
    },

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

    createdAt: {
      color: theme.muted,
      marginBottom: 12,
    },

    sectionTitleStrong: {
      color: theme.text,
      fontWeight: "900",
    },

    sectionTitle: {
      color: theme.text,
      fontWeight: "700",
    },

    descriptionBox: {
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      marginTop: 8,
      marginBottom: 16,
      backgroundColor: theme.card,
    },

    descriptionText: {
      color: theme.text,
      lineHeight: 20,
    },

    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      marginTop: 8,
      marginBottom: 14,
      color: theme.text,
      backgroundColor: theme.input,
    },

    notesInput: {
      minHeight: 120,
      textAlignVertical: "top",
    },

    saveButton: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
    },

    saveButtonDisabled: {
      opacity: 0.7,
    },

    saveButtonText: {
      color: "#FFF",
      fontWeight: "900",
    },
  });
}