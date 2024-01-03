// @ts-nocheck
import React from "react";
import Link from "next/link";

export default function OpenComments({ postId, isCommentPage }) {
  return (
    <div className=" underline">
      {!isCommentPage && (
        <Link
          href={`./commentsPostPage?isCommentPage=true&post_id=${postId}`}
          legacyBehavior
        >
          <button>Open</button>
        </Link>
      )}
    </div>
  );
}
