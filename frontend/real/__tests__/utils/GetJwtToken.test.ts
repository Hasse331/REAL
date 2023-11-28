import GetJwtToken from "../../app/utils/GetJwtToken";

describe("GetJwtToken", () => {
  beforeEach(() => {
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: jest.fn(() => "mocked-jwt-token"),
      },
      writable: true,
    });
  });
  test("should return a token when logged in", () => {
    const token = GetJwtToken(true);
    expect(token).toBe("mocked-jwt-token");
  });
  test("should NOT return a token when NOT logged in", () => {
    const token = GetJwtToken(false);
    expect(token).toBeUndefined();
  });

  test("should return a token from sessionStorage when called with correct argument 'jwt'", () => {
    window.sessionStorage.getItem = jest
      .fn()
      .mockImplementationOnce((key: string) => {
        if (key === "jwt") {
          return "mocked-jwt-token";
        }
        return null; // Return null if any other key is requested
      });
    const token = GetJwtToken(true);
    expect(token).toBe("mocked-jwt-token");
  });
  test("should return undefined if the token is not in sessionStorage", () => {
    window.sessionStorage.getItem = jest.fn().mockReturnValue(null);
    const token = GetJwtToken(true);
    expect(token).toBeUndefined();
  });
  test("should handle exceptions during token retrieval", () => {
    window.sessionStorage.getItem = jest.fn().mockImplementationOnce(() => {
      throw new Error("Access Denied");
    });
    const token = GetJwtToken(true);
    expect(token).toBeUndefined();
  });
  test("should call sessionStorage.getItem with the correct key", () => {
    GetJwtToken(true);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith("jwt");
  });
  test("should not call sessionStorage.getItem when NOT logged in", () => {
    GetJwtToken(false);
    expect(window.sessionStorage.getItem).not.toHaveBeenCalled();
  });
});
