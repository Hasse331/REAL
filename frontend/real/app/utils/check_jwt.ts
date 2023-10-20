import { useEffect, useState } from "react";

export default function useLoginCheck() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const jwtValue = sessionStorage.getItem("jwt");
      if (jwtValue) {
        setLoggedIn(true);
      }
    }
  }, []);
  return [loggedIn, setLoggedIn];
}
