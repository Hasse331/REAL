import GetJwtToken from "./GetJwtToken";
import jwt_decode from "jwt-decode";

export default function getUserUUID() {
  interface MyToken {
    sub: string;
  }

  const token = GetJwtToken(true);
  if (token) {
    const decodedToken = jwt_decode(token) as MyToken;
    if (!decodedToken) return;
    return decodedToken.sub;
  }
}
