import { StyleSheet } from "react-native";
import type { AppTheme } from "@/constants/theme";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
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
      fontSize: 16,
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
      paddingTop: 8,
      paddingBottom: 12,
      borderBottomWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    headerBackButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
    },

    headerBackButtonText: {
      fontWeight: "900",
    },

    headerContent: {
      flex: 1,
    },

    headerTitle: {
      fontSize: 16,
      fontWeight: "900",
    },

    headerSubtitle: {
      marginTop: 2,
    },

    keyboardAvoiding: {
      flex: 1,
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
    },

    contentContainer: {
      gap: 12,
    },

    card: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
    },

    cardTitle: {
      fontWeight: "900",
      marginBottom: 8,
    },

    helperText: {
      marginBottom: 10,
    },

    input: {
      minHeight: 180,
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      lineHeight: 20,
      textAlignVertical: "top",
    },

    metadataLine: {
      marginTop: 6,
    },

    metadataLineFirst: {
      marginTop: 0,
    },

    metadataStrong: {
      fontWeight: "800",
    },

    primaryButton: {
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },

    primaryButtonDisabled: {
      opacity: 0.7,
    },

    primaryButtonText: {
      fontWeight: "900",
      fontSize: 16,
    },

    secondaryButton: {
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
    },

    secondaryButtonDisabled: {
      opacity: 0.6,
    },

    secondaryButtonText: {
      fontWeight: "800",
    },
  });