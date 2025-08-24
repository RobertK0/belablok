import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlayerMiniCard } from "../../components/shared/PlayerMiniCard";
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
import { PlayerSelector } from "./components/PlayerSelector";

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
  const [showSelector, setShowSelector] = useState<number | null>(
    null
  );
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
    index: number | null,
    player: Player | null
  ) => {
    if (index === null) return;
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

  // Get all players including newly added ones
  const getAllPlayers = () => {
    return getStoredPlayers();
  };

  // Filter out players that are already selected, except for the one in the current seat
  const getAvailablePlayersForSeat = (seatIndex: number | null) => {
    if (seatIndex === null) return [];
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

  console.log(game);

  return (
    <div>
      <PlayerSelector
        open={showSelector !== null}
        availablePlayers={getAvailablePlayersForSeat(showSelector)}
        onSelectPlayer={(selectedPlayer) => {
          handleSelectPlayer(showSelector, selectedPlayer);
          setShowSelector(null);
        }}
        onClose={() => setShowSelector(null)}
      />
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
              {t("selectDealerFromWinningTeam", { ns: "game" })}
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
              <PlayerMiniCard
                isDealer={dealerIndex === 2}
                playerName={selectedPlayers[2]?.name}
                team="team1"
                isSetup
                onChangePlayer={() => setShowSelector(2)}
                onSetDealer={
                  game?.previousWinner !== 2
                    ? () => handleSetDealer(2)
                    : undefined
                }
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <PlayerMiniCard
              isDealer={dealerIndex === 1}
              playerName={selectedPlayers[1]?.name}
              team="team2"
              isSetup
              onChangePlayer={() => setShowSelector(1)}
              onSetDealer={
                game?.previousWinner !== 1
                  ? () => handleSetDealer(1)
                  : undefined
              }
              onClickCard={() => {}}
            />

            <div className="w-16 h-16 border-2 border-[#FF8533] bg-[rgba(255,133,51,0.1)] rounded">
              <div className="h-full flex items-center justify-center text-xs text-center text-gray-500">
                {t("gameSetup.table", {
                  ns: "game",
                  defaultValue: "Table",
                })}
              </div>
            </div>

            <div className="max-w-[300px]">
              <PlayerMiniCard
                isDealer={dealerIndex === 3}
                playerName={selectedPlayers[3]?.name}
                team="team2"
                isSetup
                onChangePlayer={() => setShowSelector(3)}
                onSetDealer={
                  game?.previousWinner !== 1
                    ? () => handleSetDealer(3)
                    : undefined
                }
              />
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="max-w-[300px]">
              <PlayerMiniCard
                isDealer={dealerIndex === 0}
                playerName={selectedPlayers[0]?.name}
                team="team1"
                isSetup
                onChangePlayer={() => setShowSelector(0)}
                onSetDealer={
                  game?.previousWinner !== 2
                    ? () => handleSetDealer(0)
                    : undefined
                }
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <div className="text-center text-sm text-gray-500">
              <div className="flex space-x-1 justify-center">
                <span>Mi:</span>
                <span className="px-2 py-1 bg-[#FF8533] text-white rounded-md">
                  {selectedPlayers[0]?.name || "..."}
                </span>
                <span className="px-2 py-1 bg-[#FF8533] text-white rounded-md">
                  {selectedPlayers[2]?.name || "..."}
                </span>
              </div>
              <div className="flex space-x-1 justify-center mt-1">
                <span>Vi:</span>
                <span className="px-2 py-1 bg-blue-500 text-white rounded-md">
                  {selectedPlayers[1]?.name || "..."}
                </span>
                <span className="px-2 py-1 bg-blue-500 text-white rounded-md">
                  {selectedPlayers[3]?.name || "..."}
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
