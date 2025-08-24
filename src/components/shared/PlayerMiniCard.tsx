import { t } from "i18next";
import { ChangePersonIcon } from "../../icons/ChangePersonIcon";
import { PersonIcon } from "../../icons/PersonIcon";
import type { CardColor } from "../../services/gameService";
import { cn } from "../../utils/cn";

export function PlayerMiniCard({
  isDealer,
  playerName,
  team,
  isSetup = false,
  onChangePlayer,
  onSetDealer,
  declarationColor,
  declarationValues,
  onClickCard,
}: {
  isDealer: boolean;
  playerName: string | undefined;
  team: "team1" | "team2";
  isSetup?: boolean;
  onChangePlayer?: () => void;
  onSetDealer?: () => void;
  declarationColor?: CardColor | false;
  declarationValues?: Array<number>;
  onClickCard?: () => void;
}) {
  return (
    <div
      onClick={onClickCard}
      className={cn(
        "px-4 py-2 max-w-[200px] rounded-lg text-center relative cursor-pointer",
        "border-2",
        isDealer
          ? team === "team1"
            ? "border-[#FF8533] bg-[rgba(255,133,51,0.1)]"
            : "border-blue-500 bg-[rgba(59,130,246,0.1)]"
          : "border-gray-200"
      )}
    >
      {declarationValues && (
        <div className="absolute -bottom-3.5 -right-6 flex flex-col gap-[2px]">
          {declarationValues.map((value, index) => (
            <div
              className="text-xs inline-block mt-1 px-2 py-0.5 bg-gray-400 text-white rounded-full"
              key={`declaration-${index}`}
            >
              +{value}
            </div>
          ))}
        </div>
      )}
      {declarationColor && (
        <div className="rounded-full w-7 h-7 p-1 absolute -top-3.5 -right-3.5 bg-gray-400">
          <img src={`/${declarationColor}.png`} />
        </div>
      )}
      {isSetup && (
        <ChangePersonIcon
          onClick={onChangePlayer}
          className="absolute -top-3.5 -right-3.5 text-white bg-gray-600 rounded-full w-7 h-7 p-1 cursor-pointer hover:bg-gray-800 transition-colors"
        />
      )}
      <div
        className={cn(
          "text-xs flex items-center justify-center",
          team === "team1" ? "text-[#FF8533]" : "text-blue-500"
        )}
      >
        <PersonIcon />
      </div>
      <div className="font-medium">
        {playerName || t("emptySlot", { ns: "game" })}
      </div>
      {isSetup && onSetDealer && !isDealer && (
        <button
          onClick={onSetDealer}
          className="text-xs text-gray-500"
        >
          Set as dealer
        </button>
      )}
      {isDealer && (
        <div
          className={cn(
            "text-xs inline-block mt-1 px-2 py-0.5 text-white rounded-full",
            team === "team1" ? "bg-[#FF8533]" : "bg-blue-500"
          )}
        >
          {t("nextDealer", { ns: "game" })}
        </div>
      )}
    </div>
  );
}
