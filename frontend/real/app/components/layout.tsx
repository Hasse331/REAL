import "../styles/globals.css";
import Link from "next/link";
import Image from "next/image";

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
  let loggedIn;
  if (typeof window !== "undefined" && window.sessionStorage) {
    loggedIn = !!sessionStorage.getItem("jwt");
  }

  return (
    <nav>
      <div className="flex rounded bg-violet-950 px-2 text-blue-50 justify-between">
        <div>
          <Link href={"./"}>
            <h1 className="ml-2 text-left">
              R<span className="text-violet-700">E</span>AL
            </h1>
          </Link>
        </div>
        <div>
          {loggedIn ? (
            <div className="flex mt-3">
              <Link href={"./"}>
                <ul>
                  <li
                    onClick={handleLogout}
                    className="rounded p-2 mr-4 hover:hover:bg-violet-700"
                  >
                    Logout
                  </li>
                </ul>
              </Link>
              <Link href={"./profile?userId=jwt"}>
                <Image
                  className="rounded-xl mt-1 mr-3 border-2 border-solid border-violet-700 "
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
  function handleLogout() {
    sessionStorage.removeItem("jwt");
  }
}

export default Layout;
