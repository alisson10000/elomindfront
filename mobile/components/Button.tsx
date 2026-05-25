import React from "react";
<<<<<<< HEAD
import { StyleProp, TextStyle, ViewStyle } from "react-native";

import AppButton from "./AppButton";
=======
import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
<<<<<<< HEAD
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
=======
  style?: ViewStyle;
  textStyle?: TextStyle;
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
};

export default function Button({
  title,
  onPress,
  loading,
  disabled,
  style,
  textStyle,
}: Props) {
<<<<<<< HEAD
  return (
    <AppButton
      title={title}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={style}
      textStyle={textStyle}
      variant="secondary"
    />
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  );
}
