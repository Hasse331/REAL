import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import LeftNavBtn from "../../app/components/buttons/nav-left";
import RightNavBtn from "../../app/components/buttons/nav-right";
import "@testing-library/jest-dom";

type childrendProp = {
  children: React.ReactNode;
};

jest.mock("next/link", () => {
  return ({ children }: childrendProp) => children;
});

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
