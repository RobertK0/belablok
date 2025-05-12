import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  checkForWinner,
  getActiveGame,
  getRemainingPoints,
  getTotalScore,
  type Game,
} from "../../services/gameService";
import { cn } from "../../utils/cn";
import { VictoryDialog } from "./components/VictoryDialog";

export function ScoreTotalComponent() {
  const { t } = useTranslation(["game", "common"]);
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [totalScore, setTotalScore] = useState({
    team1: 0,
    team2: 0,
  });
  const [remainingPoints, setRemainingPoints] = useState({
    team1: 1001,
    team2: 1001,
  });
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [loading, setLoading] = useState(true);

  const [victoryDialogOpen, setVictoryDialogOpen] = useState(false);
  useEffect(() => {
    // Load active game data
    const activeGame = getActiveGame();
    setGame(activeGame);

    // Calculate total score
    const score = getTotalScore();
    setTotalScore(score);

    // Calculate remaining points
    const remaining = getRemainingPoints();
    setRemainingPoints(remaining);

    // Check for winner
    const winningTeam = checkForWinner();
    setWinner(winningTeam);

    if (winningTeam) {
      setVictoryDialogOpen(true);
    }

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

  // Calculate percentage of progress toward target
  const team1TargetPercentage = Math.min(
    100,
    (totalScore.team1 / game.targetScore) * 100
  );
  const team2TargetPercentage = Math.min(
    100,
    (totalScore.team2 / game.targetScore) * 100
  );

  // Get the next dealer (player to the right of current dealer)
  const nextDealerIndex = game.currentDealerIndex;
  // const allPlayers = [
  //   game.team1Players[0], // Player at bottom (index 0)
  //   game.team2Players[0], // Player at left (index 1)
  //   game.team1Players[1], // Player at top (index 2)
  //   game.team2Players[1], // Player at right (index 3)
  // ];

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">
          {t("totalScore", { ns: "game" })}
        </h1>

        {/* Score Display */}
        <div className="bg-white shadow rounded-lg p-6 mb-4">
          {/* Target score info */}
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500">
              {t("targetScore", {
                ns: "game",
                defaultValue: "Target Score",
              })}
              : {game.targetScore}
            </div>
          </div>

          {/* Team 1 Score */}
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <div className="flex">
                <div className="font-medium text-[#FF8533]">
                  {t("team1", { ns: "game" })}
                </div>
                <div>({game.matchScore.team1})</div>
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold">
                  {totalScore.team1}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {winner === 1 ? (
                    <span className="text-green-500 ml-1">
                      {t("winner", {
                        ns: "game",
                        defaultValue: "Winner!",
                      })}
                    </span>
                  ) : (
                    remainingPoints.team1 > 0 && (
                      <span>
                        (
                        {t("remaining", {
                          ns: "game",
                          defaultValue: "Need",
                        })}
                        : {remainingPoints.team1})
                      </span>
                    )
                  )}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded">
              <div
                className="h-2 bg-[#FF8533] rounded"
                style={{ width: `${team1TargetPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Team 2 Score */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-1">
              <div className="flex">
                <div className="font-medium text-blue-500">
                  {t("team2", { ns: "game" })}
                </div>
                <div>({game.matchScore.team2})</div>
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold">
                  {totalScore.team2}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {winner === 2 ? (
                    <span className="text-green-500 ml-1">
                      {t("winner", {
                        ns: "game",
                        defaultValue: "Winner!",
                      })}
                    </span>
                  ) : (
                    remainingPoints.team2 > 0 && (
                      <span>
                        (
                        {t("remaining", {
                          ns: "game",
                          defaultValue: "Need",
                        })}
                        : {remainingPoints.team2})
                      </span>
                    )
                  )}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${team2TargetPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Table Layout */}
          <div className="mb-6">
            {/* Top player (index 2) */}
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  "px-4 py-2 max-w-[200px] rounded-lg text-center",
                  "border-2",
                  nextDealerIndex === 2
                    ? "border-[#FF8533] bg-[rgba(255,133,51,0.1)]"
                    : "border-gray-200"
                )}
              >
                <div className="font-medium">
                  {game.team1Players[1]?.name ||
                    t("emptySlot", { ns: "game" })}
                </div>
                {nextDealerIndex === 2 && (
                  <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-[#FF8533] text-white rounded-full">
                    {t("nextDealer", { ns: "game" })}
                  </div>
                )}
                <div className="text-xs text-[#FF8533]">
                  {t("team1", { ns: "game" })}
                </div>
              </div>
            </div>

            {/* Middle row with Left (index 1), Table, and Right (index 3) */}
            <div className="grid grid-cols-3 justify-items-center mb-4">
              {/* Left player (index 1) */}
              <div
                className={cn(
                  "px-4 py-2 max-w-[200px] rounded-lg text-center",
                  "border-2",
                  nextDealerIndex === 1
                    ? "border-blue-500 bg-[rgba(59,130,246,0.1)]"
                    : "border-gray-200"
                )}
              >
                <div className="font-medium">
                  {game.team2Players[0]?.name ||
                    t("emptySlot", { ns: "game" })}
                </div>
                {nextDealerIndex === 1 && (
                  <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white rounded-full">
                    {t("nextDealer", { ns: "game" })}
                  </div>
                )}
                <div className="text-xs text-blue-500">
                  {t("team2", { ns: "game" })}
                </div>
              </div>

              {/* Table */}
              <div className="w-16 h-16 border-2 border-[#FF8533] bg-[rgba(255,133,51,0.1)] rounded">
                <div className="h-full flex items-center justify-center text-xs text-center text-gray-500">
                  {t("gameSetup.table", {
                    ns: "game",
                    defaultValue: "Table",
                  })}
                </div>
              </div>

              {/* Right player (index 3) */}
              <div
                className={cn(
                  "px-4 py-2 max-w-[200px] rounded-lg text-center",
                  "border-2",
                  nextDealerIndex === 3
                    ? "border-blue-500 bg-[rgba(59,130,246,0.1)]"
                    : "border-gray-200"
                )}
              >
                <div className="font-medium">
                  {game.team2Players[1]?.name ||
                    t("emptySlot", { ns: "game" })}
                </div>
                {nextDealerIndex === 3 && (
                  <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white rounded-full">
                    {t("nextDealer", { ns: "game" })}
                  </div>
                )}
                <div className="text-xs text-blue-500">
                  {t("team2", { ns: "game" })}
                </div>
              </div>
            </div>

            {/* Bottom player (index 0) */}
            <div className="flex justify-center">
              <div
                className={cn(
                  "px-4 py-2 max-w-[200px] rounded-lg text-center",
                  "border-2",
                  nextDealerIndex === 0
                    ? "border-[#FF8533] bg-[rgba(255,133,51,0.1)]"
                    : "border-gray-200"
                )}
              >
                <div className="font-medium">
                  {game.team1Players[0]?.name ||
                    t("emptySlot", { ns: "game" })}
                </div>
                {nextDealerIndex === 0 && (
                  <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-[#FF8533] text-white rounded-full">
                    {t("nextDealer", { ns: "game" })}
                  </div>
                )}
                <div className="text-xs text-[#FF8533]">
                  {t("team1", { ns: "game" })}
                </div>
              </div>
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
                            <span className="text-[#FF8533]">
                              {t("team1", { ns: "game" })}
                            </span>
                            : {round.team1Score}
                            {round.team1Score !==
                              round.team1RawScore && (
                              <span className="text-xs ml-1 text-gray-500">
                                ({round.team1RawScore})
                              </span>
                            )}
                          </span>
                          <span className="text-sm">
                            <span className="text-blue-500">
                              {t("team2", { ns: "game" })}
                            </span>
                            : {round.team2Score}
                            {round.team2Score !==
                              round.team2RawScore && (
                              <span className="text-xs ml-1 text-gray-500">
                                ({round.team2RawScore})
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex justify-between">
                          <span>
                            {new Date(
                              round.timestamp
                            ).toLocaleString()}
                          </span>
                          {round.declarationsValue > 0 && (
                            <span className="ml-2">
                              {t("declarationsValue", {
                                ns: "game",
                              })}
                              : {round.declarationsValue}
                            </span>
                          )}
                          {round.higherContract !== null && (
                            <span className="ml-2">
                              {t("higherContract", { ns: "game" })}
                              {round.cardColor && (
                                <span className="ml-1">
                                  (
                                  {t(
                                    `cardColors.${round.cardColor}`,
                                    { ns: "game" }
                                  )}
                                  )
                                </span>
                              )}
                            </span>
                          )}
                        </div>
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
      {winner && (
        <VictoryDialog
          winningTeam={winner}
          isOpen={victoryDialogOpen}
          onClose={() => setVictoryDialogOpen(false)}
        />
      )}
    </>
  );
}
