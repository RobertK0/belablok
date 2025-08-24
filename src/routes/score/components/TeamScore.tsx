import { cn } from "../../../utils/cn";

export function TeamScore({
  totalScore,
  gameScore,
  team,
}: {
  totalScore: number;
  gameScore: number;
  team: "team1" | "team2";
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="opacity-50">{totalScore}</div>
      <div
        className={cn(
          "text-4xl font-bold",
          team === "team1" ? "text-[#FF8533]" : "text-blue-500"
        )}
      >
        {gameScore}
      </div>
      <div>({Math.max(1001 - gameScore, 0)})</div>
    </div>
  );
}
