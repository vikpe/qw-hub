import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { Database } from "./database.types.ts";

import { DemoBrowserSettings } from "../../browser/types.ts";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export function getClient(): SupabaseClient {
  return supabase;
}

export async function getDemo(id: number) {
  return supabase.from("demos").select("*").eq("id", id).limit(1).single();
}

function queryToFullTextSearchString(query: string = ""): string {
  const q = query.trim();

  if (!q) {
    return "";
  }

  return q
    .split(" ")
    .map((p) => `'${p}'`)
    .join(" & ");
}

export async function searchDemos({ query, gameMode }: DemoBrowserSettings) {
  let qb = supabase.from("demos").select("*");

  const fts = queryToFullTextSearchString(query);

  if (gameMode !== "all") {
    qb = qb.eq("mode", gameMode);
  }

  if (fts) {
    qb = qb.textSearch("fts", fts);
  }

  return qb.order("timestamp", { ascending: false }).limit(60);
}
