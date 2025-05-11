import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import {
  type Player,
  getStoredPlayers,
  getLastGameSetup,
  saveGameSetup,
} from "../../services/playerService";
import { PlayerSeat } from "./components/PlayerSeat";
import { cn } from "../../utils/cn";

export function SetupComponent() {
  const { t } = useTranslation(["game", "common"]);
  const navigate = useNavigate();

  // State for selected players and dealer
  const [selectedPlayers, setSelectedPlayers] = useState<
    (Player | null)[]
  >([null, null, null, null]);
  const [dealerIndex, setDealerIndex] = useState<number | null>(
    null
  );
  const [availablePlayers, setAvailablePlayers] = useState<
    Player[]
  >([]);

  // Load players from localStorage on mount
  useEffect(() => {
    const storedPlayers = getStoredPlayers();
    setAvailablePlayers(storedPlayers);

    // Check for last game setup
    const lastGame = getLastGameSetup();
    if (lastGame) {
      setSelectedPlayers(lastGame.players);
      setDealerIndex(lastGame.dealer);
    }
  }, []);

  const handleSelectPlayer = (
    index: number,
    player: Player | null
  ) => {
    const newSelectedPlayers = [...selectedPlayers];
    newSelectedPlayers[index] = player;
    setSelectedPlayers(newSelectedPlayers);
  };

  const handleSetDealer = (index: number) => {
    setDealerIndex(index);
  };

  const handleStartGame = () => {
    // Save game setup
    saveGameSetup(selectedPlayers, dealerIndex);

    // Navigate to score screen with game data
    navigate({ to: "/score", search: { new: "true" } });
  };

  // Get all players including newly added ones
  const getAllPlayers = () => {
    return getStoredPlayers();
  };

  // Filter out players that are already selected, except for the one in the current seat
  const getAvailablePlayersForSeat = (seatIndex: number) => {
    const allPlayers = getAllPlayers();
    return allPlayers.filter(
      (player) =>
        !selectedPlayers.some(
          (selectedPlayer, idx) =>
            idx !== seatIndex &&
            selectedPlayer &&
            selectedPlayer.id === player.id
        )
    );
  };

  const allPlayersSelected = selectedPlayers.every(
    (player) => player !== null
  );
  const dealerSelected = dealerIndex !== null;
  const canStartGame = allPlayersSelected && dealerSelected;

  // Group players into teams
  const team1 = [selectedPlayers[0], selectedPlayers[2]];
  const team2 = [selectedPlayers[1], selectedPlayers[3]];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {t("gameSetup.title", { ns: "game" })}
      </h1>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-4">
          {t("gameSetup.selectPlayers", { ns: "game" })}
        </h2>

        {/* Teams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Team 1 */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#FF8533]">
              {t("gameSetup.team1", { ns: "game" })}
            </h3>
            <div className="space-y-3">
              <PlayerSeat
                index={0}
                player={selectedPlayers[0]}
                isDealer={dealerIndex === 0}
                onSelectPlayer={handleSelectPlayer}
                onSetDealer={handleSetDealer}
                availablePlayers={getAvailablePlayersForSeat(0)}
              />
              <PlayerSeat
                index={2}
                player={selectedPlayers[2]}
                isDealer={dealerIndex === 2}
                onSelectPlayer={handleSelectPlayer}
                onSetDealer={handleSetDealer}
                availablePlayers={getAvailablePlayersForSeat(2)}
              />
            </div>
          </div>

          {/* Team 2 */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#FF8533]">
              {t("gameSetup.team2", { ns: "game" })}
            </h3>
            <div className="space-y-3">
              <PlayerSeat
                index={1}
                player={selectedPlayers[1]}
                isDealer={dealerIndex === 1}
                onSelectPlayer={handleSelectPlayer}
                onSetDealer={handleSetDealer}
                availablePlayers={getAvailablePlayersForSeat(1)}
              />
              <PlayerSeat
                index={3}
                player={selectedPlayers[3]}
                isDealer={dealerIndex === 3}
                onSelectPlayer={handleSelectPlayer}
                onSetDealer={handleSetDealer}
                availablePlayers={getAvailablePlayersForSeat(3)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            className={cn(
              "px-4 py-2 border border-gray-300 rounded-md text-sm",
              "hover:bg-gray-50 transition-colors"
            )}
            onClick={() => navigate({ to: "/players" })}
          >
            {t("gameSetup.managePlayers", { ns: "game" })}
          </button>

          <button
            className={cn(
              "px-6 py-2 rounded-md font-semibold",
              canStartGame
                ? "bg-gradient-to-r from-[#FF8533] to-[#FF6B00] text-white hover:from-[#E67521] hover:to-[#E56200] transition-colors"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            )}
            disabled={!canStartGame}
            onClick={handleStartGame}
          >
            {t("gameSetup.startGame", { ns: "game" })}
          </button>
        </div>
      </div>

      {/* Game Setup Instructions */}
      {!allPlayersSelected && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">
            {t("instructions", {
              ns: "common",
              defaultValue: "Instructions",
            })}
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>
              {t("selectAllPlayers", {
                ns: "game",
                defaultValue:
                  "Select all 4 players by clicking on the empty seats",
              })}
            </li>
            <li>
              {t("selectDealer", {
                ns: "game",
                defaultValue:
                  'Assign a dealer by clicking "Set as Dealer" next to a player',
              })}
            </li>
            <li>
              {t("startGameWhenReady", {
                ns: "game",
                defaultValue:
                  'Click "Start Game" when ready to begin',
              })}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
