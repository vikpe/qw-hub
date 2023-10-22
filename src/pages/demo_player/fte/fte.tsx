import { Controls } from "./Controls";
import { useFteController, useFteLoader } from "./hooks";
import { toggleFullscreen } from "./player";
import { useState } from "react";
import classNames from "classnames";
import { useEventListener } from "usehooks-ts";
import { getAssets } from "./assets";
import { getDemoUrl } from "../demo";
import { Demo } from "../services/supabase/supabase.types.ts";

export const FtePlayer = ({ demo }: { demo: Demo }) => {
  const demoUrl = getDemoUrl(demo.s3_key);
  const files = getAssets(demoUrl, demo.map);
  const { isLoadingAssets, isReady, assets, isInitializing } = useFteLoader({
    files,
    demoTotalTime: demo.duration,
  });
  const fte = useFteController();

  return (
    <div
      id="ftePlayer"
      className={"relative w-full h-full bg-black aspect-video"}
    >
      <FteCanvas />

      <div
        className={classNames(
          "absolute z-30 w-full h-full bg-black transition-opacity duration-700 delay-500 pointer-events-none",
          {
            "opacity-0": isReady,
          },
        )}
      >
        <div className="flex w-full h-full items-center justify-center">
          <div className="flex items-center">
            <svg
              className={classNames(
                "w-6 h-6 mr-2 fill-purple-600 text-purple-800 animate-spin",
                {
                  hidden: isReady,
                },
              )}
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <div className="animate-pulse text-gray-400">
              {isLoadingAssets && <>Loading assets ({assets.progress}%)</>}
              {isInitializing && <>Initializing..</>}
            </div>
          </div>
        </div>
      </div>
      {fte && (
        <div className={"absolute z-10 bottom-0 w-full"}>
          <Controls />
        </div>
      )}
    </div>
  );
};

// const PlayerDebug = () => {
//   useUpdateInterval(200);
//   const fte = useFteController();
//
//   if (!fte) {
//     return null;
//   }
//
//   return <Debug value={fte.getPlayers()} />;
// };

const FteCanvas = () => {
  const fte = useFteController();
  const [isShowingScores, setIsShowingScores] = useState(false);

  function onKeyDown(e: KeyboardEvent) {
    if (!fte) {
      return;
    }

    if (e.code === "Tab") {
      e.preventDefault();

      if (isShowingScores) {
        return;
      }
      fte.command("+showscores");
      setIsShowingScores(true);
    } else if (e.code === "Space") {
      fte.trackNext();
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (!fte) {
      return;
    }

    if (e.code === "Tab") {
      e.preventDefault();
      fte.command("-showscores");
      setIsShowingScores(false);
    }
  }

  useEventListener("keydown", onKeyDown);
  useEventListener("keyup", onKeyUp);

  return (
    <canvas
      id="fteCanvas"
      className={"absolute w-full h-full"}
      onClick={() => fte?.togglePlay()}
      onDoubleClick={() => toggleFullscreen()}
      onTouchStart={() => fte?.command("+scoreboard")}
      onTouchEnd={() => fte?.command("-scoreboard")}
    />
  );
};