import Link from "next/link";
import React from "react";

export default function LeftNavBtn(props: any) {
  return (
    <Link href={props.link}>
      <div className="left-nav ml-1 fixed left-0 top-1/2 transform -translate-y-1/2 rounded-lg bg-violet-950 p-4 px-0.5 py-0.5 opacity-40 hover:bg-violet-700 hover:opacity-100">
        <p>🡨</p>
      </div>
    </Link>
  );
}
