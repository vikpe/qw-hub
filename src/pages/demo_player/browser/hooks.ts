import { useEffect, useState } from "react";
import { Demo } from "../services/supabase/supabase.types.ts";
import { searchDemos } from "../services/supabase/supabase.ts";
import { DemoBrowserSettings } from "./types.ts";
import { useLocalStorage } from "usehooks-ts";

export function useSearchDemos(settings: DemoBrowserSettings) {
  const [demos, setDemos] = useState<Demo[] | null>([]);

  useEffect(() => {
    async function run() {
      const { data } = await searchDemos(settings);
      setDemos(data as Demo[]);
    }

    run();
  }, [settings.query, settings.gameMode]);

  return { demos };
}

export function useDemoBrowserSettings() {
  const [settings, setSettings] = useLocalStorage<DemoBrowserSettings>(
    "demoBrowser",
    {
      displayMode: "grid",
      gameMode: "all",
      query: "",
    },
  );

  return { settings, setSettings };
}
