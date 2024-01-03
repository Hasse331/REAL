// @ts-nocheck
// pages/UploadPage.js
import "../app/styles/globals.css";
import React, { useState } from "react";
import ReturnBtn from "@/app/components/buttons/returnButton";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { postRegFormData } from "@/app/utils/postRegisterData";
import GetJwtToken from "@/app/utils/GetJwtToken";
import useLoginCheck from "@/app/utils/useLoginCheck";

function EditProfile() {
  const router = useRouter();
  const profileData = router.query;
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const [about, setAbout] = useState(profileData.about);
  const [title, setTitle] = useState(profileData.title);
  const [text, setText] = useState(profileData.text);
  const [url, setUrl] = useState(profileData.url);

  const loggedIn = useLoginCheck();
  const token = GetJwtToken(loggedIn);

  useEffect(() => {
    if (!token) {
      alert("Please login first");
      router.push("/login?redirected=true");
    }
  }, [router, token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const apiEndpoint =
      process.env.NEXT_PUBLIC_EDIT_PROFILE || "ENV_VARIABLE_NOT_FOUND";

    interface RegisterResponse {
      message: string;
      success: boolean;
    }

    try {
      const data = await postRegFormData<RegisterResponse>(
        apiEndpoint,
        formData,
        token
      );
      setResponseMessage(data.message);
      if (data.success === true) {
        setResponseStatus("success");
        router.push("/profile?userId=jwt");
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
      <div className="ml-1">
        <ReturnBtn />
      </div>
      <div className="p-14 space-y-2">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <hr />
          {responseStatus === "success" && (
            <p className="text-green-600">{responseMessage}</p>
          )}
          {responseStatus === "error" && (
            <p className="text-red-600">{responseMessage}</p>
          )}

          <div className="space-y-2">
            <label className="block text-violet-700 mt-5 mb-5">
              About me: (min 30. and max 500 letters)
              <textarea
                value={about}
                rows={4}
                name="about"
                onChange={(e) => setAbout(e.target.value)}
                minLength={30}
                maxLength={500}
                className="p-2 w-full border border-violet-700 rounded"
                placeholder="Tell about yourself in general"
                required
              ></textarea>
            </label>
          </div>
          <div className="space-y-2 mt-3">
            <label className="block text-violet-700">
              Your subtitle:
              <input
                value={title}
                name="title"
                className="p-2 w-full border border-violet-700 rounded"
                type="title"
                placeholder="e.g. Hobbies, Passions, Profession, interests etc "
                maxLength={30}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>
          <div className="space-y-2 mt-2">
            <label className="block text-violet-700">
              Your text: (Max 200 letters)
              <textarea
                value={text}
                rows={4}
                name="text"
                onChange={(e) => setText(e.target.value)}
                maxLength={200}
                className="p-2 w-full border border-violet-700 rounded"
                placeholder="Enter your text here..."
              ></textarea>
            </label>
          </div>
          <div className="space-y-2 mt-5">
            <label className="block text-violet-700">
              Your URL:
              <input
                value={url}
                name="url"
                className="p-2 w-full border border-violet-700 rounded"
                type="title"
                placeholder="https://www.youtube.com"
                maxLength={30}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
          </div>
          <label htmlFor="visibility" className="mt-5 block text-violet-700">
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
          <div className=" mb-10">
            <button
              className="rounded bg-gradient-to-r to-violet-700 from-violet-900 px-3 py-1 font-bold text-white shadow shadow-black hover:from-violet-950 hover:to-violet-800"
              type="submit"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
