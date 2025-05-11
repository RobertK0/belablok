export function HistoryComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Game History</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Past Games</h2>
          <button className="px-3 py-1 text-sm bg-[rgba(255,133,51,0.1)] text-[#FF8533] rounded-full">
            Filter
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-500 text-sm italic">
            No game history available
          </p>

          {/* This would be populated with actual game history */}
          {/* Example of what a game entry would look like:
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm">June 15, 2023</span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Completed
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Team 1 vs Team 2</p>
                <p className="text-[#FF8533] font-semibold">162 - 98</p>
              </div>
              <button className="text-sm text-gray-600 hover:text-[#FF8533]">
                View details
              </button>
            </div>
          </div>
          */}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Statistics</h2>
        <div className="space-y-2">
          <p className="text-gray-500 text-sm italic">
            Play some games to see your statistics
          </p>
        </div>
      </div>
    </div>
  );
}
