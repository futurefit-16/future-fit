import { NextRequest, NextResponse } from "next/server";

// Simple in-memory storage for demo (in production, use a database)
const waitlist: Array<{
  email: string;
  tag: string;
  timestamp: string;
}> = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, tag, timestamp } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (waitlist.some(entry => entry.email === email)) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Add to waitlist
    waitlist.push({
      email,
      tag: tag || "waitlist",
      timestamp: timestamp || new Date().toISOString(),
    });

    console.log("New waitlist entry:", { email, tag, timestamp });
    console.log("Total waitlist count:", waitlist.length);

    // In production, you would:
    // 1. Save to database (PostgreSQL, MongoDB, etc.)
    // 2. Send confirmation email
    // 3. Add to email marketing service (Mailchimp, ConvertKit, etc.)
    // 4. Track analytics

    return NextResponse.json(
      { 
        success: true, 
        message: "Successfully joined waitlist",
        position: waitlist.length 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // For admin purposes - show waitlist count
  return NextResponse.json({
    count: waitlist.length,
    entries: waitlist.map(({ email, tag, timestamp }) => ({
      email: email.replace(/(.{2}).*(@.*)/, "$1***$2"), // Partially mask emails
      tag,
      timestamp,
    })),
  });
}
