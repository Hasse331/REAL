import useLoginCheck from "@/app/utils/useLoginCheck";
import GetJwtToken from "@/app/utils/GetJwtToken";
import React from "react";
import { useState } from "react";

export default function NewComment({ postId }: any) {
  const [commentField, setCommentField] = useState<string>();
  const [saveResp, setSaveResp] = useState<string>();

  const loggedIn = useLoginCheck("noSet");
  const token = GetJwtToken(loggedIn);

  const saveCommentEndpoint =
    process.env.NEXT_PUBLIC_SAVE_COMMENT ||
    "INCORRECT ENV: saveCommentEndpoint";

  function commentSubHandler() {
    setSaveResp("");
    if (commentField) {
      if (postId) {
        if (commentField.length < 10) {
          setSaveResp("Comments under 10 characters are considered to SPAM!");
          return;
        }

        fetch(saveCommentEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: commentField, post_id: postId }),
        })
          .then((resp) => {
            if (!resp.ok) {
              throw new Error("Network resopnse was not ok");
            }
            return resp.json();
          })
          .then((saveResp) => {
            setSaveResp(saveResp);
          })
          .catch((error) => {
            console.error(
              "Problem occurred during saving comments fetch: ",
              error
            );
          });
      } else {
        setSaveResp("Something went wrong, please try again later");
      }
    } else {
      setSaveResp("Please fill the field.");
    }
  }

  return (
    <div>
      {loggedIn && (
        <div className="flex-1 border p-2 shadow-md shadow-black to-gray-500 from-gray-700 bg-gradient-to-r rounded-md border-solid mt-5 border-violet-700 m-3">
          <label htmlFor="comment-input">Make new comment: </label>
          <textarea
            className="mt-2 rounded w-full"
            name="comment-input"
            value={commentField}
            onChange={(e) => setCommentField(e.target.value)}
            id=""
            rows={3}
          ></textarea>
          <div className="m-0 flex justify-end">
            {saveResp === "success" ? (
              <p className="text-green-500 mr-2">
                Comment uploaded succesfully!
              </p>
            ) : (
              <p className="text-red-500 mr-2 text-sm">{saveResp}</p>
            )}
            <button onClick={commentSubHandler} className="m-0">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
