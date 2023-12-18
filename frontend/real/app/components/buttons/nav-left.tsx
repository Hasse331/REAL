import React from "react";
import { useRouter } from "next/router";

type props = {
  useReturn?: boolean;
  link: string;
};

export default function LeftNavBtn(props: props) {
  const router = useRouter();

  const handleClick = (e: any) => {
    if (props.useReturn) {
      e.preventDefault(); // Prevent default link behavior
      router.back();
    } else {
      // Let Next.js handle the routing if it's a path navigation
      router.push(props.link);
    }
  };

  return (
    <a href={props.link} onClick={handleClick}>
      <div className="left-nav ml-1 fixed left-0 top-1/2 transform -translate-y-1/2 rounded-lg bg-violet-950 p-4 px-0.5 py-0.5 opacity-40 hover:bg-violet-700 hover:opacity-100">
        <p>🡨</p>
      </div>
    </a>
  );
}
