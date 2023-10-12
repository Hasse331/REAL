import "../app/styles/globals.css";
import Layout from "../app/components/layout";
import Post from "../app/components/post";
import InfiniteScroll from "../app/components/infinite-scroll";
import RightNavBtn from "../app/components/buttons/nav-right";
import LeftNavBtn from "../app/components/buttons/nav-left";
import NewPostBtn from "../app/components/buttons/new-post-btn";

function Home() {
  const GET_userId = "GET_UUID_FROM_POST";
  return (
    <div>
      <Layout />
      <NewPostBtn />
      <InfiniteScroll ComponentToRender={Post} />
      <RightNavBtn link="./profile" usrId={GET_userId} />
      <LeftNavBtn link="./chat" />
    </div>
  );
}

export default Home;
