import React, { useEffect, useState } from "react";
import getUserUUID from "@/app/utils/getUserId";
import useSocketConnection from "@/app/utils/useSocketConnection";
import { useRouter } from "next/router";
import SendMessage from "./sendMessages";

interface Message {
  senderId: string;
  recipientId: string;
  message: string;
}

export default function Messages({ scrollBottom, username }: any) {
  const socket = useSocketConnection();

  const [messages, setMessages] = useState<Message[]>([]);
  const [recipientId, setRecipientId] = useState(""); // UUID of the recipient

  const router = useRouter();
  const userId = getUserUUID();

  useEffect(() => {
    scrollBottom();
  }, [messages, scrollBottom]);

  useEffect(() => {
    // Login check
    if (!userId) {
      alert("Please login first");
      router.push("/login?redirected=true");
      return;
    }

    // fetch messages and Get&set recipientId
    // TASK: Remove all Id from route and use other data passing methods
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

  return (
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
      <SendMessage
        socket={socket}
        recipientId={recipientId}
        setMessages={setMessages}
        username={username}
      />
    </div>
  );
}
