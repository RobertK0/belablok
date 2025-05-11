import { useTranslation } from "react-i18next";

export function SettingsComponent() {
  const { t, i18n } = useTranslation("settings");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3">
          {t("gameSettings")}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("targetScore.label")}
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="501">{t("targetScore.501")}</option>
              <option value="701">{t("targetScore.701")}</option>
              <option value="1001">{t("targetScore.1001")}</option>
              <option value="custom">
                {t("targetScore.custom")}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("gameVariant.label")}
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="standard">
                {t("gameVariant.standard")}
              </option>
              <option value="open">{t("gameVariant.open")}</option>
              <option value="coinche">
                {t("gameVariant.coinche")}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3">
          {t("appSettings")}
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {t("appPreferences.darkMode")}
            </span>
            <button className="w-12 h-6 bg-gray-200 rounded-full relative">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {t("appPreferences.vibration")}
            </span>
            <button className="w-12 h-6 bg-[#FF8533] rounded-full relative">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {t("appPreferences.sounds")}
            </span>
            <button className="w-12 h-6 bg-gray-200 rounded-full relative">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {t("appPreferences.language")}
            </span>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-sm rounded ${
                  i18n.language === "hr"
                    ? "bg-[#FF8533] text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => i18n.changeLanguage("hr")}
              >
                {t("languages.hr")}
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${
                  i18n.language === "en"
                    ? "bg-[#FF8533] text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => i18n.changeLanguage("en")}
              >
                {t("languages.en")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">{t("about")}</h2>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {t("version", { version: "1.0.0" })}
          </p>
          <p className="text-sm text-gray-600">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </div>
  );
}
