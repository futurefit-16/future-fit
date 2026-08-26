import { NextRequest, NextResponse } from "next/server";
import { generateOtp } from "@/lib/otp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\d{6,15}$/;

export async function POST(req: NextRequest) {
    try {
        const { target, type } = await req.json() as { target?: string; type?: "phone" | "email" };

        if (!target || !type) {
            return NextResponse.json({ error: "Missing target or type." }, { status: 400 });
        }

        if (type === "email" && !EMAIL_RE.test(target)) {
            return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
        }

        if (type === "phone" && !PHONE_RE.test(target.replace(/[^0-9]/g, ""))) {
            return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
        }

        const key = type === "phone" ? target.replace(/[^0-9]/g, "") : target.toLowerCase();
        const otp = generateOtp(key);

        const providerConfigured = type === "phone"
            ? Boolean(process.env.SMS_API_KEY)
            : Boolean(process.env.EMAIL_API_KEY);

        // --- Integration point ---
        // Phone: Replace with Twilio / MSG91
        // Email: Replace with SendGrid / Resend / AWS SES
        console.log(`[OTP:${type}] ${key} → ${otp}`);

        return NextResponse.json({
            sent: true,
            ...(providerConfigured ? {} : { otp }),
            message: providerConfigured
                ? `OTP sent to your ${type === "phone" ? "phone" : "email"}.`
                : `Provider not configured — OTP shown for testing.`,
        });
    } catch (err) {
        console.error("OTP send error:", err);
        return NextResponse.json({ error: "Failed to send OTP. Try again." }, { status: 500 });
    }
}
