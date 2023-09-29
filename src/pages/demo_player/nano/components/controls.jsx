import { secondsToString } from "@qwhub/pages/demo_player/nano/components/time";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faGauge,
  faMinimize,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import screenfull from "@qwhub/pages/demo_player/nano/components/screenfull";

export const GameTime = ({ total, elapsed }) => {
  return (
    <div className="flex mr-auto font-mono items-center">
      {secondsToString(elapsed)} / {secondsToString(total)}
    </div>
  );
};
export const PlayToggle = ({ isPlaying, onClick }) => {
  return (
    <button className="w-32 border" title="Play" onClick={onClick}>
      <FontAwesomeIcon icon={isPlaying ? faPlay : faPause} />{" "}
      {isPlaying ? "playing" : "not playing"}
    </button>
  );
};
export const ToggleSlowMotionButton = ({ onClick }) => {
  return (
    <button className={"w-12"} onClick={onClick}>
      <FontAwesomeIcon icon={faGauge} />
    </button>
  );
};
export const ToggleFullscreenButton = ({ onClick }) => {
  return (
    <button className={"w-12"} onClick={onClick}>
      <FontAwesomeIcon icon={screenfull.isFullscreen ? faMinimize : faExpand} />
    </button>
  );
};