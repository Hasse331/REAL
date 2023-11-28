// useSocketConnection.js
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import GetJwtToken from "./GetJwtToken";
import useLoginCheck from "../utils/useLoginCheck";

function useSocketConnection() {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const loggedIn = useLoginCheck("noSet");

  useEffect(() => {
    const token = GetJwtToken(loggedIn);
    if (!loggedIn) {
      return;
    }

    if (!token) {
      return;
    }

    const newSocket = io("http://localhost:3030", {
      query: {
        token: token,
        serviceIdentifier: "REAL_FRONTEND",
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [loggedIn]);

  return socket;
}

export default useSocketConnection;
