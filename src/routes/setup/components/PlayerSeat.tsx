import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Player } from "../../../services/playerService";

import { cn } from "../../../utils/cn";
import { PlayerSelector } from "./PlayerSelector";

interface PlayerSeatProps {
  index: number;
  player: Player | null;
  isDealer: boolean;
  onSelectPlayer: (
    index: number,
    selectedPlayer: Player | null
  ) => void;
  onSetDealer: (index: number) => void;
  availablePlayers: Player[];
}

export function PlayerSeat({
  index,
  player,
  isDealer,
  onSelectPlayer,
  onSetDealer,
  availablePlayers,
}: PlayerSeatProps) {
  const { t } = useTranslation("game");
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div
      className={cn(
        "border rounded-lg p-4",
        isDealer
          ? "border-[#FF8533] bg-[rgba(255,133,51,0.1)]"
          : "border-gray-200"
      )}
    >
      {player ? (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{player.name}</p>
            {isDealer && (
              <span className="text-xs bg-[#FF8533] text-white px-2 py-1 rounded-full mt-1 inline-block">
                {t("gameSetup.dealer")}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              className="p-1 text-gray-500 hover:text-[#FF8533] transition-colors"
              onClick={() => setShowSelector(true)}
            >
              {t("actions.change", { ns: "common" })}
            </button>
            {!isDealer && (
              <button
                className="p-1 text-gray-500 hover:text-[#FF8533] transition-colors"
                onClick={() => onSetDealer(index)}
              >
                {t("gameSetup.setAsDealer")}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-24">
          <button
            className={cn(
              "w-full py-2 border border-dashed border-gray-300 rounded-lg",
              "text-gray-500 hover:border-[#FF8533] hover:text-[#FF8533] transition-colors"
            )}
            onClick={() => setShowSelector(true)}
          >
            {t("gameSetup.selectPlayer")}
          </button>
        </div>
      )}

      <PlayerSelector
        open={showSelector}
        availablePlayers={availablePlayers}
        onSelectPlayer={(selectedPlayer) => {
          onSelectPlayer(index, selectedPlayer);
          setShowSelector(false);
        }}
        onClose={() => setShowSelector(false)}
      />
    </div>
  );
}
