import React from "react";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = {
  message?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};

export default function LoadingState({
  message = "Carregando...",
  style,
  textStyle,
  testID,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, style]} testID={testID}>
      <ActivityIndicator color={theme.primary} />
      <Text style={[styles.text, { color: theme.muted }, textStyle]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 10,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
  },
});
