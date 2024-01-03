import React from "react";
import PostButtons from "../buttons/trueFalseButtons";
import ProfileIcon from "../buttons/profileIcon";

type CommentData = {
  comment: string;
  profile_name: string;
  user_id: string;
};

type CommentProps = {
  comments: CommentData[] | undefined;
};

export default function CommentSection({ comments }: CommentProps) {
  if (!comments || comments.length === 0) {
    return <div>Loading comments...</div>; // or return null; if you prefer not to render anything
  }
  return (
    <div>
      {comments.map((commentData, index) => (
        <div
          key={index}
          className="border shadow-md shadow-black to-gray-500 from-gray-700 bg-gradient-to-r rounded-md border-solid mt-5 border-violet-700 m-3"
        >
          <div className="flex m-2">
            {/* Assuming ProfileIcon can take userId as a prop */}
            <ProfileIcon userId={commentData.user_id} />
            <p>
              <b>{commentData.profile_name}</b>
            </p>
          </div>
          <hr />
          <p className="m-2">{commentData.comment}</p>
          <div className="flex ml-2 justify-between">
            <PostButtons />
            <button className="m-1">Chat</button>
          </div>
        </div>
      ))}
    </div>
  );
}
