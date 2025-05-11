export function ScoreComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Current Game</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">
            Team 1: <span className="text-[#FF8533]">0</span>
          </div>
          <div className="text-lg font-semibold">
            Team 2: <span className="text-[#FF8533]">0</span>
          </div>
        </div>

        <div className="h-1 w-full bg-gray-200 rounded">
          <div
            className="h-1 bg-[#FF8533] rounded"
            style={{ width: "0%" }}
          ></div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Add Score</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team 1
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team 2
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="0"
            />
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-[#FF8533] to-[#FF6B00] text-white px-4 py-2 rounded-lg font-semibold">
          Add Round
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Rounds</h2>
        <div className="space-y-2">
          <p className="text-gray-500 text-sm italic">
            No rounds recorded yet
          </p>
        </div>
      </div>
    </div>
  );
}
