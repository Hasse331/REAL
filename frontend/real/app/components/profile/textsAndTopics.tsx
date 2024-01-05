import React from "react";
import TopicIcons from "../TopicIcons";

export default function TextsAndTopics({ data, loading }) {
  return (
    <div>
      <div className="flex">
        <p>Interests:</p>
        <div className="m-2.5">{/* <TopicIcons /> */}</div>
      </div>
      <br />
      <div>
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
          <b>{data?.url ? "Link: " : ""}</b>
          <a
            className="underline break-words"
            href={data ? data.url : `${loading} url..`}
          >
            {data?.url}
          </a>
        </h2>
      </div>
    </div>
  );
}
