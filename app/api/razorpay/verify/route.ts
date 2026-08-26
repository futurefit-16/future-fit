import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { RateLimiter } from "@/lib/security";

export async function POST(req: NextRequest) {
    // Rate limiting based on IP
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    if (!RateLimiter.isAllowed(clientIP, 10, 60000)) { // 10 requests per minute
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate field formats
        if (typeof razorpay_order_id !== 'string' || !razorpay_order_id.startsWith('order_')) {
            return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
        }

        if (typeof razorpay_payment_id !== 'string' || !razorpay_payment_id.startsWith('pay_')) {
            return NextResponse.json({ error: "Invalid payment ID" }, { status: 400 });
        }

        if (typeof razorpay_signature !== 'string' || razorpay_signature.length !== 64) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expected = crypto
            .createHmac("sha256", key_secret)
            .update(body)
            .digest("hex");

        if (expected === razorpay_signature) {
            // Payment verified — in production, save order to DB here
            return NextResponse.json({ verified: true, paymentId: razorpay_payment_id });
        }

        return NextResponse.json({ verified: false, error: "Invalid signature" }, { status: 400 });
    } catch (err) {
        console.error("Razorpay verify error:", err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Verification failed" },
            { status: 500 }
        );
    }
}
