import React from "react";
import useSocketConnection from "../../app/utils/useSocketConnection";
import { Socket } from "socket.io-client";

export default function SocketTest() {
  console.log("testing useSocketConnection...");
  let socket: Socket | string | undefined = useSocketConnection();

  if (socket) socket = "established";
  else socket = "failed";

  return <div>Socket connection ${socket}</div>;
}
