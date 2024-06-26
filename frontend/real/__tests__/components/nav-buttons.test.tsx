import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import LeftNavBtn from "../../app/components/buttons/navLeft";
import RightNavBtn from "../../app/components/buttons/navRight";
import "@testing-library/jest-dom";

type childrendProp = {
  children: React.ReactNode;
};

jest.mock("next/link", () => {
  return ({ children }: childrendProp) => children;
});

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    back: jest.fn(),
    push: jest.fn(),
  })),
}));

describe("Not returning tests", () => {
  test("LeftNav button renders and clicked", () => {
    render(<LeftNavBtn link="/some-path" />);

    const button = screen.getByText("🡨");

    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
  test("RightNav button renders and clicked", () => {
    render(<RightNavBtn link="/some-path" />);

    const button = screen.getByText("🡪");

    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
describe("Returning tests", () => {
  test("LeftNav button renders and clicked", () => {
    render(<LeftNavBtn link="/some-path" useReturn={true} />);

    const button = screen.getByText("🡨");

    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
  test("RightNav button renders and clicked", () => {
    render(<RightNavBtn link="/some-path" useReturn={true} />);

    const button = screen.getByText("🡪");

    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
