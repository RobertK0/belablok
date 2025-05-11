import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import {
  getActiveGame,
  getTotalScore,
  type Game,
  type Round,
} from "../../services/gameService";
import { cn } from "../../utils/cn";
import { scoreRoundRoute } from "./Score.route";

export function ScoreTotalComponent() {
  const { t } = useTranslation(["game", "common"]);
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [totalScore, setTotalScore] = useState({
    team1: 0,
    team2: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load active game data
    const activeGame = getActiveGame();
    setGame(activeGame);

    // Calculate total score
    const score = getTotalScore();
    setTotalScore(score);

    setLoading(false);
  }, []);

  const handleNewRound = () => {
    navigate({ to: "/score/round" });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          {t("noActiveGame", { ns: "game" })}
        </p>
        <button
          className={cn(
            "px-6 py-2 rounded-md font-medium",
            "bg-[#FF8533] text-white hover:bg-[#E67521] transition-colors"
          )}
          onClick={() => navigate({ to: "/setup" })}
        >
          {t("startNewGame", { ns: "game" })}
        </button>
      </div>
    );
  }

  // Calculate percentage for the progress bar
  const totalPoints = totalScore.team1 + totalScore.team2;
  const team1Percentage =
    totalPoints === 0 ? 50 : (totalScore.team1 / totalPoints) * 100;

  // Get the next dealer (player to the right of current dealer)
  const nextDealerIndex = game.currentDealerIndex;
  const allPlayers = [...game.team1Players, ...game.team2Players];
  const nextDealer = allPlayers[nextDealerIndex];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {t("totalScore", { ns: "game" })}
      </h1>

      {/* Score Display */}
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">
            {t("team1", { ns: "game" })}:{" "}
            <span className="text-[#FF8533]">
              {totalScore.team1}
            </span>
          </div>
          <div className="text-lg font-semibold">
            {t("team2", { ns: "game" })}:{" "}
            <span className="text-[#FF8533]">
              {totalScore.team2}
            </span>
          </div>
        </div>

        <div className="h-2 w-full bg-gray-200 rounded mb-4">
          <div
            className="h-2 bg-[#FF8533] rounded"
            style={{ width: `${team1Percentage}%` }}
          ></div>
        </div>

        {/* Team Players */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <h3 className="font-medium text-[#FF8533] mb-1">
              {t("team1", { ns: "game" })}
            </h3>
            <ul className="space-y-1">
              {game.team1Players.map((player, index) => (
                <li key={index} className="flex items-center">
                  <span>
                    {player?.name || t("emptySlot", { ns: "game" })}
                  </span>
                  {nextDealerIndex === (index === 0 ? 0 : 2) && (
                    <span className="ml-2 px-2 py-0.5 bg-[#FF8533] text-white text-xs rounded-full">
                      {t("nextDealer", { ns: "game" })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-[#FF8533] mb-1">
              {t("team2", { ns: "game" })}
            </h3>
            <ul className="space-y-1">
              {game.team2Players.map((player, index) => (
                <li key={index} className="flex items-center">
                  <span>
                    {player?.name || t("emptySlot", { ns: "game" })}
                  </span>
                  {nextDealerIndex === (index === 0 ? 1 : 3) && (
                    <span className="ml-2 px-2 py-0.5 bg-[#FF8533] text-white text-xs rounded-full">
                      {t("nextDealer", { ns: "game" })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* New Round Button */}
        <button
          className={cn(
            "w-full bg-gradient-to-r from-[#FF8533] to-[#FF6B00] text-white",
            "px-4 py-3 rounded-md font-semibold hover:from-[#E67521] hover:to-[#E56200]",
            "transition-colors"
          )}
          onClick={handleNewRound}
        >
          {t("newRound", { ns: "game" })}
        </button>
      </div>

      {/* Rounds History */}
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3">
          {t("rounds", { ns: "game" })}
        </h2>

        {game.rounds.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {game.rounds
              .map((round, index) => (
                <div
                  key={round.id}
                  className={cn(
                    "border border-gray-200 rounded-md p-3",
                    "flex justify-between items-center"
                  )}
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-2">
                      #{game.rounds.length - index}
                    </span>
                    <div>
                      <div className="flex space-x-2">
                        <span className="text-sm">
                          {t("team1", { ns: "game" })}:{" "}
                          {round.team1Score}
                        </span>
                        <span className="text-sm">
                          {t("team2", { ns: "game" })}:{" "}
                          {round.team2Score}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(round.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
              .reverse()}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic text-center py-4">
            {t("noRoundsYet", { ns: "game" })}
          </p>
        )}
      </div>
    </div>
  );
}
