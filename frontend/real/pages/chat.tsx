import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import RightNavBtn from "../app/components/buttons/nav-right";
import React from "react";

function Profile() {
  return (
    <div>
      <Layout />
      <RightNavBtn link="./" />
      <h1>Chat & Contacts</h1>
      <h2 className="text-xl italic text-center">
        Chat & Contacts feature coming soon!
      </h2>
    </div>
  );
}

export default Profile;
