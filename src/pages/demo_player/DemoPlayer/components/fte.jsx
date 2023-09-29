//  import { document, window } from "browser-monads";
import screenfull from "screenfull";
import { useCounter, useEffectOnce, useInterval, useScript } from "usehooks-ts";

import {
  getAssets,
  withPrefix,
} from "@qwhub/pages/demo_player/DemoPlayer/components/assets";
import { createRef, useEffect, useState } from "react";
import {
  VolumeSlider,
  VolumeToggle,
} from "@qwhub/pages/demo_player/DemoPlayer/components/Volume";
import {
  GameTime,
  PlayToggleButton,
  ToggleFullscreenButton,
  ToggleSlowMotionButton,
} from "@qwhub/pages/demo_player/DemoPlayer/components/controls";

function fteCommand(command) {
  try {
    window.Module.execute(command);
  } catch (e) {
    console.log("fteCommand error: " + e);
  }
}

const defaulState = {
  gametime: 0,
  isPlaying: true,
  playbackSpeed: 100,
  targetSpeed: 100,
  targetSpeedArrivalTime: 100,
  volume: 0.1,
  volumeMuted: false,
  playerControlTimeout: 0,
  firstRefresh: true,
};

export const FteComponent = ({ demoFilename, map, demoUrl, duration }) => {
  const [state, setState] = useState(defaulState);
  const canvasRef = createRef();
  const playerRef = createRef();
  const refreshInterval = 250;
  const gameAssets = getAssets(demoUrl, map);
  const { count: numberOfLoadedAssets, increment: incrementLoadedAssets } =
    useCounter(0);
  const fteScriptStatus = useScript(withPrefix("/ftewebgl.js"), {
    removeOnUnmount: true,
  });
  const [fteReady, setFteReady] = useState(false);

  console.log("FteComponent");

  const easingTime = 1500.0;

  useEffectOnce(() => {
    window.Module = {
      canvas: canvasRef.current,
      files: gameAssets,
      setStatus: onStatusChange,
    };
  });

  useEffect(() => {
    if (fteReady) {
      return;
    }

    if ("ready" === fteScriptStatus) {
      setFteReady(true);
      console.log("########################## FTE ready");
      console.log(window.Module);
    }
  }, [fteScriptStatus]);

  useInterval(onFteRefresh, fteReady ? refreshInterval : null);

  function onStatusChange(value) {
    const assetRe = value.match(/.+ \((\d+)\/(\d+)\)/);
    const isLoadedAsset =
      assetRe && assetRe.length === 3 && assetRe[1] === assetRe[2];

    if (isLoadedAsset) {
      incrementLoadedAssets();
    }
  }

  function onFteRefresh() {
    if (window.Module.gametime) {
      setState({ ...state, gametime: window.Module.gametime() });
    }

    if (
      state.playerControlTimeout !== 0 &&
      state.playerControlTimeout < Date.now()
    ) {
      fteCommand("viewsize 100");
      setState({ ...state, playerControlTimeout: 0 });
    }

    if (state.firstRefresh && state.gametime > 0) {
      onResize();

      // Workaround for not being able to bind an alias to TAB key for RQ demos
      if (/.+.dem/.test(demoFilename)) {
        fteCommand("bind tab +showteamscores");
      }

      setState({ ...state, firstRefresh: false });
    }

    if (state.loop && state.gametime >= state.initialPosition + state.loop) {
      fteCommand("demo_jump " + state.initialPosition);
    }

    if (
      state.playbackSpeed !== 0 &&
      state.playbackSpeed !== state.targetSpeed
    ) {
      const now = performance.now();
      if (now >= state.targetSpeedArrivalTime) {
        fteCommand("demo_setspeed " + state.targetSpeed);
        setState({ ...state, playbackSpeed: state.targetSpeed });
      } else {
        const progress = (state.targetSpeedArrivalTime - now) / easingTime;
        const easing = 1 - progress * (2 - progress);

        if (state.playbackSpeed > state.targetSpeed) {
          const speed =
            state.playbackSpeed -
            (state.playbackSpeed - state.targetSpeed * 1.0) * easing;
          fteCommand("demo_setspeed " + speed);
          setState({ ...state, playbackSpeed: speed });
        } else {
          const speed =
            state.playbackSpeed +
            (state.targetSpeed - state.playbackSpeed * 1.0) * easing;
          fteCommand("demo_setspeed " + speed);
          setState({ ...state, playbackSpeed: speed });
        }
      }
    }

    // This is a hack, seeking causes player to switch
    if (state.gametime > 0 && state.initialPlayer) {
      fteCommand("track " + state.initialPlayer); // cmd: users for userId
    }
  }

  function onPlayToggle() {
    if (state.isPlaying) {
      fteCommand("demo_setspeed 0");
      setState({ ...state, isPlaying: false });
    } else {
      fteCommand("demo_setspeed " + state.playbackSpeed);
      setState({ ...state, isPlaying: true });
    }
  }

  function onResize() {
    const width =
      window.screen.orientation.angle === 0
        ? playerRef.current.clientWidth
        : playerRef.current.clientHeight;

    // Arbitrary scaling ratio based on 4 * DPI for 4k fullscreen.
    fteCommand(
      "vid_conautoscale " +
        Math.ceil(4.0 * window.devicePixelRatio * (width / 3840.0)).toString(),
    );
  }

  function toggleFullscreen() {
    if (!screenfull.isEnabled) {
      return;
    }

    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request(playerRef.current);
    }
  }

  function onVolumeLevelChange(volume) {
    fteCommand(`volume ${volume}`);
    setState({ ...state, volume: parseFloat(volume) });
  }

  function onVolumeMuteToggle(volumeMuted) {
    setState({ ...state, volumeMuted });
    const volume = volumeMuted ? 0 : state.volume;
    fteCommand(`volume ${volume}`);
  }

  function onMouseMove() {
    // Avoid spamming the react state
    if (state.playerControlTimeout - Date.now() < 2500) {
      setState({ ...state, playerControlTimeout: Date.now() + 3000 });
    }
  }

  function onMouseLeave() {
    setState({ ...state, playerControlTimeout: Date.now() + 250 });
  }

  function onTouchStart() {
    fteCommand("+scoreboard");
  }

  function onTouchEnd() {
    fteCommand("-scoreboard");
  }

  function onDemoSeek(event) {
    const playerOffsetX = playerRef.current.offsetLeft;
    const playerWidth = playerRef.current.offsetWidth;
    const seekPosition =
      ((event.clientX - playerOffsetX) / playerWidth) * (duration + 10);
    fteCommand("demo_jump " + Math.floor(seekPosition));
    setState({ ...state, playerControlTimeout: Date.now() + 3000 });
  }

  function toggleSlowMotion(event) {
    if (!state.playbackSpeed === 0) {
      if (state.targetSpeed === 100) {
        setState({
          ...state,
          targetSpeed: 20,
          targetSpeedArrivalTime: event.timeStamp + easingTime,
        });
      } else {
        setState({
          ...state,
          targetSpeed: 100,
          targetSpeedArrivalTime: event.timeStamp + easingTime,
        });
      }
    }
  }

  const gametimeProgress =
    ((state.gametime / duration) * 100.0).toString() + "%";
  const totalAssets = Object.keys(gameAssets).length;

  return (
    <div
      ref={playerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onBlur={onMouseLeave}
      className={"fte w-full h-full relative bg-black aspect-video"}
    >
      <div>
        <canvas
          id="canvas"
          ref={canvasRef}
          className={"absolute w-full h-full"}
          onClick={onPlayToggle}
          onDoubleClick={toggleFullscreen}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            cursor: state.playerControlTimeout ? "auto" : "none",
          }}
        />

        <div
          className={"flex absolute bottom-0 w-full z-10 transition-opacity"}
        >
          <div className={"flex w-full flex-wrap bg-black/60"}>
            <div className="w-full p-4">
              <pre>
                {JSON.stringify(
                  {
                    ...state,
                    totalAssets,
                    loadedAssets: numberOfLoadedAssets,
                    gametimeProgress,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            <div
              className={
                "flex relative w-full h-6 bg-neutral-500 cursor-pointer m-3"
              }
              onClick={onDemoSeek}
            >
              <div
                className={"w-0 bg-purple-700 border-r-2"}
                style={{
                  width: gametimeProgress,
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>

            <PlayToggleButton
              onClick={onPlayToggle}
              isPlaying={state.isPlaying}
            />

            <VolumeToggle
              isMuted={state.volumeMuted}
              volume={state.volume}
              onChange={onVolumeMuteToggle}
            />

            <VolumeSlider
              disabled={state.volumeMuted}
              volume={state.volume}
              onChange={onVolumeLevelChange}
            />

            <GameTime total={duration} elapsed={state.gametime} />

            <ToggleFullscreenButton
              onClick={toggleFullscreen}
              isFullscreen={screenfull.isFullscreen}
            />

            <ToggleSlowMotionButton onClick={toggleSlowMotion} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FteComponent;