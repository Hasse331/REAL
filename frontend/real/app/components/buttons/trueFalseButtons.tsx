import React from "react";

export default function TrueFalseButtons() {
  return (
    <div className="space-x-2 m-2 ml-0">
      <button className=" h-6 w-10 rounded-lg bg-violet-700 ml-0 p-1 mt-1  text-xs text-white">
        True
      </button>
      <button className="h-6 w-10 rounded-lg bg-violet-900 ml-0  p-1 mt-1  text-xs text-white">
        False
      </button>
      <button className="h-6 w-10 rounded-lg bg-violet-700 p-1 mt-1  text-xs text-white">
        Pos
      </button>
      <button className="h-6 w-10 rounded-lg bg-violet-900 p-1 mt-1  text-xs text-white">
        Neg
      </button>
      {/* 
      <button className="h-6 w-10 rounded-lg bg-violet-700 p-1 mt-1  text-xs text-white">
        Appr
      </button>
      <button className="h-6 w-10 rounded-lg bg-violet-900 p-1 mt-1 text-xs text-white">
        Inapp
      </button> */}
    </div>
  );
}
