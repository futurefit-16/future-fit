import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OrderLineItem = {
  slug: string;
  quantity: number;
};

const COGS_PER_UNIT = 450;
const SHIPPING_COST = 90;
const RAZORPAY_FEE_RATE = 0.02;

export type FulfillOrderInput = {
  razorpayOrderId: string;
  /** Order total in Rupees (already converted from paise). */
  grossAmountRupees: number;
  items: OrderLineItem[];
};

export type FulfillOrderResult = {
  success: boolean;
  orderId?: string;
  skipped?: boolean;
  error?: string;
};

/**
 * After a verified Razorpay payment: decrement catalog stock and insert a row
 * into `orders_unified`. Idempotent on `order_id` so verify + webhook can both
 * call this without double-writing.
 */
export async function fulfillVerifiedOrder(
  input: FulfillOrderInput,
): Promise<FulfillOrderResult> {
  const { razorpayOrderId, grossAmountRupees, items } = input;
  const orderId = `ORD-WEB-${razorpayOrderId}`;

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    console.error("[fulfillVerifiedOrder] Supabase client unavailable");
    return { success: false, error: "Database connection failed" };
  }

  const validItems = items.filter(
    (item) =>
      typeof item.slug === "string" &&
      item.slug.trim().length > 0 &&
      Number.isFinite(item.quantity) &&
      item.quantity > 0,
  );

  if (validItems.length === 0) {
    console.error("[fulfillVerifiedOrder] No valid line items", {
      orderId,
      items,
    });
    return { success: false, error: "No valid line items" };
  }

  if (!Number.isFinite(grossAmountRupees) || grossAmountRupees <= 0) {
    console.error("[fulfillVerifiedOrder] Invalid gross amount", {
      orderId,
      grossAmountRupees,
    });
    return { success: false, error: "Invalid gross amount" };
  }

  try {
    const { data: existing, error: existingError } = await supabase
      .from("orders_unified")
      .select("order_id")
      .eq("order_id", orderId)
      .maybeSingle();

    if (existingError) {
      console.error("[fulfillVerifiedOrder] Idempotency check failed:", existingError);
      return { success: false, error: existingError.message };
    }

    if (existing) {
      console.log(`[fulfillVerifiedOrder] Order ${orderId} already recorded — skipping`);
      return { success: true, orderId, skipped: true };
    }

    for (const item of validItems) {
      const { error: stockError } = await supabase.rpc("decrement_stock", {
        product_slug: item.slug.trim(),
        quantity_to_remove: Math.floor(item.quantity),
      });

      if (stockError) {
        console.error("[fulfillVerifiedOrder] decrement_stock failed:", {
          orderId,
          slug: item.slug,
          quantity: item.quantity,
          error: stockError,
        });
        return {
          success: false,
          error: `Stock update failed for ${item.slug}: ${stockError.message}`,
        };
      }
    }

    const totalQuantity = validItems.reduce(
      (sum, item) => sum + Math.floor(item.quantity),
      0,
    );
    const grossAmount = roundMoney(grossAmountRupees);
    const cogsAmount = roundMoney(totalQuantity * COGS_PER_UNIT);
    const marketplaceFee = roundMoney(grossAmount * RAZORPAY_FEE_RATE);

    const row = {
      order_id: orderId,
      channel: "Direct Website",
      gross_amount: grossAmount,
      cogs_amount: cogsAmount,
      marketplace_fee: marketplaceFee,
      shipping_cost: SHIPPING_COST,
      status: "delivered",
    };

    const { error: insertError } = await supabase
      .from("orders_unified")
      .insert(row);

    if (insertError) {
      // Unique violation = concurrent verify/webhook; treat as success.
      if (insertError.code === "23505") {
        console.log(
          `[fulfillVerifiedOrder] Concurrent insert for ${orderId} — treating as success`,
        );
        return { success: true, orderId, skipped: true };
      }

      console.error("[fulfillVerifiedOrder] orders_unified insert failed:", {
        orderId,
        error: insertError,
        row,
      });
      return { success: false, error: insertError.message };
    }

    console.log(`[fulfillVerifiedOrder] Recorded ${orderId}`, {
      grossAmount,
      cogsAmount,
      marketplaceFee,
      totalQuantity,
      items: validItems,
    });

    return { success: true, orderId };
  } catch (err) {
    console.error("[fulfillVerifiedOrder] Unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown fulfillment error",
    };
  }
}

/** Parse cart lines from Razorpay order/payment notes. */
export function parseOrderItemsFromNotes(
  notes: Record<string, unknown> | null | undefined,
): OrderLineItem[] {
  if (!notes || typeof notes !== "object") return [];

  const raw = notes.items;
  if (typeof raw !== "string" || !raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const slug = String((entry as { slug?: unknown }).slug ?? "").trim();
        const quantity = Number((entry as { quantity?: unknown }).quantity);
        if (!slug || !Number.isFinite(quantity) || quantity <= 0) return null;
        return { slug, quantity: Math.floor(quantity) };
      })
      .filter((item): item is OrderLineItem => item !== null);
  } catch (err) {
    console.error("[parseOrderItemsFromNotes] Failed to parse notes.items:", err);
    return [];
  }
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
