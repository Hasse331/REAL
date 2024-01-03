import "../app/styles/globals.css";
import LeftNavBtn from "../app/components/buttons/navLeft";
import Image from "next/image";
import Post from "../app/components/post/post";
import TextsAndTopics from "@/app/components/profile/textsAndTopics";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import getUserUUID from "@/app/utils/getUserId";
import ContactAndSubscribeButtons from "@/app/components/profile/contactAndSubscribeButtons";
import ProfileEditButtons from "@/app/components/profile/profileEditButtons";

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

function Profile() {
  const [data, setData] = useState<ProfileData | null>(null);

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

  const getImageEndpoint =
    process.env.NEXT_PUBLIC_GET_PROFILE_IMAGE ||
    "INCORRECT_ENV_VARIABLE: getImageEndpoint";

  const loading = "Loading";

  return (
    <div>
      <LeftNavBtn link="./" useReturn={true} />
      <div className="m-6">
        {/* PROFILENAME: */}
        <h2 className="flex-1 text-2xl mr-4">
          <b>{data ? data.profile_name : `${loading} profile name..`}</b>
        </h2>
        {token && (
          <ProfileEditButtons data={data} myJwtUsed={myJwtUsed} token={token} />
        )}
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
        <TextsAndTopics data={data} loading={loading} />
        <br />
        <ContactAndSubscribeButtons
          myJwtUsed={myJwtUsed}
          myUserId={myUserId}
          routeUserId={routeUserId}
        />

        <h1>
          Posts by: {data ? data.profile_name : `${loading} profile name..`}
        </h1>
        <Post displaNavButtons={false} />
      </div>
    </div>
  );
}

export default Profile;
