import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

import AppInput from "@/components/AppInput";

describe("AppInput", () => {
  it("renders the current value", () => {
    render(<AppInput value="alguem@teste.com" onChangeText={() => undefined} />);

    expect(screen.getByDisplayValue("alguem@teste.com")).toBeTruthy();
  });

  it("calls onChangeText when typing", () => {
    const onChangeText = jest.fn();

    render(
      <AppInput
        placeholder="Digite aqui"
        value=""
        onChangeText={onChangeText}
      />
    );

    fireEvent.changeText(screen.getByPlaceholderText("Digite aqui"), "novo valor");

    expect(onChangeText).toHaveBeenCalledWith("novo valor");
  });
});
