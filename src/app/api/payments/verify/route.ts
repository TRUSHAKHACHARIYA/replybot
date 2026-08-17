import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { verifyPayment, PLANS, type PlanId } from "@/lib/payments";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const isValid = await verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const plan = PLANS[planId as PlanId];
  if (!plan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const serviceClient = createServiceClient();
  if (!serviceClient) {
    return NextResponse.json({ error: "Service not configured" }, { status: 503 });
  }

  const { error: profileError } = await serviceClient
    .from("profiles")
    .update({ plan: planId })
    .eq("id", user.id);

  if (profileError) {
    console.error("Failed to update profile plan:", profileError);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }

  const { data: shops } = await serviceClient
    .from("shops")
    .select("id")
    .eq("owner_id", user.id);

  if (shops && shops.length > 0) {
    const messageLimit = plan.messages;
    for (const shop of shops) {
      await serviceClient
        .from("shops")
        .update({ messages_limit: messageLimit })
        .eq("id", shop.id);
    }
  }

  return NextResponse.json({ success: true, plan: planId });
}
