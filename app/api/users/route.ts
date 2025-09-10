import { NextResponse } from "next/server";
import { getSupabaseWithAuth } from "@/lib/supabaseServer";

function getTokenFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  return authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
}

export async function GET(request: Request) {
  const token = getTokenFromRequest(request);
  const supabase = getSupabaseWithAuth(token ?? "");

  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return NextResponse.json({ users: data ?? [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const token = getTokenFromRequest(request);
  const supabase = getSupabaseWithAuth(token ?? "");

  const body = await request.json();
  const { uuid, values } = body as { uuid: string; values: Record<string, unknown> };

  const { data, error } = await supabase
    .from("users")
    .update(values)
    .eq("uuid", uuid)
    .select()
    .maybeSingle();

  if (error) throw error;
  return NextResponse.json({ user: data });
}

