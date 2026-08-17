import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { name, welcome_message, after_hours_message } = body;
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Shop name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("shops")
    .insert({
      owner_id: user.id,
      name: name.trim(),
      welcome_message: welcome_message || "Hello! How can I help you today?",
      after_hours_message: after_hours_message || "Thanks for reaching out! We'll get back to you soon.",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data, { status: 201 });
}
