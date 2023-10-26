import { useUpdateInterval } from "../../hooks.ts";
import { useFteController } from "../../fte/hooks.ts";
import { formatElapsed } from "../../time.ts";

export const GameClock = () => {
  const fte = useFteController();
  useUpdateInterval(fte ? 200 : null);

  if (!fte) {
    return null;
  }

  const elapsed = fte.getGameElapsedTime();
  const total = fte.getGameTotalTime();

  return (
    <div className="flex mr-auto font-mono items-center px-2">
      {formatElapsed(elapsed, total)}
    </div>
  );
};