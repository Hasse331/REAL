import "../app/styles/globals.css";
import Post from "../app/components/post/post";
import React from "react";
import { useState, useEffect } from "react";
import useLoginCheck from "@/app/utils/useLoginCheck";
import Link from "next/link";
import GetJwtToken from "@/app/utils/GetJwtToken";

type PostData = {
  post_id: string;
  user_id: string;
  tags: Array<string>;
  profile_name: string;
  title: string;
  text: string;
  media_type: string;
}[];

function Home() {
  // FETCHING OBJECT LIST OF USER POSTS:
  const [data, setData] = useState<PostData[] | null>(null);
  const loggedIn = useLoginCheck("noSet");
  const token = GetJwtToken(loggedIn);
  // TASK: Make this to fetch more posts and continue the OL:
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
      <NewPostButton />
      {data ? <Post displaNavButtons={true} data={data} /> : "Loading..."}
    </div>
  );
}

function NewPostButton() {
  const loggedIn = useLoginCheck("noSet");
  return (
    <div className="flex justify-center mt-2 ">
      {loggedIn && (
        <Link href="./newPost">
          <button className=" m-3">Make New Post!</button>
        </Link>
      )}
    </div>
  );
}

export default Home;
