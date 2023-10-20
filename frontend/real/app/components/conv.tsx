import React from "react";
import PostButtons from "./buttons/post-btns";

export default function Conv() {
  return (
    <div className="border  shadow-md shadow-black to-gray-500 from-gray-700 bg-gradient-to-r rounded border-solid mt-5 border-violet-700 m-3">
      <h3 className="m-2">
        <b>Matti Meikäläinen</b>
      </h3>
      <hr />
      <p className="m-2">
        Integer viverra fringilla turpis, in scelerisque leo. Sed mattis
        venenatis turpis, non congue elit iaculis id. Maecenas eu velit eget
        lectus aliquet congue. Nunc venenatis erat quis arcu pellentesque, sed
        dapibus arcu blandit. Nulla id vestibulum leo, a cursus enim. Sed
        vestibulum euismod justo a bibendum. Aenean in efficitur elit. Nunc ac
        massa sit amet metus feugiat blandit. Integer ut nisl eu purus luctus
        euismod. Nullam lacinia libero non ligula fermentum, eu consequat metus
        bibendum. Vivamus id urna vel justo aliquet rhoncus. Sed vestibulum
        tristique urna, at aliquam nulla laoreet se
      </p>
      <div className="ml-2">
        <PostButtons />
      </div>
    </div>
  );
}
