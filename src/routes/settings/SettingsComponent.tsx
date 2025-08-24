import { useTranslation } from "react-i18next";
import { Switch } from "../../components/ui/switch";
import { useTheme } from "../../hooks/useTheme";

export function SettingsComponent() {
  const { t, i18n } = useTranslation("settings");
  const { isDark, toggleTheme } = useTheme();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          {t("gameSettings")}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("targetScore.label")}
            </label>
            <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="1001">{t("targetScore.1001")}</option>
              <option value="701">{t("targetScore.701")}</option>
              <option value="501">{t("targetScore.501")}</option>
              <option value="custom">
                {t("targetScore.custom")}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("gameVariant.label")}
            </label>
            <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
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

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          {t("appSettings")}
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("appPreferences.darkMode")}
            </span>
            <Switch
              checked={isDark}
              onCheckedChange={toggleTheme}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("appPreferences.language")}
            </span>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-sm rounded ${
                  i18n.language === "hr"
                    ? "bg-[#FF8533] text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                }`}
                onClick={() => i18n.changeLanguage("hr")}
              >
                {t("languages.hr")}
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${
                  i18n.language === "en"
                    ? "bg-[#FF8533] text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                }`}
                onClick={() => i18n.changeLanguage("en")}
              >
                {t("languages.en")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          {t("about")}
        </h2>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("version", { version: "1.0.0" })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </div>
  );
}
