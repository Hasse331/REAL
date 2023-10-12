export default function PostButtons() {
  return (
    <div className="flex space-x-2">
      <button className=" h-6 w-10 rounded-lg bg-violet-700 p-1 text-xs text-white">
        True
      </button>
      <button className="h-6 w-10 rounded-lg bg-violet-900 p-1 text-xs text-white">
        False
      </button>
      <button className="h-6 w-10 rounded-lg bg-violet-700 p-1 text-xs text-white">
        Pos
      </button>
      <button className="h-6 w-10 rounded-lg bg-violet-900 p-1 text-xs text-white">
        Neg
      </button>

      <button className="h-6 w-10 rounded-lg bg-violet-700 p-1 text-xs text-white">
        Appr
      </button>
      <button className="h-6 w-10 rounded-lg bg-violet-900 p-1 text-xs text-white">
        Inapp
      </button>
    </div>
  );
}
