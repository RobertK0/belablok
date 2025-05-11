import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type PlayerDeclaration } from "../../../services/gameService";
import { type Player } from "../../../services/playerService";
import { cn } from "../../../utils/cn";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../../../components/common/dialog/Dialog.component";

interface PlayerDeclarationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  playerIndex: number;
  onAddDeclaration: (declaration: PlayerDeclaration) => void;
  existingDeclarations: PlayerDeclaration[];
}

export function PlayerDeclarationsModal({
  isOpen,
  onClose,
  player,
  playerIndex,
  onAddDeclaration,
  existingDeclarations,
}: PlayerDeclarationsModalProps) {
  const { t } = useTranslation("game");
  const [selectedValues, setSelectedValues] = useState<number[]>(
    []
  );

  const declarationValues = [20, 50, 100, 150, 200];

  const existingDeclaration = existingDeclarations.find(
    (d) => d.playerIndex === playerIndex
  );

  const totalValue = selectedValues.reduce(
    (sum, val) => sum + val,
    0
  );
  const existingTotal = existingDeclaration?.total || 0;
  const combinedTotal = totalValue + existingTotal;

  const handleValueClick = (value: number) => {
    setSelectedValues([...selectedValues, value]);
  };

  const handleRemoveValue = (index: number) => {
    setSelectedValues(selectedValues.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!player || selectedValues.length === 0) return;

    const newDeclaration: PlayerDeclaration = {
      playerId: player.id,
      playerIndex,
      values: [
        ...(existingDeclaration?.values || []),
        ...selectedValues,
      ],
      total: combinedTotal,
    };

    onAddDeclaration(newDeclaration);
    setSelectedValues([]);
    onClose();
  };

  const handleClear = () => {
    setSelectedValues([]);
  };

  if (!player) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{t("playerDeclarations.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-medium">{player.name}</div>
            {existingDeclaration && (
              <div className="mt-2">
                <div className="text-sm text-gray-600">
                  {t("playerDeclarations.total")}:{" "}
                  <span className="font-medium">
                    {existingDeclaration.total}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {existingDeclaration.values.map((value, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 rounded-full px-2 py-1 text-xs"
                    >
                      +{value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium mb-2">
              {t("playerDeclarations.value")}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {declarationValues.map((value) => (
                <button
                  key={value}
                  className={cn(
                    "py-2 rounded-md text-sm font-medium",
                    "bg-gray-200 hover:bg-gray-300 transition-colors"
                  )}
                  onClick={() => handleValueClick(value)}
                >
                  +{value}
                </button>
              ))}
            </div>
          </div>

          {selectedValues.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium mb-2">
                {t("playerDeclarations.add")}:
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedValues.map((value, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-full pl-2 pr-1 py-1 text-xs flex items-center"
                  >
                    +{value}
                    <button
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => handleRemoveValue(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                {t("playerDeclarations.total")}:{" "}
                <span className="font-medium">{totalValue}</span>
                {existingTotal > 0 && (
                  <span className="text-gray-500">
                    {" "}
                    (
                    {t("total", {
                      ns: "common",
                      defaultValue: "Total",
                    })}
                    : {combinedTotal})
                  </span>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between w-full">
              <button
                className={cn(
                  "px-4 py-2 rounded-md",
                  "bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                )}
                onClick={handleClear}
              >
                {t("clear", {
                  ns: "common",
                  defaultValue: "Clear",
                })}
              </button>
              <div className="space-x-2">
                <button
                  className={cn(
                    "px-4 py-2 rounded-md",
                    "bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                  )}
                  onClick={onClose}
                >
                  {t("actions.cancel", { ns: "common" })}
                </button>
                <button
                  className={cn(
                    "px-4 py-2 rounded-md",
                    "bg-gradient-to-r from-[#FF8533] to-[#FF6B00] text-white",
                    "hover:from-[#E67521] hover:to-[#E56200] transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  onClick={handleSave}
                  disabled={selectedValues.length === 0}
                >
                  {t("addDeclaration")}
                </button>
              </div>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
