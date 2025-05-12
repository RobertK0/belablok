import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import {
  getActiveGame,
  getTotalScore,
  getRemainingPoints,
  addRound,
  type Game,
  type CardColor,
  type PlayerDeclaration,
} from "../../services/gameService";
import { cn } from "../../utils/cn";
import { CardColorModal } from "./components/CardColorModal";
import { PlayerDeclarationsModal } from "./components/PlayerDeclarationsModal";
import { type Player } from "../../services/playerService";

export function ScoreRoundComponent() {
  const { t } = useTranslation(["game", "common"]);
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const [activeTeam, setActiveTeam] = useState<1 | 2>(1);
  const [totalScore, setTotalScore] = useState({
    team1: 0,
    team2: 0,
  });
  const [remainingPoints, setRemainingPoints] = useState({
    team1: 1001,
    team2: 1001,
  });
  const [declarationsValue, setDeclarationsValue] =
    useState<number>(0);
  const [higherContract, setHigherContract] = useState<
    number | null
  >(null);
  const [cardColorModalOpen, setCardColorModalOpen] =
    useState(false);
  const [selectedCardColor, setSelectedCardColor] =
    useState<CardColor>(null);
  const [declarationsModalOpen, setDeclarationsModalOpen] =
    useState(false);
  const [
    selectedPlayerForDeclaration,
    setSelectedPlayerForDeclaration,
  ] = useState<Player | null>(null);
  const [
    selectedPlayerIndexForDeclaration,
    setSelectedPlayerIndexForDeclaration,
  ] = useState<number>(-1);
  const [playerDeclarations, setPlayerDeclarations] = useState<
    PlayerDeclaration[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load active game data
    const activeGame = getActiveGame();
    console.log(activeGame);
    setGame(activeGame);

    // Calculate total score
    const score = getTotalScore();
    setTotalScore(score);

    // Calculate remaining points
    const remaining = getRemainingPoints();
    setRemainingPoints(remaining);

    setLoading(false);
  }, []);

  // Calculate the other team's score automatically
  useEffect(() => {
    if (activeTeam === 1 && team1Score) {
      const basePointsTotal = 162; // Base points without declarations
      const team1Points = parseInt(team1Score) || 0;
      // Ensure the opposing team's score doesn't go negative
      const calculatedTeam2Score = Math.max(
        0,
        basePointsTotal - team1Points
      );
      setTeam2Score(calculatedTeam2Score.toString());
    } else if (activeTeam === 2 && team2Score) {
      const basePointsTotal = 162; // Base points without declarations
      const team2Points = parseInt(team2Score) || 0;
      // Ensure the opposing team's score doesn't go negative
      const calculatedTeam1Score = Math.max(
        0,
        basePointsTotal - team2Points
      );
      setTeam1Score(calculatedTeam1Score.toString());
    }
  }, [team1Score, team2Score, activeTeam]);

  const handleNumpadPress = (value: string) => {
    if (activeTeam === 1) {
      // Don't allow score over the total possible (162)
      if (value === "backspace") {
        setTeam1Score((prev) => prev.slice(0, -1));
      } else {
        const newScore = team1Score + value;
        const maxScore = 162;
        if (parseInt(newScore) <= maxScore) {
          setTeam1Score(newScore);
        }
      }
    } else {
      if (value === "backspace") {
        setTeam2Score((prev) => prev.slice(0, -1));
      } else {
        const newScore = team2Score + value;
        const maxScore = 162;
        if (parseInt(newScore) <= maxScore) {
          setTeam2Score(newScore);
        }
      }
    }
  };

  const handleClear = () => {
    if (activeTeam === 1) {
      setTeam1Score("");
      setTeam2Score("");
    } else {
      setTeam2Score("");
      setTeam1Score("");
    }
  };

  // const handleDeclarationChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const value = parseInt(e.target.value) || 0;
  //   setDeclarationsValue(value);
  // };

  const handleHigherContractToggle = (playerIndex: number) => {
    if (higherContract === playerIndex) {
      setHigherContract(null);
      setSelectedCardColor(null);
    } else {
      // Open card color modal when selecting a new player for higher contract
      setHigherContract(playerIndex);
      setCardColorModalOpen(true);
    }
  };

  const handleCardColorSelect = (color: CardColor) => {
    setSelectedCardColor(color);
    setCardColorModalOpen(false);
  };

  const handlePlayerClick = (playerIndex: number) => {
    if (higherContract === null || selectedCardColor === null)
      return;

    // Get player from the game based on index
    let player: Player | null = null;

    if (playerIndex === 0) player = game?.team1Players[0] || null;
    else if (playerIndex === 1)
      player = game?.team2Players[0] || null;
    else if (playerIndex === 2)
      player = game?.team1Players[1] || null;
    else if (playerIndex === 3)
      player = game?.team2Players[1] || null;

    if (!player) return;

    setSelectedPlayerForDeclaration(player);
    setSelectedPlayerIndexForDeclaration(playerIndex);
    setDeclarationsModalOpen(true);
  };

  const handleAddDeclaration = (declaration: PlayerDeclaration) => {
    // Remove any existing declaration for this player index
    const filteredDeclarations = playerDeclarations.filter(
      (d) => d.playerIndex !== declaration.playerIndex
    );

    // Add the new declaration
    const newDeclarations = [...filteredDeclarations, declaration];
    setPlayerDeclarations(newDeclarations);

    // Update the total declarations value
    const total = newDeclarations.reduce(
      (sum, decl) => sum + decl.total,
      0
    );
    setDeclarationsValue(total);
  };

  const handleSubmit = () => {
    const score1 = parseInt(team1Score) || 0;
    const score2 = parseInt(team2Score) || 0;

    // Validate that base scores don't exceed 162 total
    if (score1 + score2 > 162) {
      alert(t("scoreTooHigh", { ns: "game" }));
      return;
    }

    // Check if higher contract was called and the team failed (got half or less of total points)
    let finalScore1 = score1;
    let finalScore2 = score2;

    // Add declarations to the appropriate team(s)
    playerDeclarations.forEach((declaration) => {
      // Team 1 players are at index 0 and 2
      if (
        declaration.playerIndex === 0 ||
        declaration.playerIndex === 2
      ) {
        finalScore1 += declaration.total;
      }
      // Team 2 players are at index 1 and 3
      else if (
        declaration.playerIndex === 1 ||
        declaration.playerIndex === 3
      ) {
        finalScore2 += declaration.total;
      }
    });

    if (higherContract !== null) {
      // Determine which team called the higher contract
      const isTeam1Contract =
        higherContract === 0 || higherContract === 2;
      const isTeam2Contract =
        higherContract === 1 || higherContract === 3;

      const totalPointsInRound =
        score1 + score2 + declarationsValue;
      const halfPoints = totalPointsInRound / 2;

      // If team with contract got half or less points, they get 0
      if (isTeam1Contract && finalScore1 <= halfPoints) {
        finalScore1 = 0;
      } else if (isTeam2Contract && finalScore2 <= halfPoints) {
        finalScore2 = 0;
      }
    }

    // Add the round with potentially adjusted scores and metadata
    addRound(
      finalScore1,
      finalScore2,
      declarationsValue,
      higherContract,
      score1, // original raw score for team1
      score2, // original raw score for team2
      selectedCardColor,
      playerDeclarations
    );

    // Navigate back to total score
    navigate({ to: ".." });
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

  // Calculate what the new totals would be after this round
  let effectiveTeam1Score = parseInt(team1Score) || 0;
  let effectiveTeam2Score = parseInt(team2Score) || 0;

  // Add declarations to the displayed scores
  let team1DeclarationsTotal = 0;
  let team2DeclarationsTotal = 0;

  playerDeclarations.forEach((declaration) => {
    if (
      declaration.playerIndex === 0 ||
      declaration.playerIndex === 2
    ) {
      team1DeclarationsTotal += declaration.total;
      effectiveTeam1Score += declaration.total;
    } else if (
      declaration.playerIndex === 1 ||
      declaration.playerIndex === 3
    ) {
      team2DeclarationsTotal += declaration.total;
      effectiveTeam2Score += declaration.total;
    }
  });

  // Apply higher contract rule for display purposes
  if (higherContract !== null) {
    const isTeam1Contract =
      higherContract === 0 || higherContract === 2;
    const isTeam2Contract =
      higherContract === 1 || higherContract === 3;

    const totalPointsInRound =
      effectiveTeam1Score + effectiveTeam2Score;
    const halfPoints = totalPointsInRound / 2;

    if (isTeam1Contract && effectiveTeam1Score <= halfPoints) {
      effectiveTeam1Score = 0;
    } else if (
      isTeam2Contract &&
      effectiveTeam2Score <= halfPoints
    ) {
      effectiveTeam2Score = 0;
    }
  }

  const newTotal1 = totalScore.team1 + effectiveTeam1Score;
  const newTotal2 = totalScore.team2 + effectiveTeam2Score;
  console.log(newTotal1, newTotal2);
  // Calculate what the new remaining points would be
  const newRemaining1 = Math.max(0, game.targetScore - newTotal1);
  const newRemaining2 = Math.max(0, game.targetScore - newTotal2);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {t("addRound", { ns: "game" })}
      </h1>

      {/* Modals */}
      <CardColorModal
        isOpen={cardColorModalOpen}
        onClose={() => setCardColorModalOpen(false)}
        onSelectColor={handleCardColorSelect}
        selectedColor={selectedCardColor}
      />

      <PlayerDeclarationsModal
        isOpen={declarationsModalOpen}
        onClose={() => setDeclarationsModalOpen(false)}
        player={selectedPlayerForDeclaration}
        playerIndex={selectedPlayerIndexForDeclaration}
        onAddDeclaration={handleAddDeclaration}
        existingDeclarations={playerDeclarations}
      />

      {/* Target Score Info */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              {t("remainingAfterRound", {
                ns: "game",
                defaultValue: "Remaining After Round",
              })}
            </p>
            <div className="flex space-x-4">
              <div>
                <span className="text-[#FF8533] font-medium">
                  {t("team1", { ns: "game" })}:{" "}
                </span>
                <span>{newRemaining1}</span>
              </div>
              <div>
                <span className="text-blue-500 font-medium">
                  {t("team2", { ns: "game" })}:{" "}
                </span>
                <span>{newRemaining2}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Declarations Value */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="mb-2">
          <p className="text-sm text-gray-500 mt-1">
            {t("totalPointsInRound", {
              ns: "game",
              defaultValue: "Total Points in Round",
            })}
            : {162 + declarationsValue}
          </p>
        </div>
      </div>

      {/* Table Layout with Higher Contract Selection */}
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        {/* Top player (index 2) */}
        <div className="flex justify-center mb-4">
          <div
            className={cn(
              "px-4 py-2 w-full max-w-[200px] rounded-lg text-center",
              "border-2",
              game.currentDealerIndex === 2
                ? "border-[#FF8533] bg-[rgba(255,133,51,0.1)]"
                : higherContract === 2
                ? "border-green-500 bg-[rgba(34,197,94,0.1)]"
                : "border-gray-200",
              higherContract !== null && selectedCardColor !== null
                ? "cursor-pointer hover:border-blue-300"
                : "cursor-pointer"
            )}
            onClick={
              higherContract !== null && selectedCardColor !== null
                ? () => handlePlayerClick(2)
                : () => handleHigherContractToggle(2)
            }
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
            {higherContract === 2 && selectedCardColor && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-green-500 text-white rounded-full">
                {t(`cardColors.${selectedCardColor}`, {
                  ns: "game",
                  defaultValue: t("higherContract", { ns: "game" }),
                })}
              </div>
            )}
            {higherContract === 2 && !selectedCardColor && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-green-500 text-white rounded-full">
                {t("higherContract", { ns: "game" })}
              </div>
            )}
            {/* Show declaration badge if there are declarations */}
            {playerDeclarations.some(
              (d) => d.playerIndex === 2
            ) && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white rounded-full ml-1">
                +
                {playerDeclarations.find((d) => d.playerIndex === 2)
                  ?.total || 0}
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
                : higherContract === 1
                ? "border-green-500 bg-[rgba(34,197,94,0.1)]"
                : "border-gray-200",
              higherContract !== null && selectedCardColor !== null
                ? "cursor-pointer hover:border-blue-300"
                : "cursor-pointer"
            )}
            onClick={
              higherContract !== null && selectedCardColor !== null
                ? () => handlePlayerClick(1)
                : () => handleHigherContractToggle(1)
            }
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
            {higherContract === 1 && selectedCardColor && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-green-500 text-white rounded-full">
                {t(`cardColors.${selectedCardColor}`, {
                  ns: "game",
                  defaultValue: t("higherContract", { ns: "game" }),
                })}
              </div>
            )}
            {higherContract === 1 && !selectedCardColor && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-green-500 text-white rounded-full">
                {t("higherContract", { ns: "game" })}
              </div>
            )}
            {/* Show declaration badge if there are declarations */}
            {playerDeclarations.some(
              (d) => d.playerIndex === 1
            ) && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white rounded-full ml-1">
                +
                {playerDeclarations.find((d) => d.playerIndex === 1)
                  ?.total || 0}
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
                : higherContract === 3
                ? "border-green-500 bg-[rgba(34,197,94,0.1)]"
                : "border-gray-200",
              higherContract !== null && selectedCardColor !== null
                ? "cursor-pointer hover:border-blue-300"
                : "cursor-pointer"
            )}
            onClick={
              higherContract !== null && selectedCardColor !== null
                ? () => handlePlayerClick(3)
                : () => handleHigherContractToggle(3)
            }
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
            {higherContract === 3 && selectedCardColor && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-green-500 text-white rounded-full">
                {t(`cardColors.${selectedCardColor}`, {
                  ns: "game",
                  defaultValue: t("higherContract", { ns: "game" }),
                })}
              </div>
            )}
            {higherContract === 3 && !selectedCardColor && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-green-500 text-white rounded-full">
                {t("higherContract", { ns: "game" })}
              </div>
            )}
            {/* Show declaration badge if there are declarations */}
            {playerDeclarations.some(
              (d) => d.playerIndex === 3
            ) && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white rounded-full ml-1">
                +
                {playerDeclarations.find((d) => d.playerIndex === 3)
                  ?.total || 0}
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
                : higherContract === 0
                ? "border-green-500 bg-[rgba(34,197,94,0.1)]"
                : "border-gray-200",
              higherContract !== null && selectedCardColor !== null
                ? "cursor-pointer hover:border-blue-300"
                : "cursor-pointer"
            )}
            onClick={
              higherContract !== null && selectedCardColor !== null
                ? () => handlePlayerClick(0)
                : () => handleHigherContractToggle(0)
            }
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
            {higherContract === 0 && selectedCardColor && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-green-500 text-white rounded-full">
                {t(`cardColors.${selectedCardColor}`, {
                  ns: "game",
                  defaultValue: t("higherContract", { ns: "game" }),
                })}
              </div>
            )}
            {higherContract === 0 && !selectedCardColor && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-green-500 text-white rounded-full">
                {t("higherContract", { ns: "game" })}
              </div>
            )}
            {/* Show declaration badge if there are declarations */}
            {playerDeclarations.some(
              (d) => d.playerIndex === 0
            ) && (
              <div className="text-xs inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white rounded-full ml-1">
                +
                {playerDeclarations.find((d) => d.playerIndex === 0)
                  ?.total || 0}
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

        {/* Current Total Scores */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="text-center">
            <span className="text-[#FF8533]">
              {t("team1", { ns: "game" })}
            </span>
            :
            <span className="font-medium ml-1">
              {totalScore.team1}
            </span>
            <div className="text-xs text-gray-500">
              {t("remaining", { ns: "game", defaultValue: "Need" })}
              : {remainingPoints.team1}
            </div>
          </div>
          <div className="text-center">
            <span className="text-blue-500">
              {t("team2", { ns: "game" })}
            </span>
            :
            <span className="font-medium ml-1">
              {totalScore.team2}
            </span>
            <div className="text-xs text-gray-500">
              {t("remaining", { ns: "game", defaultValue: "Need" })}
              : {remainingPoints.team2}
            </div>
          </div>
        </div>

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
                  : "border-gray-300",
                higherContract === 0 || higherContract === 2
                  ? effectiveTeam1Score === 0
                    ? "line-through text-red-500"
                    : ""
                  : ""
              )}
              onClick={() => setActiveTeam(1)}
            >
              {team1Score || "0"}
              {team1DeclarationsTotal > 0 && (
                <span className="text-sm ml-2 text-blue-500">
                  +{team1DeclarationsTotal}
                </span>
              )}
              {(higherContract === 0 || higherContract === 2) &&
                parseInt(team1Score || "0") +
                  team1DeclarationsTotal <=
                  (parseInt(team1Score || "0") +
                    parseInt(team2Score || "0") +
                    team1DeclarationsTotal +
                    team2DeclarationsTotal) /
                    2 && (
                  <span className="text-xs ml-2 text-red-500 block">
                    {t("contractFailed", {
                      ns: "game",
                      defaultValue: "Contract Failed",
                    })}
                  </span>
                )}
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
                  : "border-gray-300",
                higherContract === 1 || higherContract === 3
                  ? effectiveTeam2Score === 0
                    ? "line-through text-red-500"
                    : ""
                  : ""
              )}
              onClick={() => setActiveTeam(2)}
            >
              {team2Score || "0"}
              {team2DeclarationsTotal > 0 && (
                <span className="text-sm ml-2 text-blue-500">
                  +{team2DeclarationsTotal}
                </span>
              )}
              {(higherContract === 1 || higherContract === 3) &&
                parseInt(team2Score || "0") +
                  team2DeclarationsTotal <=
                  (parseInt(team1Score || "0") +
                    parseInt(team2Score || "0") +
                    team1DeclarationsTotal +
                    team2DeclarationsTotal) /
                    2 && (
                  <span className="text-xs ml-2 text-red-500 block">
                    {t("contractFailed", {
                      ns: "game",
                      defaultValue: "Contract Failed",
                    })}
                  </span>
                )}
            </div>
          </div>
        </div>

        {/* Higher Contract Explanation */}
        {higherContract !== null && (
          <div className="mb-4 p-2 bg-gray-100 rounded-md text-sm text-gray-700">
            <p>
              {t("higherContractExplanation", {
                ns: "game",
                defaultValue:
                  "If team fails to score more than half of the total points, their score will be 0 for this round.",
              })}
            </p>
          </div>
        )}

        {/* Declarations Summary */}
        {playerDeclarations.length > 0 && (
          <div className="mb-4 p-2 bg-blue-50 rounded-md text-sm text-gray-700">
            <div className="font-medium mb-1">
              {t("declarationsValue", { ns: "game" })}:{" "}
              {declarationsValue}
              {team1DeclarationsTotal > 0 &&
                team2DeclarationsTotal > 0 && (
                  <span className="text-xs ml-2">
                    ({t("team1", { ns: "game" })}:{" "}
                    {team1DeclarationsTotal},{" "}
                    {t("team2", { ns: "game" })}:{" "}
                    {team2DeclarationsTotal})
                  </span>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
              {playerDeclarations.map((declaration, index) => {
                // Find the player name
                let playerName = "";
                if (declaration.playerIndex === 0)
                  playerName = game?.team1Players[0]?.name || "";
                else if (declaration.playerIndex === 1)
                  playerName = game?.team2Players[0]?.name || "";
                else if (declaration.playerIndex === 2)
                  playerName = game?.team1Players[1]?.name || "";
                else if (declaration.playerIndex === 3)
                  playerName = game?.team2Players[1]?.name || "";

                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg px-2 py-1 border border-gray-200 flex items-center"
                  >
                    <span className="font-medium text-xs">
                      {playerName}:{" "}
                    </span>
                    <span className="text-blue-500 text-xs ml-1">
                      +{declaration.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
