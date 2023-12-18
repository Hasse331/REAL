// @ts-nocheck

import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import Link from "next/link";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ReturnBtn from "@/app/components/buttons/return-button";
import GetJwtToken from "@/app/utils/GetJwtToken";
import useLoginCheck from "@/app/utils/useLoginCheck";

function Login() {
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const [noAlert, setNoAlert] = useState(false);
  const router = useRouter();

  const loggedIn = useLoginCheck();
  useEffect(() => {
    const token = GetJwtToken(loggedIn);
    if (token && !noAlert) {
      alert("You have already logged in!");
      router.push("/");
      return;
    }
  }, [loggedIn, noAlert, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const dataObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      dataObject[key] = value;
    });
    const apiEndpoint = process.env.NEXT_PUBLIC_LOGIN;

    fetch(apiEndpoint || "ENV_VARIABLE_NOT_FOUND", {
      method: "POST",
      body: JSON.stringify(dataObject),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResponseMessage(data.message);
        if (data.success === true) {
          setResponseStatus("success");
          setNoAlert(true);
          /* Session Storage has XSS vulnerabilities -> change later */
          sessionStorage.removeItem("jwt");
          sessionStorage.setItem("jwt", data.token);
          router.push("/");
        } else {
          setResponseStatus("error");
        }
      })
      .catch(() => {
        setResponseMessage("An error occurred while loggin in.");
        setResponseStatus("error");
      });
  };

  return (
    <div>
      <Layout />
      <div className="ml-1">
        <ReturnBtn />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="mb-4 text-1xl font-bold">Login</h1>

        <form className="w-80" onSubmit={handleSubmit}>
          <hr />
          <div className="mb-4 mt-5">
            <label htmlFor="email-id" className="mb-2 block text-sm font-bold ">
              Email
            </label>
            <input
              id="email-id"
              type="email"
              name="email"
              className="w-full max-w-xs appearance-none rounded border px-3 py-2 shadow"
              placeholder="Email"
              autoComplete="on"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password-id"
              className="mb-2 block text-sm font-bold"
            >
              Password
            </label>
            <input
              id="password-id"
              name="password"
              type="password"
              className="w-full max-w-xs appearance-none rounded border px-3 py-2 shadow"
              placeholder="Password"
              required
            />
            <div>
              <Link href="./forgot" legacyBehavior>
                <a>
                  <p className="text-sm underline">Forgot the password?</p>
                </a>
              </Link>
              <Link href="./register" legacyBehavior>
                <a>
                  <p className="text-sm underline">Register here.</p>
                </a>
              </Link>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="remember-id" className="flex items-center">
              <input
                name="remember"
                type="hidden"
                className="mr-2"
                value="no"
              />
              <input
                name="remember"
                id="remember-id"
                type="checkbox"
                className="mr-2"
                value="yes"
              />
              <span className="text-sm">Remember me for 14 days.</span>
            </label>
          </div>
          <button className="bg-violet-700" type="submit">
            Login
          </button>
          <div>
            {responseStatus === "success" && (
              <p className="text-green-600">{responseMessage}</p>
            )}
            {responseStatus === "error" && (
              <p className="text-red-600">{responseMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
