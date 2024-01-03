import useSocketConnection from "@/app/utils/useSocketConnection";
import { useEffect, useState } from "react";
import React from "react";

interface Contact {
  sender_id: string;
  recipient_id: string;
  accepted: boolean;
  latest_ts: Date;
}

export default function ContactAndSubscribeButtons({
  myJwtUsed,
  myUserId,
  routeUserId,
}) {
  const [alreadyContact, setAlreadyContact] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const [itIsMyProfile, setItIsMyProfile] = useState(false);

  const socket = useSocketConnection();

  useEffect(() => {
    if (myUserId) {
      if (myUserId === routeUserId) {
        setItIsMyProfile(true);
      } else {
        setItIsMyProfile(false);
      }
    }
  }, [myUserId, routeUserId]);

  useEffect(() => {
    if (socket && !myJwtUsed) {
      socket.emit("fetch_contacts", myUserId);

      const handleContactsData = (contacts: Contact[]) => {
        // Assuming contacts is an array
        let isAlreadyContact = false;
        let isRequestPending = false;

        contacts.forEach((contact) => {
          if (
            (contact.sender_id === myUserId &&
              contact.recipient_id === routeUserId) ||
            (contact.sender_id === routeUserId &&
              contact.recipient_id === myUserId)
          ) {
            isAlreadyContact = true;
            if (contact.accepted === false) {
              isRequestPending = true;
            }
          }
        });

        setAlreadyContact(isAlreadyContact);
        setRequestPending(isRequestPending);
      };

      socket.on("contacts_data", handleContactsData);

      // Clean up the event listener when the component unmounts or dependencies change
      return () => {
        socket.off("contacts_data", handleContactsData);
      };
    }
  }, [socket, myJwtUsed, myUserId, routeUserId]);

  const requestHandler = function () {
    if (socket) {
      socket.emit("contact_request", {
        senderId: myUserId,
        recipientId: routeUserId,
      });
      setAlreadyContact(true);
      setRequestPending(true);
    }
  };
  const subscribeHandler = function () {
    // Working on this with MyAlg project
  };
  const removeContactHandler = function () {
    if (socket) {
      socket.emit("remove_contact", {
        senderId: myUserId,
        recipientId: routeUserId,
      });
      setAlreadyContact(false);
    }
  };

  return (
    <div>
      {!myJwtUsed && !itIsMyProfile && (
        <div>
          {alreadyContact ? (
            <button
              onClick={removeContactHandler}
              type="submit"
              className="rounded  bg-gradient-to-r to-violet-700 from-violet-900 px-3 py-1 font-bold text-white shadow shadow-black hover:from-violet-950 hover:to-violet-800"
            >
              {requestPending ? "Remove Request" : "Remove Contact"}
            </button>
          ) : (
            <button
              onClick={requestHandler}
              type="submit"
              className="rounded bg-gradient-to-r to-violet-700 from-violet-900 px-3 py-1 font-bold text-white shadow shadow-black hover:from-violet-950 hover:to-violet-800"
            >
              Request Contact
            </button>
          )}
          <button
            onClick={subscribeHandler}
            type="submit"
            className="m-1 rounded  bg-gradient-to-r to-violet-700 from-violet-900 px-3 py-1 font-bold text-white shadow shadow-black hover:from-violet-950 hover:to-violet-800"
          >
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
}
