import { StyleSheet } from "react-native";

export function makeStyles(theme: any) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },

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

    backBtn: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    backBtnText: { color: theme.text, fontWeight: "900" },

    headerTitle: { color: theme.text, fontSize: 16, fontWeight: "900" },
    headerSubtitle: { color: theme.muted, marginTop: 2 },

    content: { padding: 16, paddingBottom: 28 },

    metaMuted: { color: theme.muted },
    metaStrong: { color: theme.text, fontWeight: "900" },

    card: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 14,
    },
    cardTitle: { color: theme.text, fontWeight: "900", marginBottom: 8 },

    loadingWrap: { paddingTop: 30, alignItems: "center" },
    loadingText: { marginTop: 10, color: theme.muted },

    btn: {
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    btnText: { color: theme.text, fontWeight: "900" },

    btnPrimary: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    btnPrimaryText: { color: "#0B1220", fontWeight: "900" },

    btnDanger: {
      borderColor: theme.danger,
      backgroundColor: theme.danger,
    },
    btnDangerText: { color: "#FFFFFF", fontWeight: "900" },

    inputLabel: { color: theme.text, fontWeight: "900", marginTop: 6 },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      color: theme.text,
      backgroundColor: theme.background,
      textAlignVertical: "top",
    },

    row: { flexDirection: "row", gap: 10, marginTop: 10 },
    flex1: { flex: 1 },

    gap12: { gap: 12 },
    mt16: { marginTop: 16 },

    emptyCenter: { flex: 1, padding: 16, justifyContent: "center" },
    titleBig: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "900",
      marginBottom: 10,
    },
  });
}
