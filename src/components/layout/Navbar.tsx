import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl font-bold text-primary-600"
            >
              Belablok
            </Link>
          </div>
          <div className="hidden md:block">
            {/* Desktop navigation */}
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/score"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                Score
              </Link>
              <Link
                to="/history"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                History
              </Link>
              <Link
                to="/players"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                Players
              </Link>
              <Link
                to="/settings"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile navigation bar at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center p-2">
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/score"
            className="flex flex-col items-center p-2"
          >
            <span className="text-xs">Score</span>
          </Link>
          <Link
            to="/history"
            className="flex flex-col items-center p-2"
          >
            <span className="text-xs">History</span>
          </Link>
          <Link
            to="/players"
            className="flex flex-col items-center p-2"
          >
            <span className="text-xs">Players</span>
          </Link>
          <Link
            to="/settings"
            className="flex flex-col items-center p-2"
          >
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
