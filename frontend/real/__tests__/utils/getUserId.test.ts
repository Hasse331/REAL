/**
 * @jest-environment jsdom
 */
import getUserUUID from "../../app/utils/getUserId";
const GetJwtToken = require("../../app/utils/GetJwtToken");
const jwtDecode = require("jwt-decode");

jest.mock("jwt-decode", () => {
  return jest.fn(() => ({
    sub: "mock-sub-value",
  }));
});

jest.mock("../../app/utils/GetJwtToken", () => {
  return jest.fn(() => "mocked-token");
});

describe("getUserUUID Test", () => {
  // 1. Valid Input Test
  test("should return user id", () => {
    const userId = getUserUUID();
    expect(GetJwtToken).toHaveBeenCalled();
    expect(userId).toBe("mock-sub-value");
  });
  // Test for no token scenario
  test("should return undefined if no token is present", () => {
    GetJwtToken.mockImplementationOnce(() => null);
    const userId = getUserUUID();
    expect(userId).toBeUndefined();
  });
  // Test for jwt-decode returning null (or unexpected structure)
  test("should handle when jwt-decode returns null", () => {
    jwtDecode.mockImplementationOnce(() => null);
    const userId = getUserUUID();
    expect(userId).toBeUndefined();
  });
});
