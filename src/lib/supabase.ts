import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// 🔥 BLOCK NOTES ONLY
const originalFrom = supabase.from.bind(supabase);

supabase.from = (table: string) => {
  if (table === "notes") {
    throw new Error("❌ Supabase NOTES still used!");
  }
  return originalFrom(table);
};