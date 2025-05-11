import { useTranslation } from "react-i18next";

export function HomeComponent() {
  const { t } = useTranslation(["common", "game"]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {t("navigation.home")}
      </h1>
      <div className="grid gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("app.tagline", { ns: "common" })}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-[#FF8533] to-[#FF6B00] text-white px-4 py-2 rounded-lg font-semibold">
              {t("newGame", { ns: "game" })}
            </button>
            <button className="bg-white border border-[#FF8533] text-[#FF8533] px-4 py-2 rounded-lg font-semibold">
              {t("continueGame", { ns: "game" })}
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("recentGames", {
              ns: "history",
              defaultValue: "Recent Games",
            })}
          </h2>
          <div className="space-y-2">
            <p className="text-gray-500 text-sm italic">
              {t("noHistory", {
                ns: "history",
                defaultValue: "No recent games found",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
