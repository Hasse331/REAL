function GetJwtToken(loggedIn: boolean): string | undefined {
  try {
    if (!loggedIn) return undefined;

    const token = sessionStorage.getItem("jwt");
    if (!token) {
      console.error("Token not found in sessionStorage!");
      return undefined;
    }

    return token;
  } catch {
    console.error("an error occurred while getting the JWT token");
  }
}

export default GetJwtToken;
