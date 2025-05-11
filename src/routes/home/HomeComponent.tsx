export function HomeComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <div className="grid gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-[#FF8533] to-[#FF6B00] text-white px-4 py-2 rounded-lg font-semibold">
              New Game
            </button>
            <button className="bg-white border border-[#FF8533] text-[#FF8533] px-4 py-2 rounded-lg font-semibold">
              Continue Game
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">
            Recent Games
          </h2>
          <div className="space-y-2">
            <p className="text-gray-500 text-sm italic">
              No recent games found
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
