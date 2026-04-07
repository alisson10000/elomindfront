import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

type Scheme = "light" | "dark" | null | undefined;

export function getTherapistReflectionDetailTheme(colorScheme: Scheme) {
  return Colors[colorScheme ?? "light"];
}

export function getTherapistReflectionDetailStyles(colorScheme: Scheme) {
  const theme = getTherapistReflectionDetailTheme(colorScheme);

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
    },

    backBtn: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    backBtnText: {
      color: theme.text,
      fontWeight: "900",
    },

    headerTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "900",
    },

    headerSubtitle: {
      color: theme.muted,
      marginTop: 2,
      fontSize: 13,
    },

    content: {
      padding: 16,
      paddingBottom: 28,
    },

    loadingWrap: {
      paddingVertical: 40,
      alignItems: "center",
      justifyContent: "center",
    },

    loadingText: {
      marginTop: 10,
      color: theme.muted,
    },

    emptyCenter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      gap: 16,
    },

    titleBig: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "900",
      textAlign: "center",
    },

    card: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 14,
    },

    cardTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "900",
      marginBottom: 10,
    },

    bodyText: {
      color: theme.text,
      lineHeight: 20,
    },

    emptyCardText: {
      color: theme.muted,
      lineHeight: 20,
    },

    metaMuted: {
      color: theme.muted,
      fontSize: 14,
    },

    metaStrong: {
      color: theme.text,
      fontWeight: "900",
    },

    inputLabel: {
      color: theme.text,
      fontWeight: "700",
      marginBottom: 6,
    },

    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      color: theme.text,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      textAlignVertical: "top",
    },

    inputLg: {
      minHeight: 120,
    },

    inputMd: {
      minHeight: 70,
    },

    inputNotes: {
      minHeight: 80,
    },

    row: {
      flexDirection: "row",
      gap: 10,
    },

    flex1: {
      flex: 1,
    },

    gap12: {
      gap: 12,
    },

    sectionGap: {
      gap: 10,
    },

    mt16: {
      marginTop: 16,
    },

    btn: {
      minHeight: 46,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    btnText: {
      color: theme.text,
      fontWeight: "800",
    },

    btnPrimary: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    btnPrimaryText: {
      color: "#ffffff",
      fontWeight: "900",
    },

    btnDanger: {
      backgroundColor: "#dc2626",
      borderColor: "#dc2626",
    },

    btnDangerText: {
      color: "#ffffff",
      fontWeight: "900",
    },

    disabled: {
      opacity: 0.6,
    },
  });
}