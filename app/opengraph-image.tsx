import { ImageResponse } from "next/og";
import { LOGO_WHITE_PNG_DATA_URL } from "@/lib/assets/logo-white-data-url";

export const alt = "Future Fit — Wear the Future";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Logo is inlined as a data URL so this module never calls fs.readFileSync.
// Cloudflare Workers (unenv) do not implement fs — a top-level readFileSync
// crashes every request that loads this chunk.

export default function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0a0a0a",
                    color: "#ffffff",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={LOGO_WHITE_PNG_DATA_URL}
                    alt="Future Fit"
                    width={620}
                    height={296}
                />
                <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 40 }}>
                    240 GSM Heavyweight Streetwear · India
                </div>
                <div style={{ fontSize: 22, color: "#71717a", marginTop: 14 }}>
                    wearfuturefit.com
                </div>
            </div>
        ),
        { ...size },
    );
}
