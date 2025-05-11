export function PlayersComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Players</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Player List</h2>
          <button className="px-3 py-1 text-sm bg-[rgba(255,133,51,0.1)] text-[#FF8533] rounded-full">
            Add Player
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-500 text-sm italic">
            No players added yet
          </p>

          {/* This would be populated with actual players */}
          {/* Example of what a player entry would look like:
          <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-500">10 games played</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:text-[#FF8533]">
                Edit
              </button>
              <button className="p-2 text-gray-600 hover:text-red-500">
                Delete
              </button>
            </div>
          </div>
          */}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3">Teams</h2>

        <div className="space-y-4">
          <p className="text-gray-500 text-sm italic">
            No teams created yet
          </p>

          <button className="w-full border border-dashed border-gray-300 text-gray-500 rounded-lg p-4 text-center hover:border-[#FF8533] hover:text-[#FF8533]">
            Create a new team
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">
          Player Statistics
        </h2>
        <div className="space-y-2">
          <p className="text-gray-500 text-sm italic">
            No player statistics available
          </p>
        </div>
      </div>
    </div>
  );
}
