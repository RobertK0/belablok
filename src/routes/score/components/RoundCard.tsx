import dayjs from "dayjs";
import type { Round } from "../../../services/gameService";

export function RoundCard({
  round,
  roundNumber,
}: {
  round: Round;
  roundNumber: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white dark:bg-gray-800 p-2 border border-gray-200">
      <div className="flex flex-col gap-1 items-center">
        <span>#{roundNumber}</span>
        <span className="opacity-50 text-xs">
          {dayjs(round.timestamp).format("HH:mm")}
        </span>
      </div>
      <div className="flex gap-2 font-semibold justify-evenly flex-1">
        <div className="text-[#FF8533] flex flex-col items-center">
          <span className="text-xl font-bold">
            {round.team1Score}
          </span>
          <span className="text-xs font-normal">
            ({round.team1RawScore} +{" "}
            {round.team1Score - round.team1RawScore})
          </span>
        </div>
        <div className="text-blue-500 flex flex-col items-center">
          <span className="text-xl font-bold">
            {round.team2Score}
          </span>
          <span className="text-xs font-normal">
            ({round.team2RawScore} +{" "}
            {round.team2Score - round.team2RawScore})
          </span>
        </div>
      </div>
      <img
        className="ml-auto"
        src={`/${round.cardColor}.png`}
        width={32}
        height={32}
      />
    </div>
  );
}
