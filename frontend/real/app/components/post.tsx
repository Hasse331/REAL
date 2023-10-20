import Image from "next/image";
import PostButtons from "./buttons/post-btns";
import TopicBtns from "./topics";
import ReturnBtn from "@/app/components/buttons/return-button";
import Link from "next/link";
import React from "react";

export default function Post() {
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
        <p>By: </p>
        <Image
          className="mt-2 rounded border border-solid border-violet-700 shadow shadow-black"
          src="/images/placeholder.png"
          alt=""
          width={600}
          height={600}
        />
        <h2 className="mt-4">
          <b>Your custom title here</b>
        </h2>{" "}
        <p>Lorem ipsum dolor sit amet, consectetur...</p>
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
