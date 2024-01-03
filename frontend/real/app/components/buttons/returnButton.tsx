import React from "react";

export default function ReturnBtn() {
  return (
    <div>
      <button
        className="bg-transparent ml-1 border-none mt-3 shadow-none cursor-pointer focus:outline-none hover:bg-transparent hover:border-none text-black"
        onClick={() => window.history.back()}
      >
        🡨 Return
      </button>
    </div>
  );
}
