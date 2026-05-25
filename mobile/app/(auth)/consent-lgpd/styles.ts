// app/(auth)/consent-lgpd/styles.ts
import { StyleSheet } from "react-native";

export const createStyles = (theme: any) =>
  StyleSheet.create({
    scrollContainer: {
      padding: 24,
    },

    title: {
      fontSize: 22,
      fontWeight: "900",
      color: theme.text,
      marginBottom: 8,
    },

    subtitle: {
      color: theme.muted,
      marginBottom: 18,
    },

    cardText: {
      color: theme.text,
      lineHeight: 20,
    },

    acceptRow: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    acceptLabel: {
      fontWeight: "900",
      color: theme.text,
    },
  });
