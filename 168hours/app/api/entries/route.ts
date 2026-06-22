import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const weekId = req.nextUrl.searchParams.get("weekId");
  if (!weekId) return NextResponse.json({ error: "weekId required" }, { status: 400 });

  try {
    const result = await pool.query(
      "SELECT week_id, day, hour, category, title, notes FROM hour_entries WHERE week_id = $1",
      [weekId]
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { weekId, entries } = body as {
    weekId: string;
    entries: Array<{ day: number; hour: number; category: string; title: string; notes?: string }>;
  };

  if (!weekId || !entries) return NextResponse.json({ error: "weekId and entries required" }, { status: 400 });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM hour_entries WHERE week_id = $1", [weekId]);

    for (const e of entries) {
      await client.query(
        "INSERT INTO hour_entries (week_id, day, hour, category, title, notes) VALUES ($1, $2, $3, $4, $5, $6)",
        [weekId, e.day, e.hour, e.category, e.title ?? "", e.notes ?? ""]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req: NextRequest) {
  const weekId = req.nextUrl.searchParams.get("weekId");
  if (!weekId) return NextResponse.json({ error: "weekId required" }, { status: 400 });

  try {
    await pool.query("DELETE FROM hour_entries WHERE week_id = $1", [weekId]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
