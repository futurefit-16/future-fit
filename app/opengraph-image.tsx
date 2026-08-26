import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Future Fit — Wear the Future";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Inlined at build time: this route is prerendered, so the public/ directory is
// still on disk. Fetching over HTTP would fail during the build.
const logo = readFileSync(join(process.cwd(), "public", "logo-white.png"));
const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
                <img src={logoSrc} alt="Future Fit" width={620} height={296} />
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
