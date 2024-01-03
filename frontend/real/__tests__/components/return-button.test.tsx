import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReturnBtn from "../../app/components/buttons/returnButton";

describe("ReturnBtn Component test", () => {
  test("Should render and click the return button", () => {
    render(<ReturnBtn />);

    const button = screen.getByText("🡨 Return");
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
