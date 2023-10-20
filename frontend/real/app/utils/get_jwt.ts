export default function GetJwtToken(loggedIn: boolean) {
  let token = null;
  try {
    token = sessionStorage.getItem("jwt");
    return token;
  } catch {
    return token;
  }
}
