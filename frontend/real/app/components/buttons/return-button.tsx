export default function ReturnBtn() {
  return (
    <div>
      <button
        className="bg-transparent border-none shadow-none cursor-pointer focus:outline-none hover:bg-transparent hover:border-none text-black"
        onClick={() => window.history.back()}
      >
        🡨 Return
      </button>
    </div>
  );
}
