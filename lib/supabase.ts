import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Solo se usa la ANON key (pública). La service_role key nunca va al frontend.
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
