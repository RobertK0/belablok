import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../common/LanguageSwitcher";

export function Navbar() {
  const { t } = useTranslation("common");

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl font-bold text-primary-600"
            >
              {t("app.name")}
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            {/* Desktop navigation */}
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                {t("navigation.home")}
              </Link>
              <Link
                to="/score"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                {t("navigation.score")}
              </Link>
              <Link
                to="/history"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                {t("navigation.history")}
              </Link>
              <Link
                to="/players"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                {t("navigation.players")}
              </Link>
              <Link
                to="/settings"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                {t("navigation.settings")}
              </Link>
            </div>
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      {/* Mobile navigation bar at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center p-2">
            <span className="text-xs">{t("navigation.home")}</span>
          </Link>
          <Link
            to="/score"
            className="flex flex-col items-center p-2"
          >
            <span className="text-xs">{t("navigation.score")}</span>
          </Link>
          <Link
            to="/history"
            className="flex flex-col items-center p-2"
          >
            <span className="text-xs">
              {t("navigation.history")}
            </span>
          </Link>
          <Link
            to="/players"
            className="flex flex-col items-center p-2"
          >
            <span className="text-xs">
              {t("navigation.players")}
            </span>
          </Link>
          <Link
            to="/settings"
            className="flex flex-col items-center p-2"
          >
            <span className="text-xs">
              {t("navigation.settings")}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
