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
            <div className="flex mb-0 items-center">
              <ProfileIcon userId={data?.user_id} />
              {data?.profile_name ? data.profile_name : "Placeholder text"}
            </div>
            <button className=" h-6 w-4 rounded-lg bg-red-700 p-1 text-xs text-white">
              x
            </button>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
}
