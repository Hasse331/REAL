import React from "react";
import "../app/styles/globals.css";
import NavBar from "@/app/components/navbar";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <NavBar />
      <Component {...pageProps} />
    </React.StrictMode>
  );
}

export default MyApp;
