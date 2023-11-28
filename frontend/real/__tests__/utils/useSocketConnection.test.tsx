import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import SocketTestComponent from "./UseSocketTestComponent";
import { io } from "socket.io-client";
import useLoginCheck from "../../app/utils/useLoginCheck";
import GetJwtToken from "../../app/utils/GetJwtToken";
import React from "react";

jest.mock("socket.io-client", () => ({
  io: jest.fn().mockImplementation(() => ({
    // Mock methods and properties of the socket object as needed
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

jest.mock("../../app/utils/GetJwtToken", () => jest.fn());
jest.mock("../../app/utils/useLoginCheck", () => jest.fn());

describe("Testing useSocketConnection hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should establish socket connection", () => {
    const mockedUseLoginCheck = useLoginCheck as jest.Mock;
    mockedUseLoginCheck.mockReturnValue(true);
    const mockedGetJwtToken = GetJwtToken as jest.Mock;
    mockedGetJwtToken.mockReturnValue("mocked-token");

    render(<SocketTestComponent />);

    expect(io).toHaveBeenCalledWith("http://localhost:3030", {
      query: {
        token: "mocked-token",
        serviceIdentifier: "REAL_FRONTEND",
      },
    });
  });
  test("Should NOT establish socket connection when not logged in and no token", () => {
    const mockedUseLoginCheck = useLoginCheck as jest.Mock;
    mockedUseLoginCheck.mockReturnValue(false);
    const mockedGetJwtToken = GetJwtToken as jest.Mock;
    mockedGetJwtToken.mockReturnValue(false);

    render(<SocketTestComponent />);

    expect(io).not.toHaveBeenCalledWith("http://localhost:3030", {
      query: {
        token: "mocked-token",
        serviceIdentifier: "REAL_FRONTEND",
      },
    });
  });
});
