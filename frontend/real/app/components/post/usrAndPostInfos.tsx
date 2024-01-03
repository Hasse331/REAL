// @ts-nocheck
import React from "react";
import TopicIcons from "../TopicIcons";
import ProfileIcon from "../buttons/profileIcon";
import RightNavBtn from "../buttons/navRight";

export default function UsrAndPostInfos({ data }: any) {
  return (
    <div>
      <div>
        {/* User and post info */}
        <div className="user-and-post-info">
          <div className="flex justify-between">
            <TopicIcons />
            <button className=" h-6 w-4 rounded-lg bg-red-700 p-1 text-xs text-white">
              x
            </button>
          </div>
          <br />
          <div className="flex mb-2 items-center">
            <ProfileIcon userId={data?.user_id} />
            {data?.profile_name ? data.profile_name : "Placeholder text"}
          </div>
        </div>
      </div>
    </div>
  );
}
