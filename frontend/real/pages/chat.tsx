import React, { useRef } from "react";
import RightNavBtn from "../app/components/buttons/navRight";
import LeftNavBtn from "@/app/components/buttons/navLeft";
import ReturnBtn from "@/app/components/buttons/returnButton";
import Messages from "@/app/components/chat/messages";

import { useRouter } from "next/router";

const Chat = () => {
  // Scroll to bottom:
  const newestConv = useRef<HTMLDivElement>(null);
  const scrollBottom = () => {
    newestConv.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get username from route
  const router = useRouter();
  const username = router.query.profilename as string;

  return (
    <div>
      <h1 className=" mb-0">Chat with:</h1>
      <h2 className="text-xl italic text-center mt-0">{username}</h2>
      {/* and sendMessages component as child of Messages:*/}
      <Messages scrollBottom={scrollBottom} username={username} />{" "}
      <RightNavBtn link="./" useReturn={true} />
      <LeftNavBtn link="./contacts" />
      <div ref={newestConv} />
    </div>
  );
};

export default Chat;
