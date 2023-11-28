import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import Post from "../app/components/post";
import InfiniteScroll from "../app/utils/infinite-scroll";
import RightNavBtn from "../app/components/buttons/nav-right";
import LeftNavBtn from "../app/components/buttons/nav-left";
import React from "react";
import useLoginCheck from "@/app/utils/useLoginCheck";
import Link from "next/link";

function Home() {
  const [loggedIn, setLoggedIn] = useLoginCheck();
  const GET_userId = "GET_UUID_FROM_POST";
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
      <InfiniteScroll ComponentToRender={Post} />
      <RightNavBtn link="./profile" usrId={GET_userId} />
      <LeftNavBtn link="./contacts" />
    </div>
  );
}

export default Home;
