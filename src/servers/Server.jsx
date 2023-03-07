import React from "react";
import { useSelector } from "react-redux";
import copyToClipboard from "copy-text-to-clipboard";
import {
  selectMetaByAddress,
  selectServerByAddress,
} from "../services/hub/servers.js";
import { Scoreboard } from "./Scoreboard.jsx";
import { QuakeText } from "./QuakeText.jsx";
import { pluralize } from "../common/text.js";
import { TextBlur } from "../TextAnimations.jsx";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import ServerStreams from "../ServerStreams";

const ServerProgress = React.memo((props) => {
  const { value, max } = props;
  const progress = 100 * (value / max);
  const width = `${progress}%`;

  return (
    <div className="server-progress">
      <div className="server-progress-bar" style={{ width }} />
    </div>
  );
});

const ServerHeader = (props) => {
  const { address } = props;
  const server = useSelector((state) => selectServerByAddress(state, address));
  const JoinButtonEl =
    server.player_slots.free > 0 ? PrimaryButton : SecondaryButton;

  return (
    <div className="border-b border-black">
      <div className="flex justify-between p-3">
        <ServerStatus
          mode={server.mode}
          map={server.settings.map}
          statusName={server.status.name}
          statusDescription={server.status.description}
        />
        <JoinButtonEl
          href={`qw://${address}/`}
          className="flex items-center px-5 text-lg rounded-lg"
        >
          Join
        </JoinButtonEl>
      </div>
      {server.time.total > 0 &&
        ["Started", "Countdown"].includes(server.status.name) && (
          <ServerProgress value={server.time.elapsed} max={server.time.total} />
        )}
    </div>
  );
};

const ServerStatus = React.memo((props) => {
  const { mode, map, statusName, statusDescription } = props;

  return (
    <div>
      <strong>
        <TextBlur key="mode" value={mode} />
      </strong>{" "}
      on{" "}
      <strong>
        <TextBlur key="map" value={map} />
      </strong>
      <div>
        <span className="server-status mr-1">
          {["Started", "Countdown"].includes(statusName) && (
            <span className="px-1 py-0.5 rounded-sm font-mono text-xs bg-red-600 app-text-shadow">
              LIVE
            </span>
          )}{" "}
          {"Standby" === statusName && (
            <div className="indicator-waiting-container">
              <div className="indicator-waiting" />
            </div>
          )}
        </span>

        <span className="text-gray-300 text-xs">{statusDescription}</span>
      </div>
    </div>
  );
});

const ServerBody = (props) => {
  const { address } = props;
  const serverMeta = useSelector((state) =>
    selectMetaByAddress(state, address)
  );

  const mapThumbnailSrc = serverMeta.mapName
    ? `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${serverMeta.mapName}.jpg)`
    : "none";

  return (
    <div className="grow bg-cover bg-center bg-[url(/assets/img/default_mapshot.jpg)]">
      <div
        className="h-full min-h-[200px] bg-cover bg-center"
        style={{ backgroundImage: mapThumbnailSrc }}
      >
        <div className="flex flex-col justify-center items-center bg-gray-700/40 h-full px-2 py-4">
          {serverMeta.matchtag && (
            <div className="py-1.5 mb-3 uppercase font-bold tracking-widest text-xs text-center w-full bg-gradient-to-r from-red-600/0 via-red-600 app-text-shadow">
              {serverMeta.matchtag}
            </div>
          )}
          <Scoreboard
            address={address}
            limit={serverMeta.playerDisplay.visible}
          />
          <HiddenPlayers count={serverMeta.playerDisplay.hidden} />
          <SpectatorText text={serverMeta.spectatorText} />
        </div>
      </div>
    </div>
  );
};

const HiddenPlayers = React.memo((props) => {
  const { count } = props;

  if (0 === count) {
    return null;
  }

  return (
    <div className="mt-1 text-xs text-gray-300">
      +{count} {pluralize("player", count)}
    </div>
  );
});

const SpectatorText = React.memo((props) => {
  const { text } = props;

  if ("" === text) {
    return null;
  }

  return (
    <div className="text-xs text-center mt-3 text-white/70 app-text-shadow">
      <span className="qw-color-b">specs:</span>{" "}
      <QuakeText tag="span" text={text} />
    </div>
  );
});

const SpectatorButtons = (props) => {
  const { server } = props;

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <SecondaryButton
          href={`qw://${server.address}/observe`}
          count={server.spectator_slots.used}
        >
          Spectate
        </SecondaryButton>

        {server.qtv_stream.address !== "" && (
          <SecondaryButton
            href={`qw://${server.qtv_stream.url}/qtvplay`}
            count={server.qtv_stream.spectator_count}
          >
            QTV
          </SecondaryButton>
        )}
        {<ServerStreams address={server.address} />}
      </div>
    </div>
  );
};

const ServerFooter = (props) => {
  const { address } = props;
  const server = useSelector((state) => selectServerByAddress(state, address));

  return (
    <div className="p-3 border-t border-t-black bg-[#334] text-sm space-y-3">
      <SpectatorButtons server={server} />

      <div className="flex text-xs justify-between">
        <div
          className="server-address flex items-center cursor-pointer text-white/60"
          onClick={() => copyToClipboard(server.settings.hostname_parsed)}
          title="Copy IP to clipboard"
        >
          <ServerAddressTitle
            cc={server.geo.cc}
            title={server.meta.addressTitle}
          />
          <img
            src="/assets/img/icons/content_paste.svg"
            width="12"
            alt=""
            className="app-icon ml-1 inline"
          />
        </div>

        {server.settings.ktxver && (
          <KtxVersion version={server.settings.ktxver} />
        )}
      </div>
    </div>
  );
};

const ServerAddressTitle = React.memo((props) => {
  const { cc, title } = props;

  return (
    <div className="flex items-center max-w-[260px] truncate">
      {cc && (
        <img
          src={`https://www.quakeworld.nu/images/flags/${cc.toLowerCase()}.gif`}
          width="16"
          height="11"
          alt={cc}
          className="inline mr-1 mb-[1px]"
        />
      )}
      {title}
    </div>
  );
});

const KtxVersion = React.memo((props) => {
  const { version } = props;
  const label = `KTX ${version}`;

  return (
    <div
      className="text-right w-20 overflow-hidden whitespace-nowrap text-ellipsis text-white/40"
      title={label}
    >
      {label}
    </div>
  );
});

export const Server = (props) => {
  const { address } = props;
  const serverMeta = useSelector((state) =>
    selectMetaByAddress(state, address)
  );

  return (
    <div className={`w-full flex flex-col ${serverMeta.wrapperClassNames}`}>
      <div className="server flex flex-col h-full bg-[#445]">
        <ServerHeader address={address} />
        <ServerBody address={address} />
        <ServerFooter address={address} />
      </div>
    </div>
  );
};