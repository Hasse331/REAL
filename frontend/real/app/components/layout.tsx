import "../styles/globals.css";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import useLoginCheck from "../utils/check_jwt";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
  children?: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
    </div>
  );
}

function NavBar() {
  const [loggedIn, setLoggedIn] = useLoginCheck();
  const router = useRouter();
  function handleLogout() {
    console.log("logging out...");
    sessionStorage.removeItem("jwt");
    setLoggedIn(false);
    router.push("./");
  }

  return (
    <nav>
      <div className="flex rounded bg-gradient-to-r from-30% via-80% shadow shadow-black via-violet-800 to-violet-600 from-violet-950 px-4 text-blue-50 justify-between">
        <div className="ml-2 flex justify-normal">
          <Link href={"./"}>
            <h1>
              R<span className="text-violet-700 p-0 mb-0">E</span>AL
            </h1>
          </Link>
          <p className="text-xs text-violet-700 p-0 mb-0 ml-0 mt-5">Beta</p>
        </div>

        <div>
          {loggedIn ? (
            <div className="flex mt-3">
              <div>
                <button
                  onClick={handleLogout}
                  className="rounded mr-4 mt-1 hover:hover:bg-violet-700"
                >
                  Logout
                </button>
              </div>
              <Link href={"./profile?userId=jwt"}>
                <Image
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
                  <li className="rounded p-2 hover:hover:bg-violet-700">
                    Login
                  </li>
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
      </div>
    </nav>
  );
}

export default Layout;
