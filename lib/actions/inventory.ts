"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateStockAfterPurchase(productSlug: string, quantity: number = 1) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    console.error("Failed to create Supabase client");
    return { success: false, error: "Database connection failed" };
  }
  
  try {
    const { error } = await supabase.rpc("decrement_stock", {
      product_slug: productSlug,
      quantity_to_remove: quantity,
    });

    if (error) {
      console.error("Failed to decrement stock:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Inventory update error:", err);
    return { success: false, error: "Unknown error" };
  }
}
