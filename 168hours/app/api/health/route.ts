import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      connected: false,
      error: "DATABASE_URL environment variable is not set.",
    }, { status: 500 });
  }

  try {
    const result = await pool.query("SELECT NOW() as time");
    return NextResponse.json({
      connected: true,
      time: result.rows[0].time,
      message: "Database is connected and working.",
    });
  } catch (err) {
    return NextResponse.json({
      connected: false,
      error: String(err),
    }, { status: 500 });
  }
}
