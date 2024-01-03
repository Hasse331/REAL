import "../styles/globals.css";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import useLoginCheck from "../utils/useLoginCheck";
import { useRouter } from "next/router";

type Props = {
  children?: React.ReactNode;
};

export default function NavBar({ children }: Props) {
  return (
    <div>
      <nav className="flex rounded bg-gradient-to-r from-30% via-80% shadow shadow-black via-violet-800 to-violet-500 from-violet-950 px-4 text-blue-50 justify-between">
        <Logo />
        <LogRegLogoutButtons />
      </nav>
      <main>{children}</main>
    </div>
  );
}

function Logo() {
  const router = useRouter();

  function handleLogoClick() {
    if (window.location.pathname === "/") {
      localStorage.clear();
      window.location.reload();
    } else {
      router.push("./");
    }
  }

  return (
    <div className="ml-2 flex justify-normal">
      <button onClick={handleLogoClick} className="bg-none shadow-none m-0 p-0">
        <h1>
          R<span className="text-violet-700 p-0 mb-0">E</span>AL
        </h1>
      </button>
      <p className="text-xs text-violet-700 p-0 mb-0 ml-0 mt-5">Beta</p>
    </div>
  );
}

function LogRegLogoutButtons() {
  const [loggedIn, setLoggedIn] = useLoginCheck();
  const router = useRouter();

  function handleLogout() {
    console.log("logging out...");
    sessionStorage.removeItem("jwt");
    setLoggedIn(false);
    localStorage.clear();
    router.push("./");
  }
  return (
    <div>
      {loggedIn ? (
        <div className="flex mt-3">
          <div>
            <button
              data-testid="logout-button"
              onClick={handleLogout}
              className="rounded mr-4 mt-1 hover:hover:bg-violet-700"
            >
              Logout
            </button>
          </div>
          <Link href={"./contacts"}>
            <Image
              data-testid="profile-image"
              className="rounded-xl mt-2 mr-1 border-2 border-solid border-violet-700  hover:border-violet-900 "
              src="/images/chat.jpg"
              alt="profile"
              width={33}
              height={33}
            />
          </Link>
          <Link href={"./profile?userId=myJwt"}>
            <Image
              data-testid="profile-image"
              className="rounded-xl mt-1 mr-3 border-2 border-solid border-violet-700  hover:border-violet-900 "
              src="/images/profile.jpg"
              alt="profile"
              width={35}
              height={35}
            />
          </Link>
        </div>
      ) : (
        <div>
          <ul className="flex m-4">
            <Link href={"./login"}>
              <li className="rounded p-2 hover:hover:bg-violet-700">Login</li>
            </Link>
            <Link href={"./register"}>
              <li className="rounded p-2 hover:hover:bg-violet-700">
                Register
              </li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
}
