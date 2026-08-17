export const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";
export const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "";
export const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
export const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "replybot-verify-token";

export async function sendWhatsAppMessage(to: string, text: string) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error("WhatsApp credentials not configured");
    return null;
  }

  const response = await fetch(
    `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("WhatsApp send error:", error);
    return null;
  }

  return response.json();
}

export async function markMessageAsRead(messageId: string) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) return;

  await fetch(
    `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    }
  );
}

export interface IncomingMessage {
  from: string;
  messageId: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

export interface WebhookEntry {
  id: string;
  changes: {
    value: {
      messaging_product: string;
      metadata: {
        display_phone_number: string;
        phone_number_id: string;
      };
      contacts?: Array<{
        profile: { name: string };
        wa_id: string;
      }>;
      messages?: IncomingMessage[];
    };
    field: string;
  }[];
}

export function parseWebhookBody(body: Record<string, unknown>) {
  const entries = (body.entry || []) as WebhookEntry[];
  const messages: Array<{
    from: string;
    contactName: string;
    text: string;
    messageId: string;
    timestamp: string;
    phoneNumberId: string;
  }> = [];

  for (const entry of entries) {
    for (const change of entry.changes) {
      if (change.field !== "messages") continue;

      const value = change.value;
      if (!value.messages) continue;

      const contact = value.contacts?.[0];

      for (const msg of value.messages) {
        if (msg.type === "text" && msg.text) {
          messages.push({
            from: msg.from,
            contactName: contact?.profile?.name || "",
            text: msg.text.body,
            messageId: msg.messageId,
            timestamp: msg.timestamp,
            phoneNumberId: value.metadata.phone_number_id,
          });
        }
      }
    }
  }

  return messages;
}
