import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import {
  getActiveGame,
  addRound,
  type Game,
} from "../../services/gameService";
import { cn } from "../../utils/cn";

export function ScoreRoundComponent() {
  const { t } = useTranslation(["game", "common"]);
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const [activeTeam, setActiveTeam] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load active game data
    const activeGame = getActiveGame();
    setGame(activeGame);
    setLoading(false);
  }, []);

  const handleNumpadPress = (value: string) => {
    if (activeTeam === 1) {
      // Don't allow score over 162 (maximum in Belot)
      if (value === "backspace") {
        setTeam1Score((prev) => prev.slice(0, -1));
      } else {
        const newScore = team1Score + value;
        if (parseInt(newScore) <= 162) {
          setTeam1Score(newScore);
        }
      }
    } else {
      if (value === "backspace") {
        setTeam2Score((prev) => prev.slice(0, -1));
      } else {
        const newScore = team2Score + value;
        if (parseInt(newScore) <= 162) {
          setTeam2Score(newScore);
        }
      }
    }
  };

  const handleClear = () => {
    if (activeTeam === 1) {
      setTeam1Score("");
    } else {
      setTeam2Score("");
    }
  };

  const handleSubmit = () => {
    const score1 = parseInt(team1Score) || 0;
    const score2 = parseInt(team2Score) || 0;

    if (score1 + score2 > 162) {
      alert(t("scoreTooHigh", { ns: "game" }));
      return;
    }

    // Add the round
    addRound(score1, score2);

    // Navigate back to total score
    navigate({ to: ".." });
  };

  // Get the current dealer name
  const getCurrentDealerName = () => {
    if (!game || game.currentDealerIndex === null) return "";

    const allPlayers = [...game.team1Players, ...game.team2Players];

    const currentDealer = allPlayers[game.currentDealerIndex];
    return currentDealer?.name || "";
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {t("addRound", { ns: "game" })}
      </h1>

      {/* Table Layout */}
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        {/* Top player (index 2) */}
        <div className="flex justify-center mb-4">
          <div
            className={cn(
              "px-4 py-2 w-full max-w-[200px] rounded-lg text-center",
              "border-2",
              game.currentDealerIndex === 2
                ? "border-[#FF8533] bg-[rgba(255,133,51,0.1)]"
                : "border-gray-200"
            )}
          >
            <div className="font-medium">
              {game.team1Players[1]?.name ||
                t("emptySlot", { ns: "game" })}
            </div>
            {game.currentDealerIndex === 2 && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-[#FF8533] text-white rounded-full">
                {t("currentDealer", { ns: "game" })}
              </div>
            )}
            <div className="text-xs text-[#FF8533]">
              {t("team1", { ns: "game" })}
            </div>
          </div>
        </div>

        {/* Middle row with Left (index 1), Table, and Right (index 3) */}
        <div className="flex justify-between items-center mb-4">
          {/* Left player (index 1) */}
          <div
            className={cn(
              "px-4 py-2 w-full max-w-[200px] rounded-lg text-center",
              "border-2",
              game.currentDealerIndex === 1
                ? "border-blue-500 bg-[rgba(59,130,246,0.1)]"
                : "border-gray-200"
            )}
          >
            <div className="font-medium">
              {game.team2Players[0]?.name ||
                t("emptySlot", { ns: "game" })}
            </div>
            {game.currentDealerIndex === 1 && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white rounded-full">
                {t("currentDealer", { ns: "game" })}
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
              "px-4 py-2 w-full max-w-[200px] rounded-lg text-center",
              "border-2",
              game.currentDealerIndex === 3
                ? "border-blue-500 bg-[rgba(59,130,246,0.1)]"
                : "border-gray-200"
            )}
          >
            <div className="font-medium">
              {game.team2Players[1]?.name ||
                t("emptySlot", { ns: "game" })}
            </div>
            {game.currentDealerIndex === 3 && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white rounded-full">
                {t("currentDealer", { ns: "game" })}
              </div>
            )}
            <div className="text-xs text-blue-500">
              {t("team2", { ns: "game" })}
            </div>
          </div>
        </div>

        {/* Bottom player (index 0) */}
        <div className="flex justify-center mb-2">
          <div
            className={cn(
              "px-4 py-2 w-full max-w-[200px] rounded-lg text-center",
              "border-2",
              game.currentDealerIndex === 0
                ? "border-[#FF8533] bg-[rgba(255,133,51,0.1)]"
                : "border-gray-200"
            )}
          >
            <div className="font-medium">
              {game.team1Players[0]?.name ||
                t("emptySlot", { ns: "game" })}
            </div>
            {game.currentDealerIndex === 0 && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-[#FF8533] text-white rounded-full">
                {t("currentDealer", { ns: "game" })}
              </div>
            )}
            <div className="text-xs text-[#FF8533]">
              {t("team1", { ns: "game" })}
            </div>
          </div>
        </div>
      </div>

      {/* Score Input */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">
          {t("enterScore", { ns: "game" })}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-1",
                activeTeam === 1
                  ? "text-[#FF8533]"
                  : "text-gray-700"
              )}
            >
              <span className="text-[#FF8533]">
                {t("team1", { ns: "game" })}
              </span>
            </label>
            <div
              className={cn(
                "w-full border rounded-lg px-4 py-3 text-xl font-bold text-center cursor-pointer",
                activeTeam === 1
                  ? "border-[#FF8533] bg-[rgba(255,133,51,0.05)]"
                  : "border-gray-300"
              )}
              onClick={() => setActiveTeam(1)}
            >
              {team1Score || "0"}
            </div>
          </div>
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-1",
                activeTeam === 2 ? "text-blue-500" : "text-gray-700"
              )}
            >
              <span className="text-blue-500">
                {t("team2", { ns: "game" })}
              </span>
            </label>
            <div
              className={cn(
                "w-full border rounded-lg px-4 py-3 text-xl font-bold text-center cursor-pointer",
                activeTeam === 2
                  ? "border-blue-500 bg-[rgba(59,130,246,0.05)]"
                  : "border-gray-300"
              )}
              onClick={() => setActiveTeam(2)}
            >
              {team2Score || "0"}
            </div>
          </div>
        </div>

        {/* Custom Numpad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className={cn(
                "py-4 text-xl font-semibold rounded-md",
                "bg-gray-100 hover:bg-gray-200 transition-colors"
              )}
              onClick={() => handleNumpadPress(num.toString())}
            >
              {num}
            </button>
          ))}
          <button
            className={cn(
              "py-4 text-xl font-semibold rounded-md",
              "bg-gray-100 hover:bg-gray-200 transition-colors"
            )}
            onClick={handleClear}
          >
            {t("clear", { ns: "common" })}
          </button>
          <button
            className={cn(
              "py-4 text-xl font-semibold rounded-md",
              "bg-gray-100 hover:bg-gray-200 transition-colors"
            )}
            onClick={() => handleNumpadPress("0")}
          >
            0
          </button>
          <button
            className={cn(
              "py-4 text-xl font-semibold rounded-md",
              "bg-gray-100 hover:bg-gray-200 transition-colors"
            )}
            onClick={() => handleNumpadPress("backspace")}
          >
            ←
          </button>
        </div>

        {/* Quick Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[10, 20, 50, 100].map((value) => (
            <button
              key={value}
              className={cn(
                "py-2 rounded-md text-sm font-medium",
                "bg-gray-200 hover:bg-gray-300 transition-colors"
              )}
              onClick={() => {
                if (activeTeam === 1) {
                  setTeam1Score(value.toString());
                } else {
                  setTeam2Score(value.toString());
                }
              }}
            >
              +{value}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            className={cn(
              "px-6 py-2 border border-gray-300 rounded-md",
              "hover:bg-gray-50 transition-colors"
            )}
            onClick={() => navigate({ to: ".." })}
          >
            {t("actions.cancel", { ns: "common" })}
          </button>
          <button
            className={cn(
              "px-6 py-2 rounded-md font-semibold",
              "bg-gradient-to-r from-[#FF8533] to-[#FF6B00] text-white",
              "hover:from-[#E67521] hover:to-[#E56200] transition-colors"
            )}
            onClick={handleSubmit}
          >
            {t("saveRound", { ns: "game" })}
          </button>
        </div>
      </div>
    </div>
  );
}
