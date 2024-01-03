import "../app/styles/globals.css";
import Layout from "../app/components/navbar";
import LeftNavBtn from "../app/components/buttons/navLeft";
import Image from "next/image";
import Post from "../app/components/post/post";

export default function Profile() {
  return (
    <div>
      <Layout />
      <LeftNavBtn link="./" />
      <div className="m-6">
        <h2 className="text-2xl">
          <b>Matti Meikäläinen</b>{" "}
        </h2>
        <Image
          className="rounded border border-solid border-violet-700 shadow shadow-black"
          src="/images/cat2.jpg"
          alt="cat"
          width={500}
          height={500}
        />
        <div>
          <p>Interests / Topics:</p>
          <span className=" rounded-md bg-violet-700 p-1 text-xs text-slate-50">
            Topic
          </span>
          <span className=" m-1 rounded-md bg-violet-700 p-1 text-xs text-slate-50">
            Other Topic
          </span>
        </div>
        <br />
        <h2>
          <b>About Me:</b>
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
          magna eu nunc blandit tincidunt. Fusce sed massa a nulla eleifend
          facilisis. Vestibulum ante ipsum primis in faucibus orci luctus et
          ultrices posuere cubilia Curae; Aliquam fermentum dui sit amet sapien
          semper, id bibendum odio dictum. Vivamus venenatis metus quis urna
          euismod, at bibendum turpis tincidunt. Praesent scelerisque, libero
          nec sodales commodo, erat tortor ultricies mi, ut tristique elit dolor
          vitae sapien. Quisque ut tincidunt purus. Vestibulum et nisi nisl.
          Donec nec justo in dolor rhoncus tristique. Nulla facilisi. Nullam
          feugiat semper est, ac euismod quam ultricies at. Vivamus tincidunt
          bibendum sem, sed venenatis metus fermentum vel. Sed tincidunt massa
          sit amet dui auctor, ut tincidunt purus tincidunt. Sed eget nisl et
          dui fringilla facilisis. Pellentesque aliquet arcu ut lectus
          tristique, a ultricies velit condimentum. Sed id tellus eu purus
          rutrum tempus vel ut libero. In hac habitasse platea dict
        </p>
        <h2>
          <b>Profession:</b>
          <p>Sed vel urna nec metus iaculis consequat sed vel purus.</p>
        </h2>
        <h2>
          <b>Hobbies:</b>
          <p>Fusce condimentum scelerisque augue ut tincidunt.</p>
        </h2>

        <button
          type="submit"
          className="rounded bg-violet-700 px-4 py-2 font-bold text-white hover:bg-violet-800"
        >
          Send message
        </button>
        <button
          type="submit"
          className="m-1 rounded bg-violet-700 px-4 py-2 font-bold text-white hover:bg-violet-800"
        >
          Add to contacts
        </button>
        <h1>Matti&apos;s posts:</h1>
        <Post />
        <Post />
        <Post />
      </div>
    </div>
  );
}
