import Image from "next/image";
import PostButtons from "./buttons/post-btns";
import TopicBtns from "./topics";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import useLoginCheck from "../utils/useLoginCheck";
import GetJwtToken from "../utils/GetJwtToken";

export default function Post() {
  const [data, setData] = useState<PostData | null>(null);
  const loggedIn = useLoginCheck("noSet");

  type PostData = {
    post_id: string;
    user_id: string;
    tags: Array<string>;
    profile_name: string;
    title: string;
    text: string;
    media_type: string;
  };

  const token = GetJwtToken(loggedIn);

  useEffect(() => {
    const apiEndpoint = process.env.NEXT_PUBLIC_LOAD_USR_POST;
    fetch(`${apiEndpoint}${loggedIn}` || "INCORRECT_ENDPOINT", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data as PostData);
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  }, [loggedIn, token]);

  const getImageEndpoint =
    process.env.NEXT_PUBLIC_GET_POST_API_MEDIA || "images/";

  const mediaSrc =
    getImageEndpoint +
    (data && data.post_id ? data.post_id : "placeholder.png");

  return (
    <div>
      <div className=" relative m-3 rounded-xl border border-solid border-violet-700 text-gray-200 p-5 pb-1  to-gray-500 from-gray-700 bg-gradient-to-r shadow-md shadow-black ">
        <div className="flex justify-between">
          <TopicBtns />
          <button className=" h-6 w-4 rounded-lg bg-red-700 p-1 text-xs text-white">
            x
          </button>
        </div>
        <h2 className="text-2xl mt-5 ">
          <b></b>
        </h2>
        <p>
          By:{" "}
          {data && data.profile_name ? data.profile_name : "Placeholder text"}
        </p>
        <div>
          {data && data.media_type === "image" ? (
            <Image
              data-testid="image"
              className="mt-2 rounded border border-solid border-violet-700 shadow shadow-black"
              src={
                getImageEndpoint +
                (data && data.post_id ? data.post_id : "placeholder.png")
              }
              alt={data.media_type}
              width={600}
              height={600}
            />
          ) : (
            <video
              data-testid="video"
              className=""
              src={mediaSrc}
              width={600}
              height={600}
              controls
            />
          )}
        </div>
        <h2 className="mt-4">
          <b>{data && data.title ? data.title : "Placeholder text"}</b>
        </h2>{" "}
        <p>{data && data.text ? data.text : "Placeholder text"}</p>
        <div className=" underline">
          <Link href="./post-page" legacyBehavior>
            <a>Open conversation... </a>
          </Link>
          <PostButtons />
        </div>
      </div>
    </div>
  );
}
