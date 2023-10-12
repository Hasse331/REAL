import Layout from "../app/components/layout";
import Post from "../app/components/post";
import Conv from "../app/components/conv";
import InfiniteScroll from "@/app/components/infinite-scroll";
import ReturnBtn from "@/app/components/buttons/return-button";
import LeftNavBtn from "@/app/components/buttons/nav-left";
import RightNavBtn from "@/app/components/buttons/nav-right";

export default function PostPage() {
  return (
    <div>
      <Layout />
      <ReturnBtn />
      <Post />
      <InfiniteScroll ComponentToRender={Conv} />
      <LeftNavBtn link="./" />
      <RightNavBtn link="./profile" />
    </div>
  );
}
