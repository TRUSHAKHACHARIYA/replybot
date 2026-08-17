import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get("shop_id");
  const conversationId = searchParams.get("conversation_id");

  if (conversationId) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
  }

  let query = supabase
    .from("conversations")
    .select("*, messages:messages(id, sender, content, created_at)")
    .order("updated_at", { ascending: false });

  if (shopId) {
    query = query.eq("shop_id", shopId);
  } else {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const { data: shops } = await supabase
        .from("shops")
        .select("id")
        .eq("owner_id", user.id);

      if (shops && shops.length > 0) {
        const shopIds = shops.map((s) => s.id);
        query = query.in("shop_id", shopIds);
      }
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
