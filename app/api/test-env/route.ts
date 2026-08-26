import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        razorpay_key_id: process.env.RAZORPAY_KEY_ID ? "present" : "missing",
        razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET ? "present" : "missing",
        node_env: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
}
