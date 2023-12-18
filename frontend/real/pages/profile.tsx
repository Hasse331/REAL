import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import LeftNavBtn from "../app/components/buttons/nav-left";
import Image from "next/image";
import InfiniteScroll from "../app/utils/infinite-scroll";
import Post from "../app/components/post";
import TopicBtns from "../app/components/topics";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import useLoginCheck from "@/app/utils/useLoginCheck";
import useSocketConnection from "@/app/utils/useSocketConnection";
import getUserUUID from "@/app/utils/getUserId";

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

  // States
  const [data, setData] = useState<ProfileData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popMessage, setPopMessage] = useState("");
  const [alreadyContact, setAlreadyContact] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const [itIsMyProfile, setItIsMyProfile] = useState(false);

  const socket = useSocketConnection();

  const loggedIn = useLoginCheck("noSet");
  const router = useRouter();
  let myJwtUsed = false;
  const myUserId = getUserUUID();

  // Check session type and get token
  let routeUserId = router.query.userId as string;
  let token: string | null;
  if (routeUserId === "myJwt") {
    token = sessionStorage.getItem("jwt");
    myJwtUsed = true;
    if (!token) {
      alert("Invalid login session. Try to login again.");
    }
  }
  let fetchUserId: string | undefined;
  if (myJwtUsed) fetchUserId = myUserId;
  else fetchUserId = routeUserId;

  useEffect(() => {
    if (myUserId) {
      if (myUserId === routeUserId) {
        setItIsMyProfile(true);
      } else {
        setItIsMyProfile(false);
      }
    }
  }, [myUserId, routeUserId]);

  // Fetch profile data by user id
  useEffect(() => {
    const getProfileEndpoint = process.env.NEXT_PUBLIC_GET_PROFILE;
    fetch(
      `${getProfileEndpoint}${fetchUserId}` ||
        "INCORRECT_ENDPOINT: getProfileEndpoint",
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data as ProfileData);
      })
      .catch((error) => {
        console.error("ERROR:", error);
      });
  }, [fetchUserId]);

  interface Contact {
    sender_id: string;
    recipient_id: string;
    accepted: boolean;
    latest_ts: Date;
  }

  useEffect(() => {
    if (socket && !myJwtUsed) {
      socket.emit("fetch_contacts", myUserId);

      const handleContactsData = (contacts: Contact[]) => {
        // Assuming contacts is an array
        let isAlreadyContact = false;
        let isRequestPending = false;

        contacts.forEach((contact) => {
          if (
            (contact.sender_id === myUserId &&
              contact.recipient_id === routeUserId) ||
            (contact.sender_id === routeUserId &&
              contact.recipient_id === myUserId)
          ) {
            isAlreadyContact = true;
            if (contact.accepted === false) {
              isRequestPending = true;
            }
          }
        });

        setAlreadyContact(isAlreadyContact);
        setRequestPending(isRequestPending);
      };

      socket.on("contacts_data", handleContactsData);

      // Clean up the event listener when the component unmounts or dependencies change
      return () => {
        socket.off("contacts_data", handleContactsData);
      };
    }
  }, [socket, myJwtUsed, myUserId, routeUserId]);

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

    const uploadMediaEndpoint =
      process.env.NEXT_PUBLIC_UPLOAD_MEDIA ||
      "ENV_VARIABLE_NOT_FOUND: uploadMediaEndpoint profile.tsx";

    try {
      const response = await fetch(uploadMediaEndpoint, {
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

  const requestHandler = function () {
    if (socket) {
      socket.emit("contact_request", {
        senderId: myUserId,
        recipientId: routeUserId,
      });
      setAlreadyContact(true);
      setRequestPending(true);
    }
  };
  const subscribeHandler = function () {
    // Working on this with MyAlg project
  };
  const removeContactHandler = function () {
    if (socket) {
      socket.emit("remove_contact", {
        senderId: myUserId,
        recipientId: routeUserId,
      });
      setAlreadyContact(false);
    }
  };

  const getImageEndpoint =
    process.env.NEXT_PUBLIC_GET_PROFILE_IMAGE ||
    "INCORRECT_ENV_VARIABLE: getImageEndpoint";

  const loading = "Loading";

  return (
    <div>
      <Layout />
      <LeftNavBtn link="./" useReturn={true} />
      <div className="m-6">
        <div className="flex-1">
          <h2 className="text-2xl mr-4">
            <b>{data ? data.profile_name : `${loading} profile name..`}</b>
          </h2>{" "}
          <div>
            {loggedIn && myJwtUsed && (
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
          src={
            getImageEndpoint + fetchUserId
              ? getImageEndpoint + fetchUserId
              : `${loading} image..`
          }
          alt=""
          width={500}
          height={500}
        />
        <div>
          <p>Interests / Topics:</p>
          <TopicBtns />
        </div>
        <br />
        {data?.about && (
          <h2>
            <b>About Me:</b>
          </h2>
        )}
        <p className="break-words">{data ? data.about : `${loading} text..`}</p>
        <h2 className="break-words">
          <b>{data ? data.title : `${loading} subtitle..`}</b>
        </h2>
        <p className="break-words">{data ? data.text : `${loading} text..`}</p>
        <h2>
          <b>{data?.url ? "Links:" : ""}</b>
          <p>
            <a
              className="underline break-words"
              href={data ? data.url : `${loading} url..`}
            >
              {data?.url}
            </a>
          </p>
        </h2>
        {!myJwtUsed && !itIsMyProfile && (
          <div>
            {alreadyContact ? (
              <button
                onClick={removeContactHandler}
                type="submit"
                className="rounded  bg-gradient-to-r to-violet-700 from-violet-900 px-3 py-1 font-bold text-white shadow shadow-black hover:from-violet-950 hover:to-violet-800"
              >
                {requestPending ? "Remove Request" : "Remove Contact"}
              </button>
            ) : (
              <button
                onClick={requestHandler}
                type="submit"
                className="rounded bg-gradient-to-r to-violet-700 from-violet-900 px-3 py-1 font-bold text-white shadow shadow-black hover:from-violet-950 hover:to-violet-800"
              >
                Request Contact
              </button>
            )}
            <button
              onClick={subscribeHandler}
              type="submit"
              className="m-1 rounded  bg-gradient-to-r to-violet-700 from-violet-900 px-3 py-1 font-bold text-white shadow shadow-black hover:from-violet-950 hover:to-violet-800"
            >
              Subscribe
            </button>
          </div>
        )}
        <h1>
          Posts by: {data ? data.profile_name : `${loading} profile name..`}
        </h1>
        <InfiniteScroll ComponentToRender={Post} isIndexPage={false} />
      </div>
    </div>
  );
}

export default Profile;
