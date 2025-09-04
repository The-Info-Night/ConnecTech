import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useSupabaseData<T>(table: string, options?: { single?: boolean }) {
  const [data, setData] = useState<T[] | T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const query = supabase.from(table).select("*");

      let result;
      if (options?.single) {
        result = await query.limit(1).maybeSingle();
        setData(result.data ?? null);
      } else {
        result = await query;
        setData(result.data ?? []);
      }

      if (result.error) setError(result.error.message);
      setLoading(false);
    }

    fetchData();
  }, [table, options?.single]);

  return { data, loading, error };
}
