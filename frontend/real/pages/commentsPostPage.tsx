import Post from "../app/components/post/post";
import Comment from "../app/components/comments/comment";
import ReturnBtn from "@/app/components/buttons/returnButton";
import LeftNavBtn from "@/app/components/buttons/navLeft";
import React, { useEffect } from "react";
import { useState } from "react";
import NewComment from "@/app/components/comments/newComment";

export default function PostPage() {
  const [postIdFromChild, setPostIdFromChild] = useState<string>();
  const [commentsData, setCommentsData] = useState<CommentData>([]);

  type CommentData = {
    comment: string;
    profile_name: string;
    user_id: string;
  }[];

  useEffect(() => {
    if (postIdFromChild) {
      const loadCommentsApiEndpoint =
        process.env.NEXT_PUBLIC_LOAD_COMMENTS ||
        "INCORRECT ENV VAR: loadCommentsApiEndpoint";
      fetch(`${loadCommentsApiEndpoint}${postIdFromChild}`, {
        method: "GET",
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Something fucked up with fetch response!");
          }
          return resp.json();
        })
        .then((data: CommentData) => {
          setCommentsData(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [postIdFromChild]);

  const handleChildPostId = (id: string) => {
    setPostIdFromChild(id);
  };

  return (
    <div>
      <ReturnBtn />
      <Post displaNavButtons={true} postIdToParent={handleChildPostId} />
      <NewComment postId={postIdFromChild} />
      {commentsData.length > 0 ? (
        <Comment comments={commentsData} />
      ) : (
        <div className="text-center">
          There is no comments yet to this post, be the first one!
        </div>
      )}
    </div>
  );
}
