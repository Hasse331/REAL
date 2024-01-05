// @ts-nocheck
import React from "react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function MediaContents({ data, key, elementRef }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const setVolume = (event: any) => {
    event.target.volume = 0.25;
  };

  const usrPostEndpoint =
    process.env.NEXT_PUBLIC_GET_USRPOST_MEDIA || "images/";

  let mediaSrc: string[] = [];
  if (data) {
    if (data?.post_id) {
      mediaSrc = usrPostEndpoint + data.post_id;
    } else {
      mediaSrc = usrPostEndpoint + "placeholder.png";
    }
  }

  return (
    <div className="media-contents" key={key} ref={elementRef}>
      {data?.media_type === "image" ? (
        <Image
          data-testid="image"
          className="mt-0 rounded border border-solid border-violet-700 shadow shadow-black"
          src={mediaSrc}
          alt={data.media_type}
          width={600}
          height={600}
        />
      ) : (
        <video
          ref={videoRef}
          onLoadedMetadata={setVolume}
          data-testid="video"
          className="mt-0"
          src={mediaSrc}
          width={600}
          height={600}
          controls
        />
      )}
    </div>
  );
}
