import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer.from("users").select("*");
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
  const body = await request.json();
  const { uuid, values } = body as { uuid: string; values: Record<string, unknown> };

  const { data, error } = await supabaseServer
    .from("users")
    .update(values)
    .eq("uuid", uuid)
    .select()
    .maybeSingle();

  if (error) throw error;
  return NextResponse.json({ user: data });
}

