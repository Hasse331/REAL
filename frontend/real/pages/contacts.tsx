import React from "react";
import Layout from "@/app/components/layout";
import useSocketConnection from "@/app/utils/useSocketConnection";
import InfiniteScroll from "../app/utils/infinite-scroll";
import RightNavBtn from "../app/components/buttons/nav-right";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Socket } from "socket.io-client";
import getUserUUID from "@/app/utils/getUserId";
import { useRouter } from "next/router";

function ContactsPage() {
  const [connected, setConnected] = useState(false);
  const socket = useSocketConnection();

  useEffect(() => {
    if (socket) {
      setConnected(true);
    }
  }, [socket]);

  const userId = getUserUUID();
  const router = useRouter();
  if (!userId) {
    alert("Please login first");
  }

  return (
    <div>
      <Layout />
      <RightNavBtn link="./" />
      <h1>Contacts</h1>
      {connected && <InfiniteScroll ComponentToRender={ContactComponent} />}
    </div>
  );
}

interface SocketCon {
  socket: Socket | undefined;
}

function ContactComponent({ socket }: SocketCon) {
  useEffect(() => {
    if (socket) {
      socket.emit("get-contacts", { senderId: userId });
    }
  });

  return (
    <Link href="/chat" passHref>
      <div className=" m-2 text-center items-center border border-violet-700 bg-gray-800 rounded-md shadow shadow-black">
        <div className="flex justify-between ml-5 mr-5">
          <p className="text-sm">Matti Meikäläinen</p>
          <p></p>
          <p className="text-sm">5 days ago</p>
        </div>
      </div>
    </Link>
  );
}

export default ContactsPage;
