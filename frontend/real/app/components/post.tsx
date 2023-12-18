import Image from "next/image";
import PostButtons from "./buttons/post-btns";
import TopicBtns from "./topics";
import Link from "next/link";
import React from "react";
import { useState, useEffect, useRef } from "react";
import ProfileIcon from "./buttons/profile-icon";
import RightNavBtn from "./buttons/nav-right";
import { useRouter } from "next/router";

export default function Post({ displaRNavBtn, dataProp, postIdToParent }: any) {
  const [shortTexts, setShortText] = useState<string[]>([]);
  const [data, setData] = useState(dataProp);

  const router = useRouter();
  const isCommentPage: string | undefined = router.query
    .isCommentPage as string;
  const commentPostId: string | undefined = router.query.post_id as string;

  useEffect(() => {
    if (postIdToParent) {
      postIdToParent(commentPostId);
    }

    const savedShortTexts = localStorage.getItem("shortTexts");
    const savedPosts = localStorage.getItem("posts");
    if (!data) {
      setData(JSON.parse(savedPosts));
    }
    let num: number = 0;
    if (savedShortTexts) {
      num = savedShortTexts.length;
    }
    if (data) {
      const dataList = data.map((item) => item.text);

      if (savedShortTexts && savedShortTexts !== dataList) {
        setShortText(JSON.parse(savedShortTexts));
      } else {
        for (let i = num; i < data.length; i++) {
          if (data[i] && !isCommentPage) {
            if (data[i].text.length > 200) {
              const itemText = data[i].text.slice(0, 200) + "...";
              shortTexts.push(itemText);
            } else {
              shortTexts.push(data[i].text);
            }
          }
        }
        localStorage.setItem("shortTexts", JSON.stringify(shortTexts));
        setShortText((savedShortTexts) => [...savedShortTexts, ...shortTexts]);
      }
    }
  }, [data, isCommentPage]); // Dependencies

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

  let mediaSrc: string[] = [];
  if (data) {
    data.forEach((dataItem, i) => {
      if (dataItem?.post_id) {
        mediaSrc[i] = usrPostEndpoint + dataItem.post_id;
      } else {
        mediaSrc[i] = usrPostEndpoint + "placeholder.png";
      }
    });
  }

  return (
    <div>
      {data &&
        data.map((data, index) => {
          if (isCommentPage && data.post_id !== commentPostId) {
            return null; // Don't render this item
          }

          return (
            <div key={index} ref={elementRef}>
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
                      src={mediaSrc[index]}
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
                      src={mediaSrc[index]}
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
                  <p>
                    {data && shortTexts
                      ? shortTexts[index]
                      : "Placeholder text"}
                  </p>
                ) : (
                  <p>{data?.text ? data.text : "Placeholder text"}</p>
                )}
                <div className=" underline">
                  {!isCommentPage && (
                    <Link
                      href={`./comments?isCommentPage=true&post_id=${data?.post_id}`}
                      legacyBehavior
                    >
                      <a>Open Comments </a>
                    </Link>
                  )}

                  <PostButtons />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
