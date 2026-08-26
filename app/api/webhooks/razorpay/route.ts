import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Simple in-memory rate limiting for webhooks
const webhookRateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkWebhookRateLimit(identifier: string, limit: number = 20, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = webhookRateLimitStore.get(identifier);
    
    if (!record || now > record.resetTime) {
        webhookRateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
    }
    
    if (record.count >= limit) {
        return false;
    }
    
    record.count++;
    return true;
}

export async function POST(req: NextRequest) {
  // Rate limiting for webhook endpoint
  const clientIP = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  
  if (!checkWebhookRateLimit(clientIP, 20, 60000)) { // 20 requests per minute
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  try {
    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error("Missing Razorpay signature");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Parse the webhook payload
    const webhookData = JSON.parse(body);
    console.log("Webhook received:", webhookData.event);

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Handle different webhook events
    switch (webhookData.event) {
      case 'payment.captured':
        await handlePaymentCaptured(webhookData.payload.payment.entity, supabase);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(webhookData.payload.payment.entity, supabase);
        break;
      
      case 'order.paid':
        await handleOrderPaid(webhookData.payload.order.entity, supabase);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${webhookData.event}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment: any, supabase: any) {
  try {
    // Update order status in database
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_id: payment.id,
        payment_method: payment.method,
        payment_amount: payment.amount / 100, // Convert from paise to rupees
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', payment.order_id);

    if (error) {
      console.error("Error updating order:", error);
      throw error;
    }

    console.log(`Payment captured for order ${payment.order_id}`);
    
    // Trigger affiliate commission tracking
    if (payment.notes?.affiliate_id) {
      // TODO: Implement affiliate commission tracking
      console.log(`Affiliate commission for ${payment.notes.affiliate_id}`);
    }

  } catch (error) {
    console.error("Error in handlePaymentCaptured:", error);
    throw error;
  }
}

async function handlePaymentFailed(payment: any, supabase: any) {
  try {
    // Update order status to failed
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'failed',
        payment_id: payment.id,
        error_description: payment.error?.description || 'Payment failed',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', payment.order_id);

    if (error) {
      console.error("Error updating failed order:", error);
      throw error;
    }

    console.log(`Payment failed for order ${payment.order_id}`);

  } catch (error) {
    console.error("Error in handlePaymentFailed:", error);
    throw error;
  }
}

async function handleOrderPaid(order: any, supabase: any) {
  try {
    // Additional order processing if needed
    console.log(`Order paid: ${order.id}`);
    
    // Update inventory (if not already done)
    // This is a backup in case frontend inventory update failed
    
  } catch (error) {
    console.error("Error in handleOrderPaid:", error);
    throw error;
  }
}
