import React, { useState } from "react";
import getUserUUID from "@/app/utils/getUserId";
import { useRouter } from "next/router";

interface Message {
  senderId: string;
  recipientId: string;
  message: string;
}

export default function SendMessage({
  socket,
  recipientId,
  setMessages,
  username,
}: any) {
  const [message, setMessage] = useState("");
  const userId = getUserUUID();
  const router = useRouter();
  const contactAcceptedStr = router.query.contactAccepted as string;
  const contactAccepted = contactAcceptedStr === "true";

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

  return (
    <div>
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
    </div>
  );
}
