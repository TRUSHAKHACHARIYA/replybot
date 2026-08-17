import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const PLANS = {
  starter: {
    name: "Starter",
    price: 1500,
    messages: 300,
    description: "300 messages/month, 1 WhatsApp number",
  },
  standard: {
    name: "Standard",
    price: 2500,
    messages: 800,
    description: "800 messages/month, 2 WhatsApp numbers",
  },
  growth: {
    name: "Growth",
    price: 4000,
    messages: 2000,
    description: "2000 messages/month, 3 WhatsApp numbers, priority support",
  },
} as const;

export type PlanId = keyof typeof PLANS;

export async function createOrder(planId: PlanId, userId: string) {
  const plan = PLANS[planId];
  if (!plan) throw new Error("Invalid plan");

  const order = await razorpay.orders.create({
    amount: plan.price * 100,
    currency: "INR",
    receipt: `receipt_${userId}_${planId}_${Date.now()}`,
    notes: {
      userId,
      planId,
    },
  });

  return order;
}

export async function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) {
  const crypto = await import("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return expectedSignature === razorpay_signature;
}
