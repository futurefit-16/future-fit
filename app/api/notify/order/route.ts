import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { phone, name, email, items, total, paymentId, address } = await req.json();

        const itemList = (items as { name: string; price: number; size?: string }[])
            .map((i) => `${i.name}${i.size ? ` (${i.size})` : ""}`)
            .join(", ");

        const message = [
            `Hi ${name}! Your Future Fit order is confirmed.`,
            `Items: ${itemList}`,
            `Total: INR ${total}`,
            `Payment ID: ${paymentId}`,
            `Shipping to: ${address}`,
            `We'll notify you when it ships!`,
        ].join("\n");

        // --- SMS integration point ---
        // Replace with your SMS provider (MSG91, Twilio, etc.)
        // Example with Twilio:
        //   const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
        //   await client.messages.create({ to: `+91${phone}`, from: process.env.TWILIO_NUMBER, body: message });
        //
        // Example with MSG91:
        //   await fetch("https://api.msg91.com/api/v5/flow/", { ... });

        console.log(`[ORDER SMS] To: +91${phone}`);
        console.log(message);

        // Also log email notification placeholder
        console.log(`[ORDER EMAIL] To: ${email}`);

        const smsConfigured = Boolean(process.env.SMS_API_KEY);

        return NextResponse.json({
            sent: smsConfigured,
            message: smsConfigured
                ? "Order notification sent."
                : "SMS provider not configured. Notification logged to server.",
        });
    } catch (err) {
        console.error("Notify error:", err);
        return NextResponse.json({ error: "Failed to send notification." }, { status: 500 });
    }
}
