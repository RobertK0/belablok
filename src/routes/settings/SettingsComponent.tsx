import { useTranslation } from "react-i18next";
import { Switch } from "../../components/ui/switch";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../../components/common/button/Button.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export function SettingsComponent() {
  const { t, i18n } = useTranslation("settings");
  const { isDark, toggleTheme } = useTheme();

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

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
            <Select defaultValue="1001">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1001">
                  {t("targetScore.1001")}
                </SelectItem>
                <SelectItem value="701">
                  {t("targetScore.701")}
                </SelectItem>
                <SelectItem value="501">
                  {t("targetScore.501")}
                </SelectItem>
                <SelectItem value="custom">
                  {t("targetScore.custom")}
                </SelectItem>
              </SelectContent>
            </Select>
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
          <div>
            <Button variant="destructive" onClick={handleClearData}>
              Reset all data
            </Button>
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
