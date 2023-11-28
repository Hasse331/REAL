import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import RightNavBtn from "../app/components/buttons/nav-right";
import React from "react";
import { useEffect, useState } from "react";
import getUserUUID from "@/app/utils/getUserId";
import useSocketConnection from "@/app/utils/useSocketConnection";
import ReturnBtn from "@/app/components/buttons/return-button";
import { useRouter } from "next/router";

const Chat = () => {
  const socket = useSocketConnection();
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [recipientId, setRecipientId] = useState(""); // UUID of the recipient

  // Listen for incoming messages
  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (message) => {
        setReceivedMessages((prev) => [...prev, message]);
      });
    }
  }, [socket]);

  const router = useRouter();
  const userId = getUserUUID();
  if (!userId) {
    alert("Please login first");
    router.push("/login?redirected=true");
    return;
  }

  // Send message to specific user
  const sendMessage = () => {
    if (socket) {
      socket.emit("send_message", { senderId: userId, recipientId, message });
      setMessage("");
    }
  };

  return (
    <div>
      <Layout />
      <div className="ml-1">
        <ReturnBtn />
      </div>
      <RightNavBtn link="./" />
      <h1 className="mb-0">Chat</h1>
      <h2 className="text-xl italic text-center mt-0">Matti Meikäläinen</h2>
      <div className="flex justify-between chat-container absolute bottom-0 p-4">
        <textarea
          value={message}
          rows={1}
          cols={70}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="border-2 w-full border-gray-300 rounded p-2 mb-2 shadow-black shadow"
        />
        <div>
          <button
            onClick={sendMessage}
            className="m-2 mt-3"
            /* className="absolute bottom-0 right-0 mb-4 mr-4" */
          >
            Send
          </button>
        </div>
      </div>
      <div className="messages mt-4 overflow-auto max-h-40">
        {receivedMessages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
