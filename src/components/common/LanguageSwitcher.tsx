import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation("settings");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        className={`px-2 py-1 text-sm rounded ${
          i18n.language === "hr"
            ? "bg-[#FF8533] text-white"
            : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
        }`}
        onClick={() => changeLanguage("hr")}
        aria-label={t("languages.hr")}
      >
        HR
      </button>
      <button
        className={`px-2 py-1 text-sm rounded ${
          i18n.language === "en"
            ? "bg-[#FF8533] text-white"
            : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
        }`}
        onClick={() => changeLanguage("en")}
        aria-label={t("languages.en")}
      >
        EN
      </button>
    </div>
  );
}
