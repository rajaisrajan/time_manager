import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, name, color FROM custom_categories ORDER BY created_at ASC"
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, name, color } = body as { id: string; name: string; color: string };

  if (!id || !name || !color) return NextResponse.json({ error: "id, name, color required" }, { status: 400 });

  try {
    await pool.query(
      "INSERT INTO custom_categories (id, name, color) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING",
      [id, name, color]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    await pool.query("DELETE FROM custom_categories WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
