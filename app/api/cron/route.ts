import { NextResponse } from 'next/server';
import { supabaseServer } from "@/lib/supabaseServer";

const API_BASE = process.env.API_BASE_URL!;
const API_TOKEN = process.env.JEB_API_TOKEN!;

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      accept: "application/json",
      "X-Group-Authorization": process.env.JEB_API_TOKEN!,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return (await res.json()) as T;
}

export async function GET() {
  try {
    const startups = await fetchJSON<any[]>('/startups');
    await supabaseServer.from('startups').upsert(startups, { onConflict: 'id' });

    const investors = await fetchJSON<any[]>('/investors');
    await supabaseServer.from('investors').upsert(investors, { onConflict: 'id' });

    const partners = await fetchJSON<any[]>('/partners');
    await supabaseServer.from('partners').upsert(partners, { onConflict: 'id' });

    const newsList = await fetchJSON<any[]>('/news');
    await supabaseServer.from('news').upsert(newsList, { onConflict: 'id' });

    const events = await fetchJSON<any[]>('/events');
    await supabaseServer.from('events').upsert(events, { onConflict: 'id' });

    const users = await fetchJSON<any[]>('/users');
    await supabaseServer.from('users').upsert(users, { onConflict: 'id' });

    return NextResponse.json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sync failed', details: error }, { status: 500 });
  }
}
