import React from "react";
import Link from "next/link";

export default function PostNavButtons({ data, displaNavButtons }) {
  return (
    <div>
      {displaNavButtons && (
        <div>
          <Link href={`/profile?userId=${data.user_id}`}>
            <div className="right-nav-button absolute right-0 top-1/2 transform -translate-y-50% rounded-lg bg-violet-950 p-2 px-0.5 py-0.5 opacity-40 hover:bg-violet-700 hover:opacity-100">
              <p>🡪</p>
            </div>
          </Link>
          <Link
            href={`/chat?recipientId=${
              data.user_id
            }&contactAccepted=${true}&profilename=${data.profile_name}`}
          >
            <div className="right-nav-button absolute left-0 top-1/2 transform -translate-y-50% rounded-lg bg-violet-950 p-2 px-0.5 py-0.5 opacity-40 hover:bg-violet-700 hover:opacity-100">
              <p>🡨</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
