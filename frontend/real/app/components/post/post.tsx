// @ts-nocheck
import TrueFalseButtons from "../buttons/trueFalseButtons";
import React from "react";
import { useState, useEffect } from "react";
import OpenComments from "./openComments";
import UsrAndPostInfos from "./usrAndPostInfos";
import MediaContents from "./mediaContents";
import TextContents from "./textContents";
import PostNavButtons from "./postNavButtons";

import { useRouter } from "next/router";

export default function Post({
  displaNavButtons,
  dataProp,
  postIdToParent,
}: any) {
  const [postTexts, setShortText] = useState<string[]>([]);
  const [data, setData] = useState(dataProp);
  const [loading, setLoading] = useState(true);
  const [isCommentPage, setIsCommentPage] = useState(false);

  const router = useRouter();
  const commentPagePostId: string | undefined = router.query.post_id as string;
  // PostId to comments page and updating isCommentPage
  useEffect(() => {
    if (postIdToParent) {
      postIdToParent(commentPagePostId);
    }

    const isCommentPage: string | undefined = router.query
      .isCommentPage as string;
    setIsCommentPage(isCommentPage);
  }, [
    commentPagePostId,
    postIdToParent,
    router.query.isCommentPage,
    router.query.post_id,
  ]);

  // Loading posts from localStorage (if found)
  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    if (!data) {
      setData(JSON.parse(savedPosts));
      setLoading(false);
    }
  }, [data]);
  if (!postTexts) {
    setLoading(true);
  }

  useEffect(() => {
    if (!loading && data) {
      const textList = data.map((item) => item.text);
      setShortText(textList);
      if (!textList) {
        setLoading(true);
      }
    }
  }, [data, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data &&
        data.map((data, index) => {
          if (isCommentPage && data.post_id !== commentPagePostId) {
            return null; // Don't render this item
          }
          return (
            <div key={index}>
              <div className=" relative">
                <div className=" relative m-4 rounded-xl border border-solid border-violet-700 text-gray-200 p-5 pb-1  to-gray-500 from-gray-700 bg-gradient-to-r shadow-md shadow-black ">
                  <UsrAndPostInfos
                    data={data}
                    displayRNavBtn={displaNavButtons}
                  />

                  <MediaContents data={data} />

                  {postTexts && (
                    <TextContents
                      data={data}
                      isCommentPage={isCommentPage}
                      postText={postTexts[index]}
                    />
                  )}

                  <div className="flex justify-between">
                    <TrueFalseButtons />
                    {!isCommentPage && (
                      <OpenComments
                        postId={data.post_id}
                        isCommentPage={isCommentPage}
                      />
                    )}
                  </div>
                </div>
                <PostNavButtons
                  data={data}
                  displaNavButtons={displaNavButtons}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
