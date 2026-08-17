import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { conversation_id, content } = body;
  if (!conversation_id || !content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "conversation_id and content required" }, { status: 400 });
  }

  const serviceClient = createServiceClient();
  if (!serviceClient) return NextResponse.json({ error: "Service not configured" }, { status: 503 });

  const { data: conversation } = await serviceClient
    .from("conversations")
    .select("id, customer_phone, shop_id, shops!inner(owner_id)")
    .eq("id", conversation_id)
    .single();

  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  const shop = conversation.shops as unknown as { owner_id: string };
  if (shop.owner_id !== user.id) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await serviceClient.from("messages").insert({
    conversation_id,
    sender: "owner",
    content: content.trim(),
  });

  try {
    await sendWhatsAppMessage(conversation.customer_phone, content.trim());
  } catch (err) {
    console.error("Failed to send WhatsApp message:", err);
  }

  await serviceClient.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversation_id);

  return NextResponse.json({ success: true });
}
