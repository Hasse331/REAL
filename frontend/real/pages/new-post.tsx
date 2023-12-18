// @ts-nocheck
// pages/UploadPage.js
import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";
import ReturnBtn from "@/app/components/buttons/return-button";
import GetJwtToken from "@/app/utils/GetJwtToken";
import useLoginCheck from "@/app/utils/useLoginCheck";

const NewPost = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState("");

  const loggedIn = useLoginCheck();
  const token = GetJwtToken(loggedIn);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      alert("Please login first");
      router.push("/login?redirected=true");
    }
  }, [router, token]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file && file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Image size should not exceed 5MB");
          return;
        }
      } else if (file && file.type.startsWith("video/")) {
        if (file.size > 2000 * 1024 * 1024) {
          alert("Video size should not exceed 2GB");
          return;
        }
      } else {
        alert("Please upload a valid image or video for the post");
        return;
      }
      setSelectedFile(file);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) return;

    if (text.length < 40) {
      setResponseMessage(
        "If your post text content is under 40 letters you don't have anything important to say about."
      );
      return;
    }

    const formData = new FormData(e.currentTarget);
    const mediaType = "post";

    formData.append("file", selectedFile);
    formData.append("media_type", mediaType);

    const newUsrPostEndpoint =
      process.env.NEXT_PUBLIC_NEW_USR_POST ||
      "ENV_VARIABLE_NOT_FOUND: newUsrPostEndpoint";

    try {
      const response = await fetch(newUsrPostEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.message == "success") {
        setResponseMessage("Post uploaded succesfully!");
      } else {
        setResponseStatus("error");
      }
    } catch (error) {
      setResponseMessage("An error occurred while updating profile.");
      setResponseStatus("error");
    }
  }

  return (
    <div>
      <Layout />
      <div className="ml-1">
        <ReturnBtn />
      </div>
      <div className="p-14 mx-auto space-y-4">
        <h1>New Post</h1>
        {responseMessage === "Post uploaded succesfully!" ? (
          <p className="text-green-500">{responseMessage}</p>
        ) : (
          <p className="text-red-500">{responseMessage}</p>
        )}
        <div className="space-y-2">
          <label className="block  text-violet-700">Upload Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="p-2 border border-violet-700 bg-transparent rounded text-gray-200"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-5">
            <label
              htmlFor="title"
              className="mb-2 text-violet-700 block text-sm font-bold "
            >
              Post title
            </label>

            <input
              id="title-id"
              type="title"
              name="title"
              className="w-full max-w-xs appearance-none rounded border px-3 py-2 shadow"
              placeholder="Your post title"
              autoComplete="off"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-violet-700">
              Text (up to 2000 letters)
            </label>
            <textarea
              value={text}
              rows={4}
              name="text"
              onChange={(e) => setText(e.target.value)}
              maxLength={2000}
              className="p-2 w-full border border-violet-700 rounded"
              placeholder="Enter your text here..."
            ></textarea>
          </div>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
