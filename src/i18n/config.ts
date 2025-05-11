import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
// import Backend from "i18next-http-backend";

// Import translation files
import commonHr from "./locales/hr/common.json";
import gameHr from "./locales/hr/game.json";
import historyHr from "./locales/hr/history.json";
import playersHr from "./locales/hr/players.json";
import settingsHr from "./locales/hr/settings.json";

import commonEn from "./locales/en/common.json";
import gameEn from "./locales/en/game.json";
import historyEn from "./locales/en/history.json";
import playersEn from "./locales/en/players.json";
import settingsEn from "./locales/en/settings.json";

i18n
  // Load translations from a backend
  // .use(Backend)
  // Detect user language
  // .use(LanguageDetector)
  // Initialize react-i18next
  .use(initReactI18next)
  .init({
    // Default language
    fallbackLng: "hr",
    // Debug mode in development
    debug: import.meta.env.DEV,
    // Resources with all translations
    resources: {
      hr: {
        common: commonHr,
        game: gameHr,
        history: historyHr,
        players: playersHr,
        settings: settingsHr,
      },
      en: {
        common: commonEn,
        game: gameEn,
        history: historyEn,
        players: playersEn,
        settings: settingsEn,
      },
    },
    // Namespaces for organizing translations
    ns: ["common", "game", "players", "settings", "history"],
    defaultNS: "common",
    // Caching
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes
    },
    // React specific options
    react: {
      useSuspense: true,
    },
  });

export default i18n;
