import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get("shop_id");

  let query = supabase.from("faqs").select("*").order("created_at", { ascending: true });

  if (shopId) {
    const { data: shop } = await supabase.from("shops").select("owner_id").eq("id", shopId).single();
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (shop?.owner_id !== user.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    query = query.eq("shop_id", shopId);
  } else {
    const { data: shops } = await supabase.from("shops").select("id").eq("owner_id", user.id);
    if (shops && shops.length > 0) {
      query = query.in("shop_id", shops.map((s) => s.id));
    }
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { shop_id, question, answer } = body;
  if (!shop_id || !question || !answer) {
    return NextResponse.json({ error: "shop_id, question, and answer required" }, { status: 400 });
  }

  const { data: shop } = await supabase.from("shops").select("owner_id").eq("id", shop_id).single();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (shop?.owner_id !== user.id && profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("faqs")
    .insert({ shop_id, question: question.trim(), answer: answer.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "FAQ id required" }, { status: 400 });

  const { data: faq } = await supabase.from("faqs").select("shop_id").eq("id", id).single();
  if (faq) {
    const { data: shop } = await supabase.from("shops").select("owner_id").eq("id", faq.shop_id).single();
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (shop?.owner_id !== user.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
