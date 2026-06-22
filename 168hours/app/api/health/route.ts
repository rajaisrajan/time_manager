import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      connected: false,
      error: "Supabase environment variables are not set.",
    }, { status: 500 });
  }

  try {
    const { error } = await supabase.from("hour_entries").select("id").limit(1);
    if (error) throw error;
    return NextResponse.json({
      connected: true,
      message: "Database is connected and working.",
    });
  } catch (err) {
    return NextResponse.json({
      connected: false,
      error: String(err),
    }, { status: 500 });
  }
}
