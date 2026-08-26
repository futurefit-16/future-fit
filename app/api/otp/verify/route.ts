import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
    try {
        const { target, type, otp } = await req.json() as {
            target?: string; type?: "phone" | "email"; otp?: string;
        };

        if (!target || !type) {
            return NextResponse.json({ error: "Missing target or type." }, { status: 400 });
        }
        if (!otp || typeof otp !== "string" || otp.length < 4) {
            return NextResponse.json({ error: "Invalid OTP." }, { status: 400 });
        }

        const key = type === "phone" ? target.replace(/[^0-9]/g, "") : target.toLowerCase();
        const valid = verifyOtp(key, otp);

        if (!valid) {
            return NextResponse.json({ error: "Incorrect or expired OTP." }, { status: 400 });
        }

        return NextResponse.json({ verified: true });
    } catch (err) {
        console.error("OTP verify error:", err);
        return NextResponse.json({ error: "Verification failed." }, { status: 500 });
    }
}
