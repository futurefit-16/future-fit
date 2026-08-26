import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Future Fit — AI-Powered Streetwear";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: -4 }}>
                    F\F
                </div>
                <div style={{ fontSize: 36, color: "#a1a1aa", marginTop: 16 }}>
                    Future Fit — AI-Powered Streetwear
                </div>
                <div style={{ fontSize: 22, color: "#71717a", marginTop: 12 }}>
                    wearfuturefit.com
                </div>
            </div>
        ),
        { ...size },
    );
}
