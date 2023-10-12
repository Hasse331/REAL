import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import LeftNavBtn from "../app/components/buttons/nav-left";
import Image from "next/image";
import InfiniteScroll from "../app/components/infinite-scroll";
import Post from "../app/components/post";
import TopicBtns from "../app/components/topics";
import Link from "next/link";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export default function Profile() {
  type ProfileData = {
    profile_name: string;
    tags: Array<string>;
    image: string;
    about: string;
    title: string;
    text: string;
    url: string;
    visibility: string;
  };
  const [data, setData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  let loggedIn;
  if (typeof window !== "undefined" && window.sessionStorage) {
    loggedIn = !!sessionStorage.getItem("jwt");
  }

  const router = useRouter();
  let userId = router.query.userId;
  let jwtUsed = false;

  if (userId === "jwt") {
    const token = sessionStorage.getItem("jwt");
    jwtUsed = true;
    if (!token) {
      setError("No token found");
    }

    type DecodedToken = {
      sub: string;
    };

    if (token) {
      const decodedToken = jwt_decode(token) as DecodedToken;
      userId = decodedToken.sub;
    }
  }

  useEffect(() => {
    const apiEndpoint = process.env.NEXT_PUBLIC_PROFILE_API_ENDPOINT;
    fetch(`${apiEndpoint}${userId}` || "INCORRECT_ENDPOINT", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data as ProfileData);
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  }, [userId]);

  if (!data) return <div>Loading page...</div>;

  return (
    <div>
      <Layout />
      <LeftNavBtn link="./" />
      <div className="m-6">
        <div className="flex">
          <h2 className="text-2xl mr-4">
            <b>{data.profile_name}</b>
          </h2>
          <div>
            {loggedIn && jwtUsed && (
              <Link href={"./edit-profile"}>
                <button>Edit Profile</button>
              </Link>
            )}
          </div>
        </div>
        <Image
          className=" mt-3 rounded border border-solid border-violet-700 shadow shadow-black"
          src={data.image}
          alt=""
          width={500}
          height={500}
        />
        <div>
          <p>Interests / Topics:</p>
          <TopicBtns />
        </div>
        <br />
        <h2>
          <b>About Me:</b>
        </h2>
        <p>{data.about}</p>
        <h2>
          <b>{data.title}</b>
          <p>{data.text}</p>
        </h2>
        <h2>
          <b>URL link:</b>
          <p>
            <a className="underline" href={data.url}>
              {data.url}
            </a>
          </p>
        </h2>
        <button
          type="submit"
          className="rounded bg-violet-700 px-3 py-1 font-bold text-white hover:bg-violet-800"
        >
          Request
        </button>
        <button
          type="submit"
          className="m-1 rounded bg-violet-700 px-3 py-1 font-bold text-white hover:bg-violet-800"
        >
          Subscribe
        </button>
        <h1>Posts by: {data.profile_name}</h1>
        <InfiniteScroll ComponentToRender={Post} />
      </div>
    </div>
  );
}
