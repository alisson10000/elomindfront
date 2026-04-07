import { StyleSheet } from "react-native";

export const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingHorizontal: 16,
      paddingTop: 56,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
      flexDirection: "row",
      alignItems: "center",
      zIndex: 10,
      elevation: 10,
    },

    headerButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      minWidth: 84,
      alignItems: "center",
      justifyContent: "center",
    },

    headerButtonText: {
      color: theme.text,
      fontWeight: "900",
    },

    headerTitle: {
      flex: 1,
      textAlign: "center",
      color: theme.text,
      fontSize: 16,
      fontWeight: "900",
      paddingHorizontal: 12,
    },

    headerSpacer: {
      minWidth: 84,
    },

    centerContent: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
    },

    centerTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "900",
      marginBottom: 12,
      lineHeight: 22,
    },

    centerTitleText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "900",
      marginBottom: 10,
      textAlign: "center",
      lineHeight: 22,
    },

    centerDescription: {
      color: theme.muted,
      textAlign: "center",
      marginBottom: 18,
      lineHeight: 20,
    },

    ghostButton: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: "center",
      justifyContent: "center",
    },

    ghostButtonText: {
      color: theme.text,
      fontWeight: "800",
    },

    scrollContent: {
      padding: 16,
      paddingBottom: 28,
    },

    description: {
      color: theme.muted,
      marginBottom: 14,
      lineHeight: 20,
    },

    label: {
      color: theme.text,
      fontWeight: "700",
      marginBottom: 2,
    },

    input: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      marginTop: 8,
      marginBottom: 14,
      borderColor: theme.border,
      backgroundColor: theme.input,
      color: theme.text,
      minHeight: 80,
    },

    submitButton: {
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },

    submitButtonText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 16,
    },

    cancelButton: {
      marginTop: 10,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    cancelButtonText: {
      color: theme.text,
      fontWeight: "800",
    },

    disabledButton: {
      opacity: 0.7,
    },
  });