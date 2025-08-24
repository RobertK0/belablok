import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";

export function HomeComponent() {
  const { t } = useTranslation(["common", "game"]);
  const navigate = useNavigate();

  const handleNewGame = () => {
    navigate({ to: "/setup" });
  };

  const handleContinueGame = () => {
    // Check if there's an ongoing game
    const lastGame = localStorage.getItem("currentGame");
    if (lastGame) {
      navigate({ to: "/score" });
    } else {
      // If no ongoing game, go to setup
      navigate({ to: "/setup" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {t("navigation.home")}
      </h1>
      <div className="grid gap-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("app.tagline", { ns: "common" })}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="bg-gradient-to-r from-[#FF8533] to-[#FF6B00] text-white px-4 py-2 rounded-lg font-semibold"
              onClick={handleNewGame}
            >
              {t("newGame", { ns: "game" })}
            </button>
            <button
              className="bg-white dark:bg-gray-800 border border-[#FF8533] text-[#FF8533] px-4 py-2 rounded-lg font-semibold"
              onClick={handleContinueGame}
            >
              {t("continueGame", { ns: "game" })}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("pastGames", { ns: "history" })}
          </h2>
          <div className="space-y-2">
            <p className="text-gray-500 text-sm italic">
              {t("noHistory", { ns: "history" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
