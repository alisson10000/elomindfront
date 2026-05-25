import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type AppButtonVariant = "primary" | "secondary";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: AppButtonVariant;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style,
  pressedStyle,
  textStyle,
  testID,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isPrimary ? theme.primary : theme.input,
          borderColor: isPrimary ? theme.primary : theme.border,
          opacity: isDisabled ? 0.7 : 1,
          shadowColor: isPrimary ? theme.shadow : "transparent",
          shadowOpacity: isPrimary ? 0.18 : 0,
          elevation: isPrimary ? 5 : 0,
        },
        pressed && !isDisabled ? styles.pressed : null,
        pressed && !isDisabled ? pressedStyle : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? theme.primaryText : theme.text}
          testID={testID ? `${testID}-loading` : undefined}
        />
      ) : (
        <Text
          style={[
            styles.text,
            { color: isPrimary ? theme.primaryText : theme.text },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  text: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
