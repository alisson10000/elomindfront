import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";

import LoginScreen from "@/app/(auth)/login";

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockLoadRemember = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    replace: mockReplace,
    push: mockPush,
  },
}));

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

jest.mock("@/lib/remember", () => ({
  loadRemember: (...args: unknown[]) => mockLoadRemember(...args),
}));

jest.mock("@/lib/auth", () => ({
  loginWithSession: jest.fn(),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadRemember.mockResolvedValue({
      remember: true,
      email: "alguem@teste.com",
    });
  });

  it("renders the main login content", async () => {
    render(<LoginScreen />);

    expect(screen.getByText("Entre para registrar suas reflexões")).toBeTruthy();
    expect(screen.getByText("Esqueci minha senha")).toBeTruthy();
    expect(screen.getByText("Tenho um código de convite")).toBeTruthy();

    await waitFor(() => {
      expect(mockLoadRemember).toHaveBeenCalledTimes(1);
      expect(screen.getByDisplayValue("alguem@teste.com")).toBeTruthy();
    });
  });
});
