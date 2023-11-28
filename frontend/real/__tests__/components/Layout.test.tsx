import React from "react";
import NavBar from "../../app/components/layout";
import "@testing-library/jest-dom";
import useLoginCheck from "../../app/utils/useLoginCheck";
import { render, screen } from "@testing-library/react";

jest.mock("../../app/utils/useLoginCheck");
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
  })),
}));

describe("Layout NavBar Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render logout and profile when logged in", () => {
    const mockedUseLoginCheck = useLoginCheck as jest.Mock;
    mockedUseLoginCheck.mockImplementation(() => [true, jest.fn()]);

    render(<NavBar />);
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    expect(screen.getByTestId("profile-image")).toBeInTheDocument();
  });

  test("Render login and register when NOT logged in", () => {
    const mockedUseLoginCheck = useLoginCheck as jest.Mock;
    mockedUseLoginCheck.mockImplementation(() => [false, jest.fn()]);

    render(<NavBar />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });
});
