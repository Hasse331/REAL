import Image from "next/image";
import PostButtons from "./buttons/post-btns";
import TopicBtns from "./topics";
import ReturnBtn from "@/app/components/buttons/return-button";
import Link from "next/link";

export default function Post() {
  return (
    <div>
      <div className=" relative m-3 rounded-lg border border-solid border-violet-700 bg-violet-50 p-5 shadow-md shadow-black ">
        <div className="flex space-x-2 justify-between">
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
          src="/images/.png"
          alt=""
          width={500}
          height={500}
        />
        <p></p>

        <div className="flex">
          <PostButtons />
        </div>
        <div className="mt-2 underline">
          <Link href="./post-page">Open conversation...</Link>
        </div>
      </div>
    </div>
  );
}
