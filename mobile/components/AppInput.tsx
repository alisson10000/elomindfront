import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = TextInputProps & {
  inputStyle?: TextInputProps["style"];
};

export default function AppInput({
  editable = true,
  inputStyle,
  placeholderTextColor,
  ...props
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <TextInput
      editable={editable}
      placeholderTextColor={placeholderTextColor ?? theme.placeholder}
      style={[
        styles.input,
        {
          borderColor: theme.border,
          backgroundColor: theme.input,
          color: theme.text,
          opacity: editable ? 1 : 0.75,
        },
        inputStyle,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
  },
});
