export default function Home() {
  return (
    <div className="h-screen p-4">
      <div className="grid grid-cols-5 grid-rows-2 gap-4 h-full">
        {/* Left side (equal halves) */}
        <div className="col-span-3 bg-amber-50">1</div>
        <div className="col-span-3 bg-green-200 row-start-2">2</div>

        {/* Right side (3 equal parts stacked) */}
        <div className="col-span-2 row-span-2 col-start-4 flex flex-col gap-4">
          <div className="flex-1 bg-blue-200">3</div>
          <div className="flex-1 bg-red-200">4</div>
          <div className="flex-1 bg-yellow-200">5</div>
        </div>
      </div>
    </div>
  );
}
