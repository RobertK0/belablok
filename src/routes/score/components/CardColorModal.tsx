import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { type CardColor } from "../../../services/gameService";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../../../components/common/dialog/Dialog.component";

interface CardColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (color: CardColor) => void;
  selectedColor: CardColor;
}

export function CardColorModal({
  isOpen,
  onClose,
  onSelectColor,
  selectedColor,
}: CardColorModalProps) {
  const { t } = useTranslation("game");

  const cardColors: { id: CardColor; icon: string }[] = [
    { id: "acorns", icon: "🌰" },
    { id: "hearts", icon: "❤️" },
    { id: "leaves", icon: "🍃" },
    { id: "bells", icon: "🔔" },
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("cardColors.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            {t("selectCardColor")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {cardColors.map((color) => (
              <button
                key={color.id}
                className={cn(
                  "flex items-center justify-center p-4 rounded-lg border-2",
                  selectedColor === color.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => onSelectColor(color.id)}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-2">
                    {color.icon}
                  </span>
                  <span className="text-sm">
                    {t(`cardColors.${color.id}`)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <DialogFooter>
            <button
              className={cn(
                "px-4 py-2 rounded-md",
                "bg-gradient-to-r from-[#FF8533] to-[#FF6B00] text-white",
                "hover:from-[#E67521] hover:to-[#E56200] transition-colors"
              )}
              onClick={onClose}
            >
              {t("closeModal")}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
