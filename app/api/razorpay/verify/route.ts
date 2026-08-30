import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { RateLimiter } from "@/lib/security";
import {
  fulfillVerifiedOrder,
  type OrderLineItem,
} from "@/lib/orders/fulfill-order";

type VerifyBody = {
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
  items?: unknown;
};

function normalizeItems(raw: unknown): OrderLineItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as { slug?: unknown; quantity?: unknown };
      const slug = String(record.slug ?? "").trim();
      const quantity = Number(record.quantity ?? 1);
      if (!slug || !Number.isFinite(quantity) || quantity <= 0) return null;
      return { slug, quantity: Math.floor(quantity) };
    })
    .filter((item): item is OrderLineItem => item !== null);
}

export async function POST(req: NextRequest) {
  const clientIP =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!RateLimiter.isAllowed(clientIP, 10, 60000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const key_secret =
    process.env.RAZORPAY_LIVE_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
  const key_id =
    process.env.RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_KEY_ID;

  if (!key_secret) {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }

  try {
    const body = (await req.json()) as VerifyBody;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (
      typeof razorpay_order_id !== "string" ||
      !razorpay_order_id.startsWith("order_")
    ) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    if (
      typeof razorpay_payment_id !== "string" ||
      !razorpay_payment_id.startsWith("pay_")
    ) {
      return NextResponse.json(
        { error: "Invalid payment ID" },
        { status: 400 },
      );
    }

    if (
      typeof razorpay_signature !== "string" ||
      razorpay_signature.length !== 64
    ) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 },
      );
    }

    const signedBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", key_secret)
      .update(signedBody)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Invalid signature" },
        { status: 400 },
      );
    }

    // Trust Razorpay's order amount (paise → rupees), not the client total.
    let grossAmountRupees = 0;
    if (key_id) {
      try {
        const razorpay = new Razorpay({ key_id, key_secret });
        const order = await razorpay.orders.fetch(razorpay_order_id);
        grossAmountRupees = Number(order.amount) / 100;
      } catch (fetchErr) {
        console.error(
          "[razorpay/verify] Failed to fetch order amount:",
          fetchErr,
        );
      }
    }

    const items = normalizeItems(body.items);

    const fulfillment = await fulfillVerifiedOrder({
      razorpayOrderId: razorpay_order_id,
      grossAmountRupees,
      items,
    });

    if (!fulfillment.success) {
      console.error("[razorpay/verify] Fulfillment failed after verified payment:", {
        razorpay_order_id,
        razorpay_payment_id,
        error: fulfillment.error,
      });
      // Payment is still valid — return verified so the customer is not charged
      // twice. Ops can reconcile from logs / webhook retry.
      return NextResponse.json({
        verified: true,
        paymentId: razorpay_payment_id,
        fulfillmentError: fulfillment.error,
      });
    }

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: fulfillment.orderId,
    });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 500 },
    );
  }
}
