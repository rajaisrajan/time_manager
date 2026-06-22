import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const weekId = req.nextUrl.searchParams.get("weekId");
  if (!weekId) return NextResponse.json({ error: "weekId required" }, { status: 400 });

  const { data, error } = await supabase
    .from("hour_entries")
    .select("*")
    .eq("week_id", weekId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { weekId, entries } = body as {
    weekId: string;
    entries: Array<{ day: number; hour: number; category: string; title: string; notes?: string }>;
  };

  if (!weekId || !entries) return NextResponse.json({ error: "weekId and entries required" }, { status: 400 });

  const { error: deleteError } = await supabase
    .from("hour_entries")
    .delete()
    .eq("week_id", weekId);

  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  if (entries.length === 0) return NextResponse.json({ ok: true });

  const rows = entries.map(e => ({
    week_id: weekId,
    day: e.day,
    hour: e.hour,
    category: e.category,
    title: e.title ?? "",
    notes: e.notes ?? "",
  }));

  const { error } = await supabase.from("hour_entries").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const weekId = req.nextUrl.searchParams.get("weekId");
  if (!weekId) return NextResponse.json({ error: "weekId required" }, { status: 400 });

  const { error } = await supabase
    .from("hour_entries")
    .delete()
    .eq("week_id", weekId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
