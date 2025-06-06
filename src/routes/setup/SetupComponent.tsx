import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createGame,
  getActiveGame,
  setDealer,
} from "../../services/gameService";
import {
  type Player,
  getLastGameSetup,
  getStoredPlayers,
  saveGameSetup,
} from "../../services/playerService";
import { cn } from "../../utils/cn";
import { PlayerSeat } from "./components/PlayerSeat";

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
  const [_, setAvailablePlayers] = useState<Player[]>([]);
  const [game, setGame] =
    useState<ReturnType<typeof getActiveGame>>(null);

  // Load players from localStorage on mount
  useEffect(() => {
    const storedPlayers = getStoredPlayers();
    setAvailablePlayers(storedPlayers);

    // Check for active game with previous winner
    const activeGame = getActiveGame();
    setGame(activeGame);

    if (activeGame?.previousWinner) {
      setSelectedPlayers([
        activeGame.team1Players[0],
        activeGame.team2Players[0],
        activeGame.team1Players[1],
        activeGame.team2Players[1],
      ]);
    } else {
      // Check for last game setup if no active game with previous winner
      const lastGame = getLastGameSetup();
      if (lastGame) {
        setSelectedPlayers(lastGame.players);
        setDealerIndex(lastGame.dealer);
      }
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
    // Check if dealer selection is valid based on previous winner
    if (game?.previousWinner) {
      const isValid = setDealer(index);
      if (isValid) {
        setDealerIndex(index);
      }
    } else {
      setDealerIndex(index);
    }
  };

  const handleStartGame = () => {
    if (dealerIndex === null) return;

    // Save game setup for next time
    saveGameSetup(selectedPlayers, dealerIndex);

    // If continuing from previous match, just update the dealer
    if (game?.previousWinner) {
      // Navigate to score screen
      navigate({ to: "/score" });
    } else {
      // Create a new game
      createGame(selectedPlayers, dealerIndex);
      // Navigate to score screen
      navigate({ to: "/score" });
    }
  };

  // Function to determine if a player can be selected as dealer
  const canSelectAsDealer = (playerIndex: number) => {
    if (!game || !game.previousWinner) return true;

    const isTeam1Player = playerIndex === 0 || playerIndex === 2;
    const isTeam2Player = playerIndex === 1 || playerIndex === 3;

    return (
      (game.previousWinner === 1 && isTeam1Player) ||
      (game.previousWinner === 2 && isTeam2Player)
    );
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {t("gameSetup.title", { ns: "game" })}
      </h1>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-4">
          {t("gameSetup.selectPlayers", { ns: "game" })}
        </h2>

        {game?.previousWinner && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 font-medium">
              {t("selectDealerFromWinningTeam", {
                team: game.previousWinner,
                ns: "game",
              })}
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              {t("matchScore", {
                team1: game.matchScore.team1,
                team2: game.matchScore.team2,
                ns: "game",
              })}
            </p>
          </div>
        )}

        {/* Table layout */}
        <div className="mb-6">
          <div className="flex justify-center items-center mb-4">
            <div className="max-w-[300px]">
              <PlayerSeat
                index={2}
                player={selectedPlayers[2]}
                isDealer={dealerIndex === 2}
                onSelectPlayer={handleSelectPlayer}
                onSetDealer={handleSetDealer}
                availablePlayers={getAvailablePlayersForSeat(2)}
                disabled={
                  game?.previousWinner
                    ? !canSelectAsDealer(2)
                    : false
                }
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="max-w-[300px]">
              <PlayerSeat
                index={1}
                player={selectedPlayers[1]}
                isDealer={dealerIndex === 1}
                onSelectPlayer={handleSelectPlayer}
                onSetDealer={handleSetDealer}
                availablePlayers={getAvailablePlayersForSeat(1)}
                disabled={
                  game?.previousWinner
                    ? !canSelectAsDealer(1)
                    : false
                }
              />
            </div>

            <div className="w-16 h-16 border-2 border-[#FF8533] bg-[rgba(255,133,51,0.1)] rounded">
              <div className="h-full flex items-center justify-center text-xs text-center text-gray-500">
                {t("gameSetup.table", {
                  ns: "game",
                  defaultValue: "Table",
                })}
              </div>
            </div>

            <div className="max-w-[300px]">
              <PlayerSeat
                index={3}
                player={selectedPlayers[3]}
                isDealer={dealerIndex === 3}
                onSelectPlayer={handleSelectPlayer}
                onSetDealer={handleSetDealer}
                availablePlayers={getAvailablePlayersForSeat(3)}
                disabled={
                  game?.previousWinner
                    ? !canSelectAsDealer(3)
                    : false
                }
              />
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="max-w-[300px]">
              <PlayerSeat
                index={0}
                player={selectedPlayers[0]}
                isDealer={dealerIndex === 0}
                onSelectPlayer={handleSelectPlayer}
                onSetDealer={handleSetDealer}
                availablePlayers={getAvailablePlayersForSeat(0)}
                disabled={
                  game?.previousWinner
                    ? !canSelectAsDealer(0)
                    : false
                }
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <div className="text-center text-sm text-gray-500">
              <p className="font-medium mb-1">
                {t("gameSetup.partners", {
                  ns: "game",
                  defaultValue: "Partners",
                })}
              </p>
              <div className="flex space-x-1 justify-center">
                <span className="px-2 py-1 bg-[#FF8533] text-white rounded-md">
                  {selectedPlayers[0]?.name?.substring(0, 3) ||
                    "..."}
                </span>
                <span className="px-1">+</span>
                <span className="px-2 py-1 bg-[#FF8533] text-white rounded-md">
                  {selectedPlayers[2]?.name?.substring(0, 3) ||
                    "..."}
                </span>
              </div>
              <div className="flex space-x-1 justify-center mt-1">
                <span className="px-2 py-1 bg-blue-500 text-white rounded-md">
                  {selectedPlayers[1]?.name?.substring(0, 3) ||
                    "..."}
                </span>
                <span className="px-1">+</span>
                <span className="px-2 py-1 bg-blue-500 text-white rounded-md">
                  {selectedPlayers[3]?.name?.substring(0, 3) ||
                    "..."}
                </span>
              </div>
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
