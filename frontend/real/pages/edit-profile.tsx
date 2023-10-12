// pages/UploadPage.js
import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import { useState } from "react";
import Link from "next/link";
import ReturnBtn from "@/app/components/buttons/return-button";

const EditProfile = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log("File:", file);
    console.log("Text:", text);
  };

  return (
    <div>
      <Layout />

      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
        <ReturnBtn />

        <h1 text-start>Edit Profile</h1>
        <p className="text-center ">
          There isn&apos;t editable (fake) profilenames, since we want to keep
          it keep real and reduce anonymous behavior, bot and spam accounts.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-violet-700">
              Upload Image
              <input
                type="file"
                onChange={handleFileChange}
                className="p-2 border border-violet-700 rounded"
              />
            </label>{" "}
          </div>

          <div className="space-y-2">
            <label className="block text-violet-700 mt-2">
              About me text: (min 30. and max 500 letters)
              <textarea
                value={text}
                rows={4}
                onChange={(e) => setText(e.target.value)}
                minLength={30}
                maxLength={500}
                className="p-2 w-full border border-violet-700 rounded"
                placeholder="Tell about yourself in general"
              ></textarea>
            </label>
          </div>

          <div className="space-y-2 mt-3">
            <hr />
            <label className="block text-violet-700">
              Your subtitle:
              <input
                className="p-2 w-full border border-violet-700 rounded"
                type="title"
                placeholder="e.g. Hobbies, Passions, Profession, interests etc "
                maxLength={30}
              />
            </label>
          </div>
          <div className="space-y-2 mt-2">
            <label className="block text-violet-700">
              Your text: (Max 200 letters)
              <textarea
                value={text}
                rows={4}
                onChange={(e) => setText(e.target.value)}
                maxLength={200}
                className="p-2 w-full border border-violet-700 rounded"
                placeholder="Enter your text here..."
              ></textarea>
            </label>
          </div>
          <label htmlFor="visibility" className=" block text-violet-700">
            Profile type:
          </label>
          <div className="p-2 w-full border border-violet-700 rounded flex justify-evenly mb-5">
            <label className="inline-flex items-center">
              {" "}
              <input
                type="radio"
                className="form-radio text-violet-700"
                name="visibility"
                value="public"
              />
              <span className="ml-2">Public</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-violet-700"
                name="visibility"
                value="restricted"
              />
              <span className="ml-2">Restricted</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-violet-700"
                name="visibility"
                value="private"
              />
              <span className="ml-2">Private</span>
            </label>
          </div>
          <button typeof="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
