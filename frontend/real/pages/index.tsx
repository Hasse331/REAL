import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import Post from "../app/components/post";
import InfiniteScroll from "../app/utils/infinite-scroll";
import LeftNavBtn from "../app/components/buttons/nav-left";
import React from "react";
import { useState } from "react";
import useLoginCheck from "@/app/utils/useLoginCheck";
import Link from "next/link";

function Home() {
  const [loggedIn, setLoggedIn] = useLoginCheck();
  const [postProfileId, setPostProfileId] = useState<string | null>(null);

  const handleProfileIdChange = (newProfileId: string) => {
    setPostProfileId(newProfileId);
  };

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
      {/* <InfiniteScroll ComponentToRender={Post} displaRNavBtn={true} /> */}
      <Post displaRNavBtn={true} />

      <LeftNavBtn link="./contacts" useReturn={false} />
    </div>
  );
}

export default Home;
