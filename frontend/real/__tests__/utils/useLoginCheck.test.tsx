import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TestComponentWithNoSet from "./UseLoginTestNoSet";
import TestComponent from "./UseLoginTest";

describe("TestComponentWithNoSet", () => {
  beforeEach(() => {
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: jest.fn(() => "mocked-jwt-token"),
      },
      writable: true,
    });
  });
  test("should return loggedIn boolean", () => {
    render(<TestComponentWithNoSet />);
    expect(screen.getByText(/Logged in: true/)).toBeInTheDocument();
  });
});

describe("TestComponentWithState", () => {
  test("should return loggedIn and setLoggedIn", () => {
    render(<TestComponent setStateTest={false} />);
    expect(screen.getByText(/Logged in: true/)).toBeInTheDocument();
  });
});
