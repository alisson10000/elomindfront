import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

import AppButton from "@/components/AppButton";

describe("AppButton", () => {
  it("renders the button label", () => {
    render(<AppButton title="Salvar" onPress={() => undefined} />);

    expect(screen.getByText("Salvar")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();

    render(<AppButton title="Entrar" onPress={onPress} />);

    fireEvent.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows loading indicator when loading", () => {
    render(
      <AppButton
        title="Entrar"
        onPress={() => undefined}
        loading
        testID="submit-button"
      />
    );

    expect(screen.queryByText("Entrar")).toBeNull();
    expect(screen.getByTestId("submit-button-loading")).toBeTruthy();
  });
});
