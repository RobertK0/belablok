import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import {
  startNewMatch,
  getTotalScore,
} from "../../../services/gameService";
import { cn } from "../../../utils/cn";

interface VictoryDialogProps {
  winningTeam: 1 | 2;
  isOpen: boolean;
  onClose: () => void;
}

export function VictoryDialog({
  winningTeam,
  isOpen,
  onClose,
}: VictoryDialogProps) {
  const { t } = useTranslation(["game", "common"]);
  const navigate = useNavigate();

  // Check if both teams exceeded the target score
  const totalScore = getTotalScore();
  const bothTeamsExceeded =
    totalScore.team1 >= 1001 && totalScore.team2 >= 1001;

  if (!isOpen) return null;

  const handleNewGame = () => {
    // Start a new match with the winning team having a 1-0 advantage
    startNewMatch(winningTeam);
    navigate({ to: "/setup" });
    onClose();
  };

  const handleExit = () => {
    navigate({ to: "/" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-center">
          {bothTeamsExceeded
            ? t("bothTeamsExceeded", {
                team: winningTeam,
                ns: "game",
              })
            : t("teamWon", { team: winningTeam, ns: "game" })}
        </h2>
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleNewGame}
            className={cn(
              "py-2 px-4 rounded font-medium",
              "bg-gradient-to-r from-[#FF8533] to-[#FF6B00] text-white",
              "hover:from-[#E67521] hover:to-[#E56200] transition-colors"
            )}
          >
            {t("newGame", { ns: "game" })}
          </button>
          <button
            onClick={handleExit}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-medium transition-colors"
          >
            {t("exit", { ns: "game" })}
          </button>
        </div>
      </div>
    </div>
  );
}
