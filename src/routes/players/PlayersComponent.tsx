import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/common/dialog/Dialog.component";
import {
  type Player,
  getStoredPlayers,
  savePlayer,
} from "../../services/playerService";
import { cn } from "../../utils/cn";

export function PlayersComponent() {
  const { t } = useTranslation(["players", "common"]);
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [playerToDelete, setPlayerToDelete] =
    useState<Player | null>(null);

  // Load players from localStorage
  useEffect(() => {
    const storedPlayers = getStoredPlayers();
    setPlayers(storedPlayers);
  }, []);

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: newPlayerName.trim(),
        createdAt: new Date().toISOString(),
        gamesPlayed: 0,
        gamesWon: 0,
      };

      // Save to localStorage
      savePlayer(newPlayer);

      // Update local state
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
      setShowAddDialog(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddPlayer();
    }
  };

  const handleDeletePlayer = (player: Player) => {
    setPlayerToDelete(player);
  };

  const confirmDeletePlayer = () => {
    if (!playerToDelete) return;

    const updatedPlayers = players.filter(
      (player) => player.id !== playerToDelete.id
    );

    // Update localStorage
    localStorage.setItem("players", JSON.stringify(updatedPlayers));

    // Update local state
    setPlayers(updatedPlayers);
    setPlayerToDelete(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {t("playerList")}
          </h2>
          <button
            onClick={() => setShowAddDialog(true)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium",
              "bg-[#FF8533] text-white hover:bg-[#E67521] transition-colors"
            )}
          >
            {t("addPlayer")}
          </button>
        </div>

        <div className="space-y-3">
          {players.length > 0 ? (
            players.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "border border-gray-200 rounded-lg p-4",
                  "flex justify-between items-center"
                )}
              >
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-gray-500">
                    {t("stats.gamesPlayed", {
                      count: player.gamesPlayed,
                    })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className={cn(
                      "p-2 text-gray-600 hover:text-red-500 transition-colors",
                      "rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                    )}
                    onClick={() => handleDeletePlayer(player)}
                    aria-label={t("deletePlayer")}
                  >
                    {t("actions.delete", { ns: "common" })}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic py-4 text-center">
              {t("noPlayers")}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          className={cn(
            "px-4 py-2 border border-gray-300 rounded-md",
            "hover:bg-gray-50 transition-colors"
          )}
          onClick={() => navigate({ to: "/" })}
        >
          {t("actions.back", { ns: "common" })}
        </button>
      </div>

      {/* Add Player Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{t("addPlayer")}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              {t("forms.playerName")}
            </label>
            <input
              type="text"
              className={cn(
                "w-full border border-gray-300 rounded-md px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-[#FF8533] focus:border-transparent"
              )}
              placeholder={t("forms.playerName")}
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoFocus
            />
          </div>

          <DialogFooter>
            <button
              className={cn(
                "px-4 py-2 border border-gray-300 rounded-md text-sm",
                "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mr-2"
              )}
              onClick={() => setShowAddDialog(false)}
            >
              {t("actions.cancel", { ns: "common" })}
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium",
                newPlayerName.trim()
                  ? "bg-[#FF8533] text-white hover:bg-[#E67521]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed",
                "transition-colors"
              )}
              onClick={handleAddPlayer}
              disabled={!newPlayerName.trim()}
            >
              {t("actions.add", { ns: "common" })}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!playerToDelete}
        onOpenChange={(open) => !open && setPlayerToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("confirmations.deletePlayerTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>{t("confirmations.deletePlayerMessage")}</p>
            {playerToDelete && (
              <p className="font-medium mt-2">
                {playerToDelete.name}
              </p>
            )}
          </div>

          <DialogFooter>
            <button
              className={cn(
                "px-4 py-2 border border-gray-300 rounded-md text-sm",
                "hover:bg-gray-50 transition-colors mr-2"
              )}
              onClick={() => setPlayerToDelete(null)}
            >
              {t("actions.cancel", { ns: "common" })}
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium",
                "bg-red-500 text-white hover:bg-red-600 transition-colors"
              )}
              onClick={confirmDeletePlayer}
            >
              {t("actions.delete", { ns: "common" })}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
