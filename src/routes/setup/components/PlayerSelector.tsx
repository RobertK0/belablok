import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type Player,
  savePlayer,
} from "../../../services/playerService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/common/dialog/Dialog.component";
import { cn } from "../../../utils/cn";

interface PlayerSelectorProps {
  open: boolean;
  availablePlayers: Player[];
  onSelectPlayer: (player: Player | null) => void;
  onClose: () => void;
}

export function PlayerSelector({
  open,
  availablePlayers,
  onSelectPlayer,
  onClose,
}: PlayerSelectorProps) {
  const { t } = useTranslation(["game", "common", "players"]);
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleAddNewPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: newPlayerName.trim(),
        createdAt: new Date().toISOString(),
        gamesPlayed: 0,
        gamesWon: 0,
      };

      // Save the new player to localStorage
      savePlayer(newPlayer);

      // Select the new player
      onSelectPlayer(newPlayer);

      // Reset the input
      setNewPlayerName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddNewPlayer();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>
            {t("gameSetup.selectPlayer", { ns: "game" })}
          </DialogTitle>
        </DialogHeader>

        {availablePlayers.length > 0 ? (
          <div className="max-h-60 overflow-y-auto py-2">
            {availablePlayers.map((player) => (
              <button
                key={player.id}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-md mb-1 flex justify-between items-center",
                  "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                )}
                onClick={() => onSelectPlayer(player)}
              >
                <span className="font-medium">{player.name}</span>
                <span className="text-xs text-gray-500">
                  {t("stats.gamesPlayed", {
                    count: player.gamesPlayed,
                    ns: "players",
                  })}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            {t("noPlayers", { ns: "players" })}
          </p>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("gameSetup.addNewPlayer", { ns: "game" })}
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              className={cn(
                "flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-[#FF8533] focus:border-transparent"
              )}
              placeholder={t("gameSetup.playerName", {
                ns: "game",
              })}
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                newPlayerName.trim()
                  ? "bg-[#FF8533] text-white hover:bg-[#E67521]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              )}
              onClick={handleAddNewPlayer}
              disabled={!newPlayerName.trim()}
            >
              {t("actions.add", { ns: "common" })}
            </button>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <button
            className={cn(
              "px-4 py-2 border border-gray-300 rounded-md text-sm",
              "hover:bg-gray-50 transition-colors"
            )}
            onClick={onClose}
          >
            {t("actions.cancel", { ns: "common" })}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
