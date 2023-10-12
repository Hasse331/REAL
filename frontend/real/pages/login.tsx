import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import ReturnBtn from "@/app/components/buttons/return-button";

function Login() {
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const dataObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      dataObject[key] = value;
    });
    const apiEndpoint = process.env.NEXT_PUBLIC_LOGIN_API_ENDPOINT;

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
          /* Session Storage has XSS vulnerabilities -> change later */
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
      <div className="ml-14 mt-5">
        <ReturnBtn />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
        <form className="w-80" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email-id"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
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
              className="mb-2 block text-sm font-bold text-gray-700"
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
              <Link href="./forgot">
                <p className="text-sm underline">Forgot the password?</p>
              </Link>
              <Link href="./register">
                <p className="text-sm underline">Register here.</p>
              </Link>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="remember-id" className="flex items-center">
              <input
                name="remember"
                type="hidden"
                className="mr-2"
                value="False"
              />
              <input
                name="remember"
                id="remember-id"
                type="checkbox"
                className="mr-2"
                value="True"
              />
              <span className="text-sm">Keep me signed in.</span>
            </label>
          </div>
          <button typeof="submit">Login</button>
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
