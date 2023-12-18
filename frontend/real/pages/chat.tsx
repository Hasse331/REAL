import React, { useEffect, useState, useRef } from "react";
import Layout from "../app/components/layout";
import RightNavBtn from "../app/components/buttons/nav-right";
import LeftNavBtn from "@/app/components/buttons/nav-left";
import ReturnBtn from "@/app/components/buttons/return-button";
import getUserUUID from "@/app/utils/getUserId";
import useSocketConnection from "@/app/utils/useSocketConnection";
import { useRouter } from "next/router";

interface Message {
  senderId: string;
  recipientId: string;
  message: string;
}

const Chat = () => {
  const socket = useSocketConnection();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipientId, setRecipientId] = useState(""); // UUID of the recipient
  const newestConv = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const userId = getUserUUID();
  const contactAcceptedStr = router.query.contactAccepted as string;
  const contactAccepted = contactAcceptedStr === "true";
  const username = router.query.profilename as string;

  useEffect(() => {
    if (!userId) {
      alert("Please login first");
      router.push("/login?redirected=true");
      return;
    }

    if (router.isReady && router.query.recipientId && socket) {
      const recipient = router.query.recipientId as string;
      setRecipientId(recipient);
      socket.emit("fetch_messages", { userId, recipientId: recipient });
    }

    if (socket) {
      // Handle incoming real-time messages
      socket.on("receive_message", (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      // Handle fetched messages
      socket.on("messages_data", (messages: Message[]) => {
        setMessages(messages);
      });

      return () => {
        socket.off("receive_message");
        socket.off("messages_data");
      };
    }
  }, [socket, userId, router]);

  const sendMessage = () => {
    if (socket && message.trim() && userId) {
      const newMessage: Message = {
        senderId: userId,
        recipientId: recipientId,
        message: message,
      };
      socket.emit("send_message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  const scrollBottom = () => {
    newestConv.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  return (
    <div>
      <Layout />
      <div className="ml-1">
        <ReturnBtn />
      </div>
      <RightNavBtn link="./" />
      <LeftNavBtn link="./contacts" />
      <h1 className="mb-0">Chat with:</h1>
      <h2 className="text-xl italic text-center mt-0">{username}</h2>
      <div className="messages mt-4 p-2 overflow-visible ">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.senderId === userId ? "text-right ml-20" : "text-left mr-20"
            }`}
          >
            <p className="break-words border shadow-lg shadow-black bg-gradient-to-t from-gray-800 to-gray-700 max-w-full rounded-xl inline-block p-2 border-violet-700">
              {msg.message}
            </p>
          </div>
        ))}
        <hr />
        {contactAccepted ? (
          <div className="mt-4">
            <h2 className="mb-0">Chat with: {username}</h2>

            <textarea
              value={message}
              rows={2}
              cols={70}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="border-2 w-full border-gray-300 rounded p-2 mb-2 shadow-black shadow"
            />

            <div className="text-right">
              <button onClick={sendMessage} className=" mb-10">
                Send
              </button>
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-center">
            CONTACT REQUEST HAS TO BE ACCEPTED BEFORE SENDING OR RECEIVING NEW
            MESSAGES!
          </p>
        )}
        <div ref={newestConv} />
      </div>
    </div>
  );
};

export default Chat;
