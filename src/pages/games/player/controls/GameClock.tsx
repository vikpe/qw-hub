import { formatDuration, formatElapsed } from "../../time.ts";

export function GameDuration({
  elapsed,
  total,
}: { elapsed: number; total: number }) {
  return (
    <div className="flex font-mono items-center px-2 whitespace-nowrap">
      {formatDuration(elapsed, total)}
    </div>
  );
}

export function GameClock({ elapsed }: { elapsed: number }) {
  if (null === elapsed) {
    return null;
  }

  return (
    <div className="text-center app-text-shadow font-bold text-yellow-200">
      {formatElapsed(elapsed)}
    </div>
  );
}
