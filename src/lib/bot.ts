import OpenAI from "openai";
import { createServiceClient } from "@/lib/supabase/service";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface Shop {
  id: string;
  name: string;
  welcome_message: string;
  after_hours_message: string;
  bot_active: boolean;
  platform: string;
  business_hours: Array<{
    day: string;
    open: string;
    close: string;
    enabled: boolean;
  }>;
  messages_used: number;
  messages_limit: number;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
}

function isWithinBusinessHours(businessHours: Shop["business_hours"]): boolean {
  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = days[now.getDay()];
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const today = businessHours.find((h) => h.day === currentDay);
  if (!today || !today.enabled) return false;

  return currentTime >= today.open && currentTime <= today.close;
}

function findBestFaq(message: string, faqs: Faq[]): { answer: string; score: number } | null {
  const lowerMsg = message.toLowerCase().replace(/[?!.,;:'"()]/g, "");
  const keywords = lowerMsg.split(/\s+/).filter((w) => w.length > 2);

  let bestFaq: Faq | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const lowerQ = faq.question.toLowerCase();
    let score = 0;

    for (const keyword of keywords) {
      if (lowerQ.includes(keyword)) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      bestFaq = faq;
    }
  }

  if (bestScore >= 1 && bestFaq) {
    return { answer: bestFaq.answer, score: bestScore };
  }

  return null;
}

async function generateAIResponse(
  customerMessage: string,
  shopName: string,
  faqs: Faq[]
): Promise<string> {
  if (!openai) return "";

  const faqContext = faqs
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  const prompt = `You are a friendly, helpful customer support chatbot for "${shopName}".

Your job is to answer customer questions accurately and warmly. Use the FAQ below as your primary knowledge source.

FAQ:
${faqContext || "No FAQ available."}

Rules:
- Keep responses short and conversational (1-3 sentences max).
- Always be polite and professional.
- If you don't know the answer, say you'll connect them with the team.
- Never make up information not in the FAQ.
- Use simple, friendly language.
- Do not use emojis.

Customer message: "${customerMessage}"

Response:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("OpenAI error:", error);
    return "";
  }
}

export async function generateBotResponse(
  customerPhone: string,
  customerMessage: string,
  shop: Shop,
  faqs: Faq[]
): Promise<string> {
  if (!shop.bot_active) {
    return shop.after_hours_message;
  }

  if (!isWithinBusinessHours(shop.business_hours)) {
    return shop.after_hours_message;
  }

  const lowerMsg = customerMessage.toLowerCase();

  const greetings = ["hi", "hello", "hey", "good morning", "good evening", "good afternoon", "namaste", "hii", "hlo"];
  if (greetings.some((g) => lowerMsg.startsWith(g) || lowerMsg === g)) {
    return shop.welcome_message;
  }

  const thanks = ["thank", "thanks", "thankyou", "thank you", "dhanyavaad"];
  if (thanks.some((t) => lowerMsg.includes(t))) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  const bye = ["bye", "goodbye", "see you", "tata", "alvida"];
  if (bye.some((b) => lowerMsg.includes(b))) {
    return "Goodbye! Have a great day! Feel free to message us anytime.";
  }

  const faqResult = findBestFaq(customerMessage, faqs);
  if (faqResult && faqResult.score >= 2) {
    return faqResult.answer;
  }

  if (openai) {
    const aiReply = await generateAIResponse(customerMessage, shop.name, faqs);
    if (aiReply) return aiReply;
  }

  if (faqResult) {
    return faqResult.answer;
  }

  return "Thanks for your message! Our team will get back to you shortly. Meanwhile, feel free to ask about our products, services, or business hours.";
}

export async function notifyOwner(
  shopId: string,
  customerPhone: string,
  customerName: string,
  customerMessage: string
) {
  const supabase = createServiceClient();
  if (!supabase) return;

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("id", shopId)
    .single();

  if (!shop) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", shopId)
    .single();

  if (!profile) return;

  await supabase.from("messages").insert({
    conversation_id: shopId,
    sender: "owner",
    content: `[SYSTEM] New message from ${customerName || customerPhone}: "${customerMessage}"`,
  });
}

export async function findOrCreateConversation(
  shopId: string,
  customerPhone: string,
  customerName: string
) {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("shop_id", shopId)
    .eq("customer_phone", customerPhone)
    .single();

  if (existing) {
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    return existing.id;
  }

  const { data: newConv } = await supabase
    .from("conversations")
    .insert({
      shop_id: shopId,
      customer_phone: customerPhone,
      customer_name: customerName,
      platform: "whatsapp",
      status: "active",
    })
    .select("id")
    .single();

  return newConv?.id || null;
}

export async function saveMessage(
  conversationId: string,
  sender: "customer" | "bot" | "owner",
  content: string
) {
  const supabase = createServiceClient();
  if (!supabase) return;

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender,
    content,
  });
}

export async function incrementMessageCount(shopId: string) {
  const supabase = createServiceClient();
  if (!supabase) return;

  const { error } = await supabase.rpc("increment_messages_used", { shop_id: shopId });
  if (error) {
    const { data } = await supabase
      .from("shops")
      .select("messages_used")
      .eq("id", shopId)
      .single();
    if (data) {
      await supabase
        .from("shops")
        .update({ messages_used: data.messages_used + 1 })
        .eq("id", shopId);
    }
  }
}
