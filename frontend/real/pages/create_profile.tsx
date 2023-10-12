// pages/UploadPage.js
import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import { useState } from "react";
import Link from "next/link";

const UploadPage = () => {
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

      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
        <Link href="./">🡨 Return</Link>
        <h1 text-start>New Post</h1>
        <div className="space-y-2">
          <label className="block text-violet-700">Upload Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="p-2 border border-violet-700 rounded"
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

export default UploadPage;
