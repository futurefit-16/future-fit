import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  fulfillVerifiedOrder,
  parseOrderItemsFromNotes,
  type OrderLineItem,
} from "@/lib/orders/fulfill-order";

// Simple in-memory rate limiting for webhooks
const webhookRateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

function checkWebhookRateLimit(
  identifier: string,
  limit: number = 20,
  windowMs: number = 60000,
): boolean {
  const now = Date.now();
  const record = webhookRateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    webhookRateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

type RazorpayPayment = {
  id: string;
  order_id: string;
  amount: number;
  method?: string;
  notes?: Record<string, unknown>;
  error?: { description?: string };
};

type RazorpayOrder = {
  id: string;
  amount: number;
  notes?: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  const clientIP =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkWebhookRateLimit(clientIP, 20, 60000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("Missing Razorpay signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const webhookData = JSON.parse(body) as {
      event: string;
      payload?: {
        payment?: { entity?: RazorpayPayment };
        order?: { entity?: RazorpayOrder };
      };
    };
    console.log("Webhook received:", webhookData.event);

    switch (webhookData.event) {
      case "payment.captured":
        await handlePaymentCaptured(webhookData.payload?.payment?.entity);
        break;

      case "payment.failed":
        await handlePaymentFailed(webhookData.payload?.payment?.entity);
        break;

      case "order.paid":
        await handleOrderPaid(webhookData.payload?.order?.entity);
        break;

      default:
        console.log(`Unhandled webhook event: ${webhookData.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function loadOrderNotes(
  razorpayOrderId: string,
): Promise<Record<string, unknown> | undefined> {
  const key_id =
    process.env.RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_KEY_ID;
  const key_secret =
    process.env.RAZORPAY_LIVE_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return undefined;

  try {
    const razorpay = new Razorpay({ key_id, key_secret });
    const order = await razorpay.orders.fetch(razorpayOrderId);
    return (order.notes as Record<string, unknown> | undefined) ?? undefined;
  } catch (err) {
    console.error(
      "[webhooks/razorpay] Failed to fetch order notes:",
      razorpayOrderId,
      err,
    );
    return undefined;
  }
}

async function fulfillFromWebhook(params: {
  razorpayOrderId: string;
  amountPaise: number;
  notes?: Record<string, unknown>;
  items?: OrderLineItem[];
}) {
  let items =
    params.items && params.items.length > 0
      ? params.items
      : parseOrderItemsFromNotes(params.notes);

  // payment.captured often has empty notes; fall back to the parent order.
  if (items.length === 0) {
    const orderNotes = await loadOrderNotes(params.razorpayOrderId);
    items = parseOrderItemsFromNotes(orderNotes);
  }

  if (items.length === 0) {
    console.error(
      "[webhooks/razorpay] No line items in notes — cannot fulfill",
      { orderId: params.razorpayOrderId },
    );
    return;
  }

  const result = await fulfillVerifiedOrder({
    razorpayOrderId: params.razorpayOrderId,
    grossAmountRupees: params.amountPaise / 100,
    items,
  });

  if (!result.success) {
    console.error("[webhooks/razorpay] Fulfillment failed:", result.error);
    throw new Error(result.error || "Fulfillment failed");
  }
}

async function handlePaymentCaptured(payment?: RazorpayPayment) {
  if (!payment?.order_id) {
    console.error("[webhooks/razorpay] payment.captured missing order_id");
    return;
  }

  try {
    await fulfillFromWebhook({
      razorpayOrderId: payment.order_id,
      amountPaise: payment.amount,
      notes: payment.notes,
    });

    // Best-effort legacy `orders` update (table may not exist in all envs).
    const supabase = createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_id: payment.id,
          payment_method: payment.method,
          payment_amount: payment.amount / 100,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", payment.order_id);

      if (error) {
        console.warn(
          "[webhooks/razorpay] Legacy orders update skipped/failed:",
          error.message,
        );
      }
    }

    if (payment.notes?.affiliate_id) {
      console.log(`Affiliate commission for ${payment.notes.affiliate_id}`);
    }
  } catch (error) {
    console.error("Error in handlePaymentCaptured:", error);
    throw error;
  }
}

async function handlePaymentFailed(payment?: RazorpayPayment) {
  if (!payment?.order_id) return;

  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return;

    const { error } = await supabase
      .from("orders")
      .update({
        status: "failed",
        payment_id: payment.id,
        error_description: payment.error?.description || "Payment failed",
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", payment.order_id);

    if (error) {
      console.warn(
        "[webhooks/razorpay] Legacy failed-order update skipped/failed:",
        error.message,
      );
    }

    console.log(`Payment failed for order ${payment.order_id}`);
  } catch (error) {
    console.error("Error in handlePaymentFailed:", error);
    throw error;
  }
}

async function handleOrderPaid(order?: RazorpayOrder) {
  if (!order?.id) {
    console.error("[webhooks/razorpay] order.paid missing order id");
    return;
  }

  try {
    // Backup path when the browser verify call never reached the server.
    await fulfillFromWebhook({
      razorpayOrderId: order.id,
      amountPaise: order.amount,
      notes: order.notes,
    });
    console.log(`Order paid and fulfilled: ${order.id}`);
  } catch (error) {
    console.error("Error in handleOrderPaid:", error);
    throw error;
  }
}
