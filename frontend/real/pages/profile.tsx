import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import LeftNavBtn from "../app/components/buttons/nav-left";
import Image from "next/image";
import InfiniteScroll from "../app/utils/infinite-scroll";
import Post from "../app/components/post";
import TopicBtns from "../app/components/topics";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import useLoginCheck from "@/app/utils/check_jwt";

function Profile() {
  type ProfileData = {
    profile_name: string;
    tags: Array<string>;
    image: string;
    about: string;
    title: string;
    text: string;
    url: string;
    visibility: string;
  };

  const [data, setData] = useState<ProfileData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popMessage, setPopMessage] = useState("");

  const loggedIn = useLoginCheck();

  const router = useRouter();
  let userId = router.query.userId;
  let jwtUsed = false;
  let token: string | null;

  if (userId === "jwt") {
    token = sessionStorage.getItem("jwt");
    jwtUsed = true;
    if (!token) {
      alert("Invalid login session. Try to login again.");
    }

    type DecodedToken = {
      sub: string;
    };

    if (token) {
      const decodedToken = jwt_decode(token) as DecodedToken;
      userId = decodedToken.sub;
    }
  }

  /* Fetch profile by user id */
  useEffect(() => {
    const apiEndpoint = process.env.NEXT_PUBLIC_PROFILE_API_ENDPOINT;
    fetch(`${apiEndpoint}${userId}` || "INCORRECT_ENDPOINT", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data as ProfileData);
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  }, [userId]);

  const clickEditProfile = () => {
    router.push({
      pathname: "/edit-profile",
      query: data,
    });
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("File size should not exceed 5MB");
          return;
        }
        if (!file.type.startsWith("image/")) {
          alert("Please upload a valid image");
          return;
        }
        setSelectedFile(file);
      }
    }
  };

  const imageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    const imgType = "profile";

    formData.append("file", selectedFile);
    formData.append("media_type", imgType);

    const apiEndpoint =
      process.env.NEXT_PUBLIC_POST_API_MEDIA || "ENV_VARIABLE_NOT_FOUND";

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.message == "success") {
        setPopMessage(
          "Image uploaded succesfully! It may take a moment for the changes to appear."
        );
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
    }
  };

  const getImageEndpoint = process.env.NEXT_PUBLIC_GET_API_PROFILE_IMAGE;

  if (!data) return <div>Loading page...</div>;

  return (
    <div>
      <Layout />
      <LeftNavBtn link="./" />
      <div className="m-6">
        <div className="flex-1">
          <h2 className="text-2xl mr-4">
            <b>{data.profile_name}</b>
          </h2>{" "}
          <div>
            {loggedIn && jwtUsed && (
              <div>
                <button
                  className="m-1 ml-0 p-2 text-xs"
                  onClick={clickEditProfile}
                >
                  Edit Profile
                </button>
                <button
                  className="m-1 ml-0 p-2 text-xs"
                  onClick={() => setIsOpen(true)}
                >
                  Change Image
                </button>
                {isOpen && (
                  <div className="fixed top-0 p-12 left-0 w-full h-full flex items-center justify-center z-50">
                    {/* Backdrop */}
                    <div className="absolute top-0 left-0 w-full h-full  bg-gray-900 opacity-80"></div>

                    {/* Modal Content */}
                    <div className="relative p-5 to-gray-600 from-gray-800 bg-gradient-to-r border-solid border-violet-700 border rounded-lg shadow-lg w-80">
                      <h2 className="mb-5 text-lg font-bold">
                        Change Profile Image
                      </h2>

                      <div className="space-y-2 mt-5">
                        <label className="block text-violet-700">
                          Upload Image <br />
                          <input
                            type="file"
                            name="image_name"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="p-2 border bg-transparent w-60 border-violet-700 text-gray-200 rounded"
                          />
                        </label>
                      </div>

                      {/* Close button */}
                      <button
                        className="absolute top-2 right-2 p-1 h-8"
                        onClick={() => setIsOpen(false)}
                      >
                        x
                      </button>
                      <div>
                        <p className="text-green-600">{popMessage}</p>
                        <button
                          onClick={imageUpload}
                          type="submit"
                          className="mt-5 mb-0"
                        >
                          submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Image
          className=" mt-3 rounded border border-solid border-violet-700 shadow shadow-black"
          src={getImageEndpoint + userId}
          alt=""
          width={500}
          height={500}
        />
        <div>
          <p>Interests / Topics:</p>
          <TopicBtns />
        </div>
        <br />
        <h2>
          <b>About Me:</b>
        </h2>
        <p>{data.about}</p>
        <h2>
          <b>{data.title}</b>
          <p>{data.text}</p>
        </h2>
        <h2>
          <b>URL link:</b>
          <p>
            <a className="underline" href={data.url}>
              {data.url}
            </a>
          </p>
        </h2>
        <button
          type="submit"
          className="rounded  bg-gradient-to-r to-violet-700 from-violet-900 px-3 py-1 font-bold text-white shadow shadow-black hover:from-violet-950 hover:to-violet-800"
        >
          Request
        </button>
        <button
          type="submit"
          className="m-1 rounded  bg-gradient-to-r to-violet-700 from-violet-900 px-3 py-1 font-bold text-white shadow shadow-black hover:from-violet-950 hover:to-violet-800"
        >
          Subscribe
        </button>
        <h1>Posts by: {data.profile_name}</h1>
        <InfiniteScroll ComponentToRender={Post} />
      </div>
    </div>
  );
}

export default Profile;
