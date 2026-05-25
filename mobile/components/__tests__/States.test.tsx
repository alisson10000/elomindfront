import React from "react";
import { render, screen } from "@testing-library/react-native";

import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";

describe("state components", () => {
  it("renders the loading message", () => {
    render(<LoadingState message="Buscando dados..." />);

    expect(screen.getByText("Buscando dados...")).toBeTruthy();
  });

  it("renders the error title and message", () => {
    render(<ErrorState title="Falha" message="Tente novamente." />);

    expect(screen.getByText("Falha")).toBeTruthy();
    expect(screen.getByText("Tente novamente.")).toBeTruthy();
  });
});
