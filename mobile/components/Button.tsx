import React from "react";
import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function Button({
  title,
  onPress,
  loading,
  disabled,
  style,
  textStyle,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const isDisabled = !!disabled || !!loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        {
          paddingVertical: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          alignItems: "center",
          opacity: isDisabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text
          style={[
            { fontSize: 16, fontWeight: "900", color: theme.text },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
