import { NextRequest, NextResponse } from "next/server";
import {
  WHATSAPP_VERIFY_TOKEN,
  parseWebhookBody,
  sendWhatsAppMessage,
  markMessageAsRead,
} from "@/lib/whatsapp";
import {
  findOrCreateConversation,
  saveMessage,
  generateBotResponse,
  incrementMessageCount,
  notifyOwner,
} from "@/lib/bot";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const incomingMessages = parseWebhookBody(body);

    if (incomingMessages.length === 0) {
      return NextResponse.json({ status: "ok" });
    }

    const supabase = createServiceClient();

    for (const msg of incomingMessages) {
      await markMessageAsRead(msg.messageId);

      if (!supabase) continue;

      const { data: allShops } = await supabase
        .from("shops")
        .select("id, name, welcome_message, after_hours_message, bot_active, business_hours, messages_used, messages_limit, platform");

      const shop = allShops?.find(
        (s) => s.id === msg.phoneNumberId || s.name.toLowerCase() === msg.phoneNumberId.toLowerCase()
      );

      if (!shop) {
        console.log(`No shop found for phone number ID: ${msg.phoneNumberId}`);
        continue;
      }

      if (shop.platform !== "whatsapp" && shop.platform !== "both") {
        continue;
      }

      await processMessage(supabase, shop, msg);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ status: "ok" });
  }
}

async function processMessage(
  supabase: ReturnType<typeof createServiceClient>,
  shop: {
    id: string;
    name: string;
    welcome_message: string;
    after_hours_message: string;
    bot_active: boolean;
    platform: string;
    business_hours: Array<{ day: string; open: string; close: string; enabled: boolean }>;
    messages_used: number;
    messages_limit: number;
  },
  msg: {
    from: string;
    contactName: string;
    text: string;
    messageId: string;
    timestamp: string;
    phoneNumberId: string;
  }
) {
  if (!supabase) return;

  if (shop.messages_used >= shop.messages_limit) {
    await sendWhatsAppMessage(
      msg.from,
      "Thank you for your message! Our team will get back to you shortly."
    );
    return;
  }

  const conversationId = await findOrCreateConversation(
    shop.id,
    msg.from,
    msg.contactName
  );

  if (!conversationId) return;

  await saveMessage(conversationId, "customer", msg.text);

  const { data: faqs } = await supabase
    .from("faqs")
    .select("id, question, answer")
    .eq("shop_id", shop.id);

  const botReply = await generateBotResponse(
    msg.from,
    msg.text,
    shop,
    faqs || []
  );

  await saveMessage(conversationId, "bot", botReply);
  await incrementMessageCount(shop.id);
  await sendWhatsAppMessage(msg.from, botReply);

  await notifyOwner(shop.id, msg.from, msg.contactName, msg.text);
}
