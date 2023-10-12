import Image from "next/image";

export default function Post() {
  return (
    <div className=" m-3 rounded-lg border border-solid border-violet-700 bg-violet-100 p-5 shadow-md shadow-black ">
      <span className=" rounded-md bg-violet-700 p-1 text-xs text-slate-50">
        Topic
      </span>
      <span className=" m-1 rounded-md bg-violet-700 p-1 text-xs text-slate-50">
        Other Topic
      </span>
      <h2 className="text-2xl">
        <b>Post Title</b>{" "}
      </h2>
      <p>By: Matti Meikäläinen</p>
      <Image
        className="rounded border border-solid border-violet-700 shadow shadow-black"
        src="/images/cat.png"
        alt="cat"
        width={500}
        height={500}
      />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
        cursus urna sed elit sagittis, at malesuada justo facilisis. Nulla
        facilisi. Nunc sollicitudin, lorem nec mattis vehicula, elit urna
        tincidunt libero, in volutpat sem urna ac ipsum. Sed sodales nisl eget
        ante laoreet, at cursus nulla tempus. Nulla facilisi. Phasellus viverra
        justo a quam malesuada, sed ultrices libero feugiat. Vivamus at libero
        in ante laoreet scelerisque. Sed fringilla augue a lacus tincidunt, id
        posuere elit lacinia. Vestibulum bibendum risus id laoreet ullamcorper.
        Suspendisse potenti. Duis congue turpis nec metus posuere dictum. In hac
        habitasse platea dictumst. Aliquam tincidunt, libero eget sodales
        egestas, purus erat congue tortor, ut mattis velit lorem id nunc.
        Praesent malesuada tellus id nisi v
      </p>
    </div>
  );
}
