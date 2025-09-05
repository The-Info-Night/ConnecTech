import { supabase } from "@/lib/supabaseClient";

export async function createRow<T>(table: string, values: Partial<T>) {
  const { data, error } = await supabase.from(table).insert(values).select();
  if (error) throw error;
  return data;
}

export async function updateRow<T>(table: string, id: number, values: Partial<T>) {
  const { data, error } = await supabase.from(table).update(values).eq("id", id).select();
  if (error) throw error;
  return data;
}

export async function deleteRow(table: string, id: number) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
  return true;
}



export async function getRows<T>(table: string, columns = "*", limit?: number) {
  let query = supabase.from(table).select(columns);
  if (typeof limit === "number") query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data as T[]) ?? [];
}

export async function getRowById<T>(table: string, id: number | string, columns = "*") {
  const { data, error } = await supabase.from(table).select(columns).eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as T) ?? null;
}



export async function searchRows<T>(
  table: string,
  columnsToSearch: string[],
  query: string,
  selectColumns = "*",
  limit = 50
) {
  const escaped = query.replace(/[%_]/g, (m) => `\\${m}`);
  const orFilter = columnsToSearch
    .map((c) => `${c}.ilike.%${escaped}%`)
    .join(",");

  const { data, error } = await supabase
    .from(table)
    .select(selectColumns)
    .or(orFilter)
    .limit(limit);
  if (error) throw error;
  return (data as T[]) ?? [];
}



type Startup = {
  id: number;
  name: string;
  description?: string | null;
  sector?: string | null;
  needs?: string | null;
  project_status?: string | null;
  website_url?: string | null;
};

export async function getStartups(limit = 12): Promise<Startup[]> {
  const { data, error } = await supabase
    .from("startups")
    .select("id,name,description,sector,needs,project_status,website_url")
    .order("id", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function searchStartups(query: string, limit = 30): Promise<Startup[]> {
  const escaped = query.replace(/[%_]/g, (m) => `\\${m}`);
  const { data, error } = await supabase
    .from("startups")
    .select("id,name,description,sector,needs,project_status,website_url")
    .or(`name.ilike.%${escaped}%,description.ilike.%${escaped}%,sector.ilike.%${escaped}%,needs.ilike.%${escaped}%`)
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getFilteredStartups(params: {
  sector?: string | null;
  project_status?: string | null;
  search?: string | null;
  limit?: number;
}): Promise<Startup[]> {
  const { sector, project_status, search, limit = 100 } = params;
  let query = supabase
    .from("startups")
    .select("id,name,description,sector,needs,project_status,website_url");

  if (sector && sector !== "") {
    query = query.eq("sector", sector);
  }
  if (project_status && project_status !== "") {
    query = query.eq("project_status", project_status);
  }
  if (search && search.trim().length > 0) {
    const escaped = search.replace(/[%_]/g, (m) => `\\${m}`);
    query = query.or(
      `name.ilike.%${escaped}%,description.ilike.%${escaped}%,sector.ilike.%${escaped}%,needs.ilike.%${escaped}%`
    );
  }

  const { data, error } = await query.limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getDistinctValues(
  table: string,
  column: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from(table)
    .select(`${column}`)
    .not(column, "is", null);
  if (error) throw error;
  const rows = (data as unknown as Array<Record<string, unknown>>) ?? [];
  const values = rows.map((row) => String(row[column] ?? "")).filter((v) => v.length > 0);
  return Array.from(new Set(values));
}
