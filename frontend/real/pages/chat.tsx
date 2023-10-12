import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import RightNavBtn from "../app/components/buttons/nav-right";

function Profile() {
  return (
    <div>
      <Layout />
      <RightNavBtn link="./" />
      <h1>Chat & Contacts</h1>
    </div>
  );
}

export default Profile;
