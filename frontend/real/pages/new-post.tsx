// pages/UploadPage.js
import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import { useState } from "react";
import Link from "next/link";
import React from "react";
import ReturnBtn from "@/app/components/buttons/return-button";

const NewPost = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    // Handle the form submission here
    // For now, just log the values
    console.log("File:", file);
    console.log("Text:", text);
  };

  return (
    <div>
      <Layout />
      <div className="ml-1">
        <ReturnBtn />
      </div>
      <div className="p-14 mx-auto space-y-4">
        <h1>New Post</h1>
        <div className="space-y-2">
          <label className="block  text-violet-700">Upload Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="p-2 border border-violet-700 bg-transparent rounded text-gray-200"
          />
        </div>
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
            Text (up to 800 letters)
          </label>
          <textarea
            value={text}
            rows={4}
            onChange={(e) => setText(e.target.value)}
            maxLength={800}
            className="p-2 w-full border border-violet-700 rounded"
            placeholder="Enter your text here..."
          ></textarea>
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default NewPost;
