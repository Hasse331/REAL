import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import Post from "../app/components/post";
import InfiniteScroll from "../app/utils/infinite-scroll";
import LeftNavBtn from "../app/components/buttons/nav-left";
import React from "react";
import { useState, useEffect } from "react";
import useLoginCheck from "@/app/utils/useLoginCheck";
import Link from "next/link";
import GetJwtToken from "@/app/utils/GetJwtToken";

function Home() {
  const [data, setData] = useState<PostData[] | null>(null);
  const loggedIn = useLoginCheck("noSet");
  const token = GetJwtToken(loggedIn);

  type PostData = {
    post_id: string;
    user_id: string;
    tags: Array<string>;
    profile_name: string;
    title: string;
    text: string;
    media_type: string;
  }[];

  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      setData(JSON.parse(savedPosts));
    } else {
      const postDataEndpoint = process.env.NEXT_PUBLIC_LOAD_USR_POST_DATA;
      fetch(
        `${postDataEndpoint}${loggedIn}` ||
          "INCORRECT_ENDPOINT: postDataEndpoint, post.tsx",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("posts", JSON.stringify(data));
          setData(data as PostData[]);
        })
        .catch((error) => {
          console.log("ERROR:", error);
        });
    }
  }, []);

  return (
    <div>
      <Layout />
      <div className="flex justify-center mt-2 ">
        {loggedIn && (
          <Link href="./new-post">
            <button className=" m-3">Make New Post!</button>
          </Link>
        )}
      </div>
      {data ? <Post displaRNavBtn={true} data={data} /> : "Loading..."}

      <LeftNavBtn link="./contacts" useReturn={false} />
    </div>
  );
}

export default Home;
