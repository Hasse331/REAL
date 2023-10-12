import Link from "next/link";

export default function RightNavBtn(props: any) {
  const Indentifier_link = `${props.link}?userId=${props.usrId}`;
  return (
    <Link href={Indentifier_link}>
      <div className=" right-nav-btn fixed right-1 top-1/2  rounded-lg bg-violet-950 p-4 px-0.5 py-0.5 opacity-40 shadow hover:bg-violet-700 hover:opacity-100">
        <p>🡪</p>
      </div>
    </Link>
  );
}
