// @ts-nocheck

import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import ReturnBtn from "@/app/components/buttons/return-button";
import { postFormData } from "@/app/utils/api";
import GetJwtToken from "@/app/utils/GetJwtToken";
import useLoginCheck from "@/app/utils/useLoginCheck";
import { useEffect } from "react";

function Register() {
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const router = useRouter();
  const loggedIn = useLoginCheck();

  useEffect(() => {
    const token = GetJwtToken(loggedIn);
    if (token) {
      alert("You have already registered and logged in!");
      router.push("/");
      return;
    }
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = GetJwtToken(loggedIn);
    if (token) {
      setResponseMessage("You have already registered and logged in!");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const apiEndpoint =
      process.env.NEXT_PUBLIC_REGISTER || "ENV_VARIABLE_NOT_FOUND";

    interface RegisterResponse {
      message: string;
      success: boolean;
    }

    try {
      const data = await postFormData<RegisterResponse>(
        apiEndpoint,
        formData,
        token
      );
      setResponseMessage(data.message);
      if (data.success === true) {
        setResponseStatus("success");
        router.push("/login");
      } else {
        setResponseStatus("error");
      }
    } catch (error) {
      setResponseMessage("An error occurred while registering.");
      setResponseStatus("error");
    }
  }

  return (
    <div>
      <Layout />
      <div className="ml-1">
        <ReturnBtn />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="mb-4 text-2xl font-bold">Register</h1>

        <form className="w-80" onSubmit={handleSubmit}>
          <hr />
          <div className="grid grid-cols-2 mt-3 gap-4">
            <div className="mb-4 ">
              <label
                htmlFor="first-name-id"
                className="mb-2 block text-sm font-bold"
              >
                First Name
              </label>
              <input
                name="first_name"
                id="first-name-id"
                type="text"
                className="w-full appearance-none rounded border px-3 py-2 shadow"
                placeholder="First name"
                autoComplete="on"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="last-name-id"
                className="mb-2 block text-sm font-bold"
              >
                Last Name
              </label>
              <input
                name="last_name"
                id="last-name-id"
                type="text"
                className="w-full appearance-none rounded border px-3 py-2 shadow"
                placeholder="Last name"
                autoComplete="on"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email-id" className="mb-2 block text-sm font-bold">
              Email
            </label>
            <input
              name="email"
              id="email-id"
              type="email"
              className="w-full appearance-none rounded border px-3 py-2 shadow"
              placeholder="Email"
              autoComplete="on"
              minLength={6}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="phone-id" className="mb-2 block text-sm font-bold">
              Phone (use country code e.g +358)
            </label>
            <input
              name="phone"
              id="phone-id"
              type="phone"
              className="w-full appearance-none rounded border px-3 py-2 shadow"
              placeholder="Phone number"
              autoComplete="on"
              required
            />
          </div>
          <hr></hr>
          <div className="mb-4 mt-2">
            <label
              htmlFor="password-id"
              className="mb-2 block text-sm font-bold"
            >
              Password
            </label>
            <input
              name="password"
              id="password-id"
              type="password"
              className="w-full appearance-none rounded border px-3 py-2 shadow"
              placeholder="Password"
              autoComplete="on"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password-confirm-id"
              className="mb-2 block text-sm font-bold "
            >
              Confirm Password
            </label>
            <input
              name="password_confirm"
              id="password-confirm-id"
              type="password"
              className="w-full appearance-none rounded border px-3 py-2 shadow"
              placeholder="Confirm Password"
              autoComplete="on"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="accept-box-id" className="flex items-center">
              <input
                name="accept"
                id="accept-box-id"
                type="checkbox"
                className="mr-2"
                required
              />
              <span className="text-sm">I agree to the tems & conditions</span>
            </label>
          </div>
          <button className="bg-violet-700" type="submit">
            Register
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

export default Register;
