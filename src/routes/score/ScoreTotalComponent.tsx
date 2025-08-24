import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  checkForWinner,
  getActiveGame,
  getTotalScore,
  type Game,
} from "../../services/gameService";
import { cn } from "../../utils/cn";
import { VictoryDialog } from "./components/VictoryDialog";

import { PlayerMiniCard } from "../../components/shared/PlayerMiniCard";
import { RoundCard } from "./components/RoundCard";
import { TeamScore } from "./components/TeamScore";

export function ScoreTotalComponent() {
  const { t } = useTranslation(["game", "common"]);
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [totalScore, setTotalScore] = useState({
    team1: 0,
    team2: 0,
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
        {/* <h1 className="text-2xl font-bold mb-4">
          {t("totalScore", { ns: "game" })}
        </h1> */}

        {/* Score Display */}
        <div className="bg-white shadow rounded-lg p-6 mb-4">
          {/* Target score info */}
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500">
              {game.targetScore}
            </div>
          </div>
          <div className="flex justify-around">
            {/* Team 1 Score */}
            <TeamScore
              gameScore={totalScore.team1}
              totalScore={game.matchScore.team1}
              team="team1"
            />

            {/* Team 2 Score */}
            <TeamScore
              gameScore={totalScore.team2}
              totalScore={game.matchScore.team2}
              team="team2"
            />
          </div>

          {/* Table Layout */}
          <div className="mb-6">
            {/* Top player (index 2) */}
            <div className="flex justify-center mb-4">
              <PlayerMiniCard
                isDealer={nextDealerIndex === 2}
                playerName={game.team1Players[1]?.name}
                team="team1"
              />
            </div>

            {/* Middle row with Left (index 1), Table, and Right (index 3) */}
            <div className="grid grid-cols-3 justify-items-center mb-4 items-center">
              {/* Left player (index 1) */}
              <PlayerMiniCard
                isDealer={nextDealerIndex === 1}
                playerName={game.team2Players[0]?.name}
                team="team2"
              />

              {/* Table */}
              <div className="w-16 h-16 border-2 border-[#FF8533] bg-[rgba(255,133,51,0.1)] rounded"></div>

              {/* Right player (index 3) */}
              <PlayerMiniCard
                isDealer={nextDealerIndex === 3}
                playerName={game.team2Players[1]?.name}
                team="team2"
              />
            </div>

            {/* Bottom player (index 0) */}
            <div className="flex justify-center">
              <PlayerMiniCard
                isDealer={nextDealerIndex === 0}
                playerName={game.team1Players[0]?.name}
                team="team1"
              />
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
            <div className="space-y-3">
              {game.rounds
                .map((round, index) => (
                  <RoundCard
                    key={round.id}
                    round={round}
                    roundNumber={index + 1}
                  />
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
