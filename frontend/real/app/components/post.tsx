import Image from "next/image";
import PostButtons from "./buttons/post-btns";
import TopicBtns from "./topics";
import Link from "next/link";
import React from "react";
import { useState, useEffect, useRef } from "react";
import useLoginCheck from "../utils/useLoginCheck";
import GetJwtToken from "../utils/GetJwtToken";
import ProfileIcon from "./buttons/profile-icon";
import RightNavBtn from "./buttons/nav-right";
import { useRouter } from "next/router";

export default function Post({ displaRNavBtn, postIdToParent }: any) {
  const [data, setData] = useState<PostData | null>(null);
  const [shortText, setShortText] = useState<string>();
  const loggedIn = useLoginCheck("noSet");

  const router = useRouter();

  const isCommentPage: string | undefined = router.query
    .isCommentPage as string;

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
        setData(data as PostData);
        postIdToParent(data.post_id);
        if (data.text.length > 200) {
          setShortText(data.text.slice(0, 200) + "...");
        } else {
          setShortText(data.text);
        }
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  }, [loggedIn, token]);

  const [showButton, setShowButton] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfShouldShowButton = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const isVisible =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth);

        // Check if the element is in the middle of the screen
        const isInMiddle =
          rect.top < window.innerHeight / 2 &&
          rect.bottom > window.innerHeight / 2;

        setShowButton(isVisible && isInMiddle);
      } else {
        setShowButton(false);
      }
    };

    // Run on mount and whenever the window is resized or scrolled
    window.addEventListener("scroll", checkIfShouldShowButton);
    window.addEventListener("resize", checkIfShouldShowButton);
    checkIfShouldShowButton();

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", checkIfShouldShowButton);
      window.removeEventListener("resize", checkIfShouldShowButton);
    };
  }, []); // Ensure this runs only once, you can add dependencies if needed

  const videoRef = useRef<HTMLVideoElement>(null);

  const setVolume = (event: any) => {
    event.target.volume = 0.25;
  };

  const usrPostEndpoint =
    process.env.NEXT_PUBLIC_GET_USRPOST_MEDIA || "images/";

  const mediaSrc =
    usrPostEndpoint + (data?.post_id ? data.post_id : "placeholder.png");

  return (
    <div ref={elementRef}>
      <div className=" relative m-3 rounded-xl border border-solid border-violet-700 text-gray-200 p-5 pb-1  to-gray-500 from-gray-700 bg-gradient-to-r shadow-md shadow-black ">
        <div className="flex justify-between">
          <TopicBtns />
          {displaRNavBtn && showButton && (
            <RightNavBtn link="./profile" usrId={data?.user_id} />
          )}

          <button className=" h-6 w-4 rounded-lg bg-red-700 p-1 text-xs text-white">
            x
          </button>
        </div>
        <h2 className="text-2xl mt-5 ">
          <b></b>
        </h2>
        <div className="flex mb-2 items-center">
          <ProfileIcon userId={data?.user_id} />
          {data?.profile_name ? data.profile_name : "Placeholder text"}
        </div>
        <div>
          {data?.media_type === "image" ? (
            <Image
              data-testid="image"
              className="mt-2 rounded border border-solid border-violet-700 shadow shadow-black"
              src={mediaSrc}
              alt={data.media_type}
              width={600}
              height={600}
            />
          ) : (
            <video
              ref={videoRef}
              onLoadedMetadata={setVolume}
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
          <b>{data?.title ? data.title : "Placeholder text"}</b>
        </h2>
        {!isCommentPage ? (
          <p>{data && shortText ? shortText : "Placeholder text"}</p>
        ) : (
          <p>{data?.text ? data.text : "Placeholder text"}</p>
        )}
        <div className=" underline">
          {!isCommentPage && (
            <Link href="./comments?isCommentPage=true" legacyBehavior>
              <a>Open Comments </a>
            </Link>
          )}

          <PostButtons />
        </div>
      </div>
    </div>
  );
}
