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
