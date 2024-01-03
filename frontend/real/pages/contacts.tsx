import React, { useEffect, useState } from "react";
import RightNavBtn from "../app/components/buttons/navRight";
import { useRouter } from "next/router";
import useSocketConnection from "@/app/utils/useSocketConnection";
import Link from "next/link";
import getUserUUID from "@/app/utils/getUserId";
import ProfileIcon from "@/app/components/buttons/profileIcon";

function ContactsPage() {
  const [contactsData, setContactsData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [usernames, setUsernames] = useState<UsernamesDict>();
  const socket = useSocketConnection();
  const myUserId = getUserUUID();
  const router = useRouter();

  interface Contact {
    sender_id: string;
    recipient_id: string;
    accepted: boolean;
    latest_ts: Date;
  }

  interface UsernamesDict {
    [key: string]: string; // A dictionary where the key is a string UUID and the value is a username
  }

  interface User {
    user_id: string;
    username: string;
  }

  useEffect(() => {
    if (!myUserId) {
      alert("Please login first");
      router.push("/");
      return;
    }

    if (socket) {
      // Request contacts data by myUserId:
      socket.emit("fetch_contacts", myUserId);

      // Receive contacts data and process it:
      socket.on("contacts_data", (contacts: Contact[]) => {
        setContactsData(contacts);
        setLoading(false);

        // Create idList for fetching usernames:
        const idList = contacts.flatMap((contact) => [
          contact.sender_id,
          contact.recipient_id,
        ]);

        // Fetch usernames form user data backend by using the idList:
        if (idList.length > 0) {
          const profileNameEndpoint =
            process.env.NEXT_PUBLIC_GET_PROFILENAMES ||
            "INCORRECT_ENDPOINT: profileNameEndpoint";

          fetch(profileNameEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idList }),
          })
            .then((resp) => resp.json())
            .then((data) => {
              const usernamesDict: UsernamesDict = data.reduce(
                (acc: UsernamesDict, user: User) => {
                  acc[user.user_id] = user.username;
                  return acc;
                },
                {} as UsernamesDict
              );
              setUsernames(usernamesDict);
            })
            .catch((error) => {
              console.error("Error fetching profile names:", error);
            });
        }
      });

      socket.on("error", (error: Error) => {
        console.error("Error:", error);
      });

      return () => {
        socket.off("contacts_data");
        socket.off("error");
      };
    }
  }, [socket, myUserId, router]);

  const removeContactHandler = function (senderId: string) {
    if (socket && myUserId) {
      socket.emit("remove_contact", {
        senderId: senderId,
        recipientId: myUserId,
      });
    }
  };

  const acceptContactRequest = (senderId: string) => {
    if (socket && myUserId) {
      console.log(myUserId);
      socket.emit("accept_contact", {
        senderId: senderId,
        recipientId: myUserId,
      });
      // Update the local state to reflect the change
      setContactsData((prevContacts) =>
        prevContacts.map((contact) =>
          contact.sender_id === senderId && contact.recipient_id === myUserId
            ? { ...contact, accepted: true }
            : contact
        )
      );
    }
  };
  return (
    <div>
      <RightNavBtn link="./" useReturn={true} />
      <h1>Contacts</h1>
      {loading ? (
        <p>Loading contacts...</p>
      ) : (
        contactsData.map((contact, index) => {
          const otherUserId =
            contact.sender_id === myUserId
              ? contact.recipient_id
              : contact.sender_id;
          return (
            <div
              key={index}
              className="m-2 border border-violet-700 hover:bg-gray-900 bg-gray-800 rounded-md shadow shadow-black"
            >
              <div className="flex justify-between ml-1 mr-5 items-center">
                {/* Profile icon and name */}
                <div className="flex flex-grow m-2 items-center">
                  <ProfileIcon userId={otherUserId} />
                  {usernames && (
                    <p className="text-md ml-2">
                      {usernames ? usernames[otherUserId] : "loading..."}
                    </p>
                  )}
                </div>

                {/* Accept / Refuse buttons: */}
                {contact.recipient_id === myUserId && !contact.accepted ? (
                  <div>
                    <button
                      className="m-2 text-sm"
                      onClick={() => acceptContactRequest(contact.sender_id)}
                    >
                      Accept
                    </button>
                    <button
                      className="m-2 text-sm ml-0"
                      onClick={() => removeContactHandler(contact.sender_id)}
                      type="submit"
                    >
                      Refuse
                    </button>
                  </div>
                ) : (
                  <p className="text-sm">
                    {/* Open and Pending buttons: */}
                    {usernames && (
                      <Link
                        href={`/chat?recipientId=${otherUserId}&contactAccepted=${contact.accepted}&profilename=${usernames[otherUserId]}`}
                        passHref
                      >
                        {contact.accepted ? (
                          <button className="m-2 text-sm ml-0">Open</button>
                        ) : (
                          <p>Pending</p>
                        )}
                      </Link>
                    )}
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ContactsPage;
