export function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-auto hidden md:block">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Belablok. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
