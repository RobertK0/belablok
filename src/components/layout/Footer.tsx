import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation("settings");

  return (
    <footer className="bg-white shadow-inner mt-auto hidden md:block">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
