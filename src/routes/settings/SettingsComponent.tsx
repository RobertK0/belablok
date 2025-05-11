export function SettingsComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3">
          Game Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Score
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="162">162 points</option>
              <option value="501">501 points</option>
              <option value="1001">1001 points</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Game Variant
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="standard">Standard Belote</option>
              <option value="open">Open Belote</option>
              <option value="coinche">Coinche Belote</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3">App Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Dark Mode
            </span>
            <button className="w-12 h-6 bg-gray-200 rounded-full relative">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Vibration Feedback
            </span>
            <button className="w-12 h-6 bg-[#FF8533] rounded-full relative">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Sound Effects
            </span>
            <button className="w-12 h-6 bg-gray-200 rounded-full relative">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">About</h2>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Version 1.0.0</p>
          <p className="text-sm text-gray-600">© 2023 Belablok</p>
        </div>
      </div>
    </div>
  );
}
