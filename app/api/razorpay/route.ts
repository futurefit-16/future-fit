import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { RazorpayOrderSchema } from "@/lib/validation";

// Simple in-memory rate limiting for Netlify
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);
    
    if (!record || now > record.resetTime) {
        rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
    }
    
    if (record.count >= limit) {
        return false;
    }
    
    record.count++;
    return true;
}

export async function POST(req: NextRequest) {
    // Simple rate limiting
    const identifier = req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       'unknown';
    
    if (!checkRateLimit(identifier, 5, 60000)) { // 5 requests per minute
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    // For now, use live keys for both development and production
    // TODO: Switch to test keys when you get them from Razorpay dashboard
    const key_id = process.env.RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_LIVE_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

    // Debug logging
    console.log("Environment check:", {
        environment: process.env.NODE_ENV,
        key_type: "LIVE",
        key_id: key_id ? "present" : "missing",
        key_secret: key_secret ? "present" : "missing",
        key_id_prefix: key_id?.substring(0, 8) || "missing"
    });

    if (!key_id || !key_secret) {
        return NextResponse.json(
            { 
                error: "Razorpay keys not configured. Set RAZORPAY_LIVE_KEY_ID and RAZORPAY_LIVE_KEY_SECRET in .env.local." 
            },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        
        // Zod validation
        const validationResult = RazorpayOrderSchema.safeParse(body);
        
        if (!validationResult.success) {
            return NextResponse.json(
                { 
                    error: "Invalid input", 
                    details: validationResult.error.errors 
                },
                { status: 400 }
            );
        }
        
        const { amount, currency = "INR", receipt } = validationResult.data;

        const razorpay = new Razorpay({ key_id, key_secret });

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Razorpay expects paise
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: key_id,
        });
    } catch (err) {
        console.error("Razorpay order error:", err);
        console.error("Error details:", {
            message: err instanceof Error ? err.message : "Unknown error",
            stack: err instanceof Error ? err.stack : undefined,
            key_id_prefix: key_id?.substring(0, 8) || "missing",
            key_secret_length: key_secret?.length || 0
        });
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Failed to create order" },
            { status: 500 }
        );
    }
}
