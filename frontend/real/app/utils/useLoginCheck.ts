import { useEffect, useState, Dispatch, SetStateAction } from "react";

// Overload signatures
function useLoginCheck(noSet: string): boolean;
function useLoginCheck(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
];

// Implementation
function useLoginCheck(
  noSet?: string
): boolean | [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  // Your implementation logic here

  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const jwtValue = sessionStorage.getItem("jwt");
      if (jwtValue) {
        setLoggedIn(true);
      }
    }
  }, []);
  if (noSet === "noSet") return loggedIn;
  else return [loggedIn, setLoggedIn];
}

export default useLoginCheck;
