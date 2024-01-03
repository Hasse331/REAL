// @ts-nocheck
import React, { useEffect } from "react";
import { useState } from "react";

export default function TextContents({ data, isCommentPage, postText }) {
  const [shortenedText, setShortenedText] = useState();

  useEffect(() => {
    if (postText && !isCommentPage && postText.length > 200) {
      const newPostText = postText.substring(0, 200) + ".....";
      setShortenedText(newPostText);
    } else {
      setShortenedText(data.text);
    }
  }, [data.text, isCommentPage, postText]);

  return (
    <div className="text-contents">
      <h2 className="mt-4">
        <b>{data?.title ? data.title : "Placeholder text"}</b>
      </h2>
      {!isCommentPage ? (
        <p>{data && shortenedText ? shortenedText : "Placeholder text"}</p>
      ) : (
        <p>{data?.text ? data.text : "Placeholder text"}</p>
      )}
    </div>
  );
}
