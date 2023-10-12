import Link from "next/link";

export default function NewPostBtn() {
  return (
    <div className="flex ">
      <Link href="./new-post">
        <button className=" m-3">Make New Post!</button>
      </Link>
    </div>
  );
}
