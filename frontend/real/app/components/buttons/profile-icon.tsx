import React from "react";
import Link from "next/link";
import Image from "next/image";

type link = {
  userId: string | undefined;
};

export default function ProfileIcon({ userId }: link) {
  const getImageEndpoint =
    process.env.NEXT_PUBLIC_GET_PROFILE_IMAGE ||
    "INCORRECT_ENV_VARIABLE: ProfileIcon ";
  return (
    <div>
      <Link href={`/profile?userId=${userId}`}>
        <Image
          className="rounded-full mr-2 border border-solid border-violet-700 shadow shadow-black"
          src={
            getImageEndpoint + userId
              ? getImageEndpoint + userId
              : "loading image.."
          }
          alt="Profile"
          width={40}
          height={40}
        />
      </Link>
    </div>
  );
}
