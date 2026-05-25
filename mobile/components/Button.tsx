import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

import AppButton from "./AppButton";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Button({
  title,
  onPress,
  loading,
  disabled,
  style,
  textStyle,
}: Props) {
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
  );
}
