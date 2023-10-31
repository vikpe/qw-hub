import { useEffect, useState } from "react";
import { getDemo } from "../services/supabase/supabase";
import { Timestamp } from "../Timestamp.tsx";
import { Demo } from "../services/supabase/supabase.types.ts";
import {
  getDemoDescription,
  getDemoDownloadUrl,
} from "../services/supabase/demo.ts";
import { FtePlayer } from "./FtePlayer.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { ToggleClipEditorButton } from "./Clips.tsx";

export const Player = ({ demoId }: { demoId: number }) => {
  const [demo, setDemo] = useState<Demo | null>(null);

  useEffect(() => {
    if (!demoId) {
      return;
    }

    async function run() {
      const { data } = await getDemo(demoId);
      setDemo(data);
    }

    run();
  }, [demoId]);

  if (!demo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DemoBreadcrumbs demo={demo} />
      <div className="lg:flex min-h-[200px] mt-4">
        <div className="flex flex-col grow">
          <div className="flex grow bg-black items-center justify-center max-h-[75vh]">
            <FtePlayer demo={demo} />
          </div>
          <DemoPlayerFooter demo={demo} />
        </div>
      </div>
    </>
  );
};

export const DemoPlayerFooter = ({ demo }: { demo: Demo }) => {
  return (
    <div className="py-6 md:flex justify-between">
      <DemoInfo demo={demo} />
      <div className="flex items-center space-x-4">
        <ToggleClipEditorButton />
        <DownloadDemoButton s3_key={demo.s3_key} />
      </div>
    </div>
  );
};

export const DemoInfo = ({ demo }: { demo: Demo }) => {
  const demoDescription = getDemoDescription(demo);

  return (
    <div className="space-y-2">
      <div className="text-2xl font-bold">{demoDescription}</div>
      <div className="text-slate-400 text-sm">
        <Timestamp timestamp={demo.timestamp} /> on {demo.source}
      </div>
    </div>
  );
};

export const DownloadDemoButton = ({ s3_key }: { s3_key: string }) => {
  const demoUrl = getDemoDownloadUrl(s3_key);

  return (
    <a
      href={demoUrl}
      className="flex text-sm items-center md:mt-0 py-2.5 px-4 rounded bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800"
    >
      <FontAwesomeIcon icon={faFloppyDisk} fixedWidth className="mr-1.5" />
      Download
    </a>
  );
};

export const DemoBreadcrumbs = ({ demo }: { demo: Demo }) => {
  const demoDescription = getDemoDescription(demo);
  const demoBreadcrumbs = [demoDescription];

  return (
    <div className="flex p-3 bg-white/5 text-sm text-slate-300">
      <a href={`/recent_games/`}>Recent games</a>
      {demoBreadcrumbs.map((b, i) => (
        <span key={i}>
          <span className="mx-2 text-gray-500">/</span>
          {b}
        </span>
      ))}
    </div>
  );
};
